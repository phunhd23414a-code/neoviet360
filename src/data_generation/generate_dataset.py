"""Generate a reproducible synthetic NeoViet360 dataset.

The output is deliberately CSV so it can be inspected, loaded into a staging
database, or consumed by a notebook without requiring production credentials.
"""

from __future__ import annotations

import argparse
import csv
import random
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path


CATEGORIES = (
    "FOOD",
    "TRANSPORT",
    "SHOPPING",
    "ENTERTAINMENT",
    "BILLS",
    "HEALTH",
    "EDUCATION",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--users", type=int, default=100)
    parser.add_argument("--transactions-per-user", type=int, default=500)
    parser.add_argument("--months", type=int, default=12)
    parser.add_argument("--seed", type=int, default=20261113)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("data") / "generated",
    )
    return parser.parse_args()


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, object]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as output:
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def build_dataset(
    user_count: int,
    transactions_per_user: int,
    months: int,
    seed: int,
) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    if user_count < 1 or transactions_per_user < 1 or months < 1:
        raise ValueError("users, transactions-per-user, and months must be positive")

    generator = random.Random(seed)
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=months * 30)
    users: list[dict[str, object]] = []
    transactions: list[dict[str, object]] = []

    for user_number in range(1, user_count + 1):
        user_id = f"synthetic-user-{user_number:05d}"
        users.append(
            {
                "id": user_id,
                "email": f"synthetic{user_number:05d}@example.invalid",
                "income_monthly": generator.randrange(8_000_000, 60_000_001, 500_000),
                "created_at": start_date.date().isoformat(),
            }
        )

        monthly_income = int(users[-1]["income_monthly"])
        for _ in range(transactions_per_user):
            event_date = start_date + timedelta(
                seconds=generator.randrange(max(1, int((end_date - start_date).total_seconds())))
            )
            is_income = generator.random() < 0.18
            if is_income:
                amount = max(1, int(generator.gauss(monthly_income, monthly_income * 0.15)))
                category = "SALARY"
                transaction_type = "INCOME"
            else:
                category = generator.choice(CATEGORIES)
                base_amounts = {
                    "FOOD": 120_000,
                    "TRANSPORT": 80_000,
                    "SHOPPING": 900_000,
                    "ENTERTAINMENT": 350_000,
                    "BILLS": 1_500_000,
                    "HEALTH": 600_000,
                    "EDUCATION": 1_000_000,
                }
                amount = max(10_000, int(generator.lognormvariate(
                    0, 0.55
                ) * base_amounts[category]))
                transaction_type = "EXPENSE"

            # A small, reproducible anomaly population for model evaluation.
            if not is_income and generator.random() < 0.01:
                amount *= generator.randrange(8, 21)

            transactions.append(
                {
                    "id": str(uuid.UUID(int=generator.getrandbits(128))),
                    "user_id": user_id,
                    "amount": amount,
                    "currency": "VND",
                    "category": category,
                    "type": transaction_type,
                    "status": "COMPLETED",
                    "created_at": event_date.isoformat(),
                }
            )

    return users, transactions


def main() -> None:
    args = parse_args()
    users, transactions = build_dataset(
        args.users,
        args.transactions_per_user,
        args.months,
        args.seed,
    )
    args.output_dir.mkdir(parents=True, exist_ok=True)
    write_csv(
        args.output_dir / "users.csv",
        ["id", "email", "income_monthly", "created_at"],
        users,
    )
    write_csv(
        args.output_dir / "transactions.csv",
        ["id", "user_id", "amount", "currency", "category", "type", "status", "created_at"],
        transactions,
    )
    print(f"Generated {len(users)} users and {len(transactions)} transactions")
    print(f"Output directory: {args.output_dir.resolve()}")


if __name__ == "__main__":
    main()
