-- Completed expense distribution by user and category.
WITH category_totals AS (
    SELECT
        user_id,
        category,
        SUM(amount) AS total_expense,
        COUNT(*) AS transaction_count
    FROM public.transactions
    WHERE type = 'EXPENSE'::"TransactionType"
      AND status = 'COMPLETED'::"TransactionStatus"
    GROUP BY user_id, category
)
SELECT
    user_id,
    category,
    total_expense,
    transaction_count,
    ROUND(
        100 * total_expense
        / NULLIF(SUM(total_expense) OVER (PARTITION BY user_id), 0),
        2
    ) AS expense_share_percent
FROM category_totals
ORDER BY user_id, total_expense DESC;
