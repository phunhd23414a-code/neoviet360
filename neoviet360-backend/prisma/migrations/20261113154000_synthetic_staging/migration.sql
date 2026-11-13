-- Isolated staging tables for portfolio data. They are not application tables
-- and are never read by the product API.

CREATE TABLE IF NOT EXISTS analytics.staging_synthetic_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    income_monthly NUMERIC(18, 2) NOT NULL,
    created_at DATE NOT NULL,
    loaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics.staging_synthetic_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    currency TEXT NOT NULL,
    category TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    loaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS staging_synthetic_transactions_user_date_idx
    ON analytics.staging_synthetic_transactions (user_id, created_at);
