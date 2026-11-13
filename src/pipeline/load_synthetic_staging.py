"""Load generated CSV data into isolated Supabase analytics staging tables."""

from __future__ import annotations

import argparse
import csv
import os
from pathlib import Path

import psycopg


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=Path("data") / "generated")
    parser.add_argument(
        "--confirm-staging",
        action="store_true",
        help="Required before replacing the synthetic staging tables.",
    )
    return parser.parse_args()


def load_csv(connection: psycopg.Connection, path: Path, table: str, columns: str) -> int:
    with path.open(newline="", encoding="utf-8") as source:
        rows = list(csv.DictReader(source))
    if not rows:
        raise ValueError(f"{path} is empty")

    with connection.cursor() as cursor:
        cursor.execute(f"TRUNCATE analytics.{table}")
        with cursor.copy(
            f"COPY analytics.{table} ({columns}) FROM STDIN WITH (FORMAT csv, HEADER true)"
        ) as copy:
            with path.open("rb") as binary_source:
                while chunk := binary_source.read(1024 * 1024):
                    copy.write(chunk)
    return len(rows)


def main() -> None:
    args = parse_args()
    if not args.confirm_staging:
        raise SystemExit(
            "Refusing to load data. Re-run with --confirm-staging to replace "
            "the isolated synthetic staging tables."
        )

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise SystemExit("DATABASE_URL is required and must not be committed.")

    users_path = args.input_dir / "users.csv"
    transactions_path = args.input_dir / "transactions.csv"
    if not users_path.is_file() or not transactions_path.is_file():
        raise FileNotFoundError(
            f"Expected {users_path} and {transactions_path}; run the generator first."
        )

    with psycopg.connect(database_url) as connection:
        user_count = load_csv(
            connection,
            users_path,
            "staging_synthetic_users",
            "id, email, income_monthly, created_at",
        )
        transaction_count = load_csv(
            connection,
            transactions_path,
            "staging_synthetic_transactions",
            "id, user_id, amount, currency, category, transaction_type, status, created_at",
        )
        connection.commit()

    print(f"Loaded {user_count} users and {transaction_count} transactions into analytics staging")


if __name__ == "__main__":
    main()
