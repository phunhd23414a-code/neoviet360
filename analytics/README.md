# Analytics foundation

This directory contains SQL analysis assets and the reproducible dataset tools for the NeoViet360 Data Science roadmap.

## Current source

The application source of truth is the `public` schema in Supabase:

- `users`
- `accounts`
- `transactions`
- `budgets`
- related financial tables

The SQL files in `sql/` are read-only analysis queries. They do not modify application data.

## Run order

1. Run the quality checks in `sql/00_data_quality_checks.sql`.
2. Resolve or document any failed checks.
3. Apply the Prisma migration that creates the `analytics` schema.
4. Run `sql/10_refresh_analytics.sql` to load dimensions and aggregate facts.
5. Run the analysis queries.
6. Export the query results for notebooks or dashboards.

`10_refresh_analytics.sql` is a deliberately simple full-refresh pipeline for
the first version. It is safe to rerun and is suitable for a scheduled job
until incremental loading is implemented.

## Synthetic dataset

Generate a local portfolio dataset:

```powershell
python src/data_generation/generate_dataset.py `
  --users 100 `
  --transactions-per-user 500 `
  --months 24 `
  --output-dir data/generated
```

The generated files are ignored by Git. To load them into isolated Supabase
staging tables, install `requirements-data.txt`, set `DATABASE_URL`, and run:

```powershell
python src/pipeline/load_synthetic_staging.py `
  --input-dir data/generated `
  --confirm-staging
```

The loader only truncates and writes `analytics.staging_synthetic_*`; it does
not modify `public.users` or `public.transactions`.

Do not commit database credentials or exported personal data.
