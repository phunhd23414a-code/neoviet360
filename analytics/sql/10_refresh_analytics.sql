-- Full refresh of the analytics dimensions and transaction fact.
-- Run after the analytics_foundation migration. This script is intentionally
-- idempotent and can later be moved into a scheduled ETL job.

INSERT INTO analytics.dim_date (
    date_key,
    full_date,
    year,
    quarter,
    month,
    week,
    day_of_week,
    is_weekend,
    is_month_start,
    is_month_end
)
SELECT
    TO_CHAR(calendar_date, 'YYYYMMDD')::INTEGER,
    calendar_date::date,
    EXTRACT(YEAR FROM calendar_date)::SMALLINT,
    EXTRACT(QUARTER FROM calendar_date)::SMALLINT,
    EXTRACT(MONTH FROM calendar_date)::SMALLINT,
    EXTRACT(WEEK FROM calendar_date)::SMALLINT,
    EXTRACT(DOW FROM calendar_date)::SMALLINT,
    EXTRACT(ISODOW FROM calendar_date) IN (6, 7),
    calendar_date::date = DATE_TRUNC('month', calendar_date)::date,
    calendar_date::date = (DATE_TRUNC('month', calendar_date) + INTERVAL '1 month - 1 day')::date
FROM GENERATE_SERIES(
    (SELECT COALESCE(MIN(created_at::date), CURRENT_DATE) FROM public.transactions),
    (SELECT COALESCE(MAX(created_at::date), CURRENT_DATE) FROM public.transactions),
    INTERVAL '1 day'
) AS dates(calendar_date)
ON CONFLICT (date_key) DO UPDATE SET
    full_date = EXCLUDED.full_date,
    year = EXCLUDED.year,
    quarter = EXCLUDED.quarter,
    month = EXCLUDED.month,
    week = EXCLUDED.week,
    day_of_week = EXCLUDED.day_of_week,
    is_weekend = EXCLUDED.is_weekend,
    is_month_start = EXCLUDED.is_month_start,
    is_month_end = EXCLUDED.is_month_end;

INSERT INTO analytics.dim_user (user_id, email, created_date)
SELECT id, email, created_at::date
FROM public.users
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    created_date = EXCLUDED.created_date,
    source_loaded_at = CURRENT_TIMESTAMP;

INSERT INTO analytics.dim_account (account_id, user_id, account_type, currency)
SELECT id, user_id, type::text, currency
FROM public.accounts
ON CONFLICT (account_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    account_type = EXCLUDED.account_type,
    currency = EXCLUDED.currency,
    source_loaded_at = CURRENT_TIMESTAMP;

INSERT INTO analytics.dim_category (
    category_name,
    category_group,
    is_income,
    is_expense
)
SELECT DISTINCT
    category,
    CASE WHEN type = 'INCOME'::"TransactionType" THEN 'INCOME' ELSE 'EXPENSE' END,
    type = 'INCOME'::"TransactionType",
    type = 'EXPENSE'::"TransactionType"
FROM public.transactions
WHERE category IS NOT NULL
ON CONFLICT (category_name) DO UPDATE SET
    is_income = analytics.dim_category.is_income OR EXCLUDED.is_income,
    is_expense = analytics.dim_category.is_expense OR EXCLUDED.is_expense,
    category_group = CASE
        WHEN analytics.dim_category.is_income OR EXCLUDED.is_income THEN 'MIXED_OR_INCOME'
        ELSE 'EXPENSE'
    END,
    source_loaded_at = CURRENT_TIMESTAMP;

INSERT INTO analytics.fact_transaction (
    transaction_id,
    user_key,
    date_key,
    account_key,
    category_key,
    amount,
    currency,
    transaction_type,
    transaction_status,
    source_created_at
)
SELECT
    t.id,
    u.user_key,
    TO_CHAR(t.created_at::date, 'YYYYMMDD')::INTEGER,
    a.account_key,
    c.category_key,
    t.amount,
    t.currency,
    t.type::text,
    t.status::text,
    t.created_at
FROM public.transactions AS t
JOIN analytics.dim_user AS u ON u.user_id = t.user_id
JOIN analytics.dim_category AS c ON c.category_name = t.category
LEFT JOIN analytics.dim_account AS a ON a.account_id = t.from_account_id
ON CONFLICT (transaction_id) DO UPDATE SET
    user_key = EXCLUDED.user_key,
    date_key = EXCLUDED.date_key,
    account_key = EXCLUDED.account_key,
    category_key = EXCLUDED.category_key,
    amount = EXCLUDED.amount,
    currency = EXCLUDED.currency,
    transaction_type = EXCLUDED.transaction_type,
    transaction_status = EXCLUDED.transaction_status,
    source_created_at = EXCLUDED.source_created_at,
    loaded_at = CURRENT_TIMESTAMP;

TRUNCATE analytics.fact_daily_cashflow;

INSERT INTO analytics.fact_daily_cashflow (
    user_key,
    date_key,
    total_income,
    total_expense,
    net_cashflow,
    transaction_count
)
SELECT
    f.user_key,
    f.date_key,
    COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'INCOME' AND f.transaction_status = 'COMPLETED'), 0),
    COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'EXPENSE' AND f.transaction_status = 'COMPLETED'), 0),
    COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'INCOME' AND f.transaction_status = 'COMPLETED'), 0)
      - COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'EXPENSE' AND f.transaction_status = 'COMPLETED'), 0),
    COUNT(*)
FROM analytics.fact_transaction AS f
GROUP BY f.user_key, f.date_key;

TRUNCATE analytics.fact_monthly_spending;

INSERT INTO analytics.fact_monthly_spending (
    user_key,
    month_key,
    total_income,
    total_expense,
    net_cashflow,
    saving_rate,
    transaction_count
)
SELECT
    f.user_key,
    (f.date_key / 100) * 100 + 1,
    COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'INCOME' AND f.transaction_status = 'COMPLETED'), 0),
    COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'EXPENSE' AND f.transaction_status = 'COMPLETED'), 0),
    COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'INCOME' AND f.transaction_status = 'COMPLETED'), 0)
      - COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'EXPENSE' AND f.transaction_status = 'COMPLETED'), 0),
    ROUND(
        100 * (
            COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'INCOME' AND f.transaction_status = 'COMPLETED'), 0)
            - COALESCE(SUM(f.amount) FILTER (WHERE f.transaction_type = 'EXPENSE' AND f.transaction_status = 'COMPLETED'), 0)
        ) / NULLIF(SUM(f.amount) FILTER (WHERE f.transaction_type = 'INCOME' AND f.transaction_status = 'COMPLETED'), 0),
        4
    ),
    COUNT(*)
FROM analytics.fact_transaction AS f
GROUP BY f.user_key, (f.date_key / 100) * 100 + 1;
