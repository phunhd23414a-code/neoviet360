-- Monthly income, expense, net cashflow, and savings rate by user.
SELECT
    t.user_id,
    DATE_TRUNC('month', t.created_at)::date AS month_start,
    SUM(t.amount) FILTER (
        WHERE t.type = 'INCOME'::"TransactionType"
          AND t.status = 'COMPLETED'::"TransactionStatus"
    ) AS total_income,
    SUM(t.amount) FILTER (
        WHERE t.type = 'EXPENSE'::"TransactionType"
          AND t.status = 'COMPLETED'::"TransactionStatus"
    ) AS total_expense,
    COALESCE(SUM(t.amount) FILTER (
        WHERE t.type = 'INCOME'::"TransactionType"
          AND t.status = 'COMPLETED'::"TransactionStatus"
    ), 0)
    - COALESCE(SUM(t.amount) FILTER (
        WHERE t.type = 'EXPENSE'::"TransactionType"
          AND t.status = 'COMPLETED'::"TransactionStatus"
    ), 0) AS net_cashflow,
    ROUND(
        100 * (
            COALESCE(SUM(t.amount) FILTER (
                WHERE t.type = 'INCOME'::"TransactionType"
                  AND t.status = 'COMPLETED'::"TransactionStatus"
            ), 0)
            - COALESCE(SUM(t.amount) FILTER (
                WHERE t.type = 'EXPENSE'::"TransactionType"
                  AND t.status = 'COMPLETED'::"TransactionStatus"
            ), 0)
        ) / NULLIF(SUM(t.amount) FILTER (
            WHERE t.type = 'INCOME'::"TransactionType"
              AND t.status = 'COMPLETED'::"TransactionStatus"
        ), 0),
        2
    ) AS savings_rate_percent
FROM public.transactions AS t
GROUP BY t.user_id, DATE_TRUNC('month', t.created_at)::date
ORDER BY t.user_id, month_start;
