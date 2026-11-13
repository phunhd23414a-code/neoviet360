# NeoViet360 Data Dictionary

## Scope

This document describes the current OLTP tables used as the source for analytics. The application schema is defined in `neoviet360-backend/prisma/schema.prisma`.

## Core tables

| Table | Grain | Purpose |
|---|---|---|
| `users` | One row per user | Identity and account ownership |
| `accounts` | One row per financial account | Balance and account metadata |
| `transactions` | One row per financial event | Income, expense, transfer, payment, or withdrawal |
| `budgets` | One row per user/category/period | Spending limits |
| `savings_goals` | One row per savings goal | Target and progress tracking |
| `loans` | One row per loan | Debt and repayment information |
| `cards` | One row per payment card | Card metadata and spending |
| `bills` | One row per bill | Upcoming or recurring obligations |

## `transactions`

| Column | Type | Meaning | Analytics use |
|---|---|---|---|
| `id` | text | Unique transaction identifier | Fact key |
| `user_id` | text | Owner of the transaction | User-level grouping |
| `from_account_id` | text | Source account | Account flow |
| `to_account_id` | text | Destination account | Transfer flow |
| `amount` | decimal(18,2) | Transaction amount in the transaction currency | Spending and cashflow |
| `currency` | text | Currency code | Currency normalization |
| `category` | text | Business category | Category analysis |
| `description` | text | Optional free-text description | Text analysis later |
| `type` | enum | `INCOME`, `EXPENSE`, `TRANSFER`, `TOPUP`, `PAYMENT`, or `WITHDRAWAL` | Cashflow classification |
| `status` | enum | Transaction lifecycle status | Exclude failed transactions |
| `created_at` | timestamp | Event creation time | Time series and features |
| `updated_at` | timestamp | Last update time | Freshness and audit |

## Analytics definitions

### Total income

Sum of completed transactions where `type = INCOME`.

### Total expense

Sum of completed transactions where `type = EXPENSE`.

### Net cashflow

```text
total income - total expense
```

### Savings rate

```text
net cashflow / total income * 100
```

When total income is zero, savings rate is NULL rather than zero.

### Completed transaction

Only records with `status = COMPLETED` are included in financial aggregates unless a query explicitly states otherwise.

## Data limitations

- The current transaction model does not have a merchant identifier.
- Categories are free-form text rather than a foreign key.
- The source schema does not yet include a dedicated event date separate from `created_at`.
- Initial seed data is synthetic and should not be presented as real customer data.
- Currency conversion is not applied in the first analytics version.
