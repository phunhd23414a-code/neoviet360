-- Data quality checks for the public OLTP schema.
-- Each query returns rows that need investigation. An empty result is expected.

-- Transactions with invalid or missing ownership.
SELECT t.id, t.user_id, t.amount, t.created_at
FROM public.transactions AS t
LEFT JOIN public.users AS u ON u.id = t.user_id
WHERE u.id IS NULL
   OR t.amount IS NULL
   OR t.currency IS NULL
   OR t.category IS NULL;

-- Transactions dated in the future.
SELECT id, user_id, created_at
FROM public.transactions
WHERE created_at > CURRENT_TIMESTAMP;

-- Accounts whose owner does not match the transaction owner.
SELECT t.id AS transaction_id, t.user_id, a.id AS account_id, a.user_id AS account_user_id
FROM public.transactions AS t
JOIN public.accounts AS a
  ON a.id = t.from_account_id OR a.id = t.to_account_id
WHERE a.user_id <> t.user_id;

-- Duplicate transaction fingerprints. The application currently has no
-- merchant identifier, so this is a review queue rather than a hard constraint.
SELECT
    user_id,
    created_at,
    amount,
    category,
    COUNT(*) AS duplicate_count
FROM public.transactions
GROUP BY user_id, created_at, amount, category
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Summary metrics for a data-quality report.
SELECT
    COUNT(*) AS transaction_count,
    COUNT(*) FILTER (WHERE amount IS NULL) AS null_amount_count,
    COUNT(*) FILTER (WHERE user_id IS NULL) AS null_user_count,
    COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP) AS future_date_count,
    MIN(created_at) AS earliest_transaction,
    MAX(created_at) AS latest_transaction
FROM public.transactions;
