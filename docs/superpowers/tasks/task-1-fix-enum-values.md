# Task Brief: Fix Enum Values in seed.js

## Task Name
Fix Enum Values in seed.js to Match Postgres Schema

## Problem

The Prisma `schema.prisma` defines these enums:
- `RewardType`: EARN, REDEEM, ADJUST
- `NotificationType`: SYSTEM, TRANSACTION, BUDGET, BILL, REWARD, SECURITY

When Prisma generates the client, it creates TypeScript enums like:
```ts
export const RewardType = {
  Earn: 'EARN',
  Redeem: 'REDEEM',
  Adjust: 'ADJUST'
} as const
```

The seed.js currently uses raw strings like `"EARN"` and `"REWARD"`. While these work at runtime with Postgres, Prisma's generated client expects the enum values as **string literals matching the enum member names** (e.g. `"EARN"` for the `EARN` value in the Postgres enum).

The real issue is that when `prisma generate` runs, the TypeScript types are derived from the DB enum values. The seed.js needs to use the exact string values that Postgres enum contains: `"EARN"`, `"REDEEM"`, `"ADJUST"` for RewardType and `"SYSTEM"`, `"TRANSACTION"`, `"BUDGET"`, `"BILL"`, `"REWARD"`, `"SECURITY"` for NotificationType.

## Solution

Update `seed.js` to use raw string values that match the Postgres enum exactly:

### RewardType values (from schema.prisma):
- `"EARN"` ✅ (already correct)
- `"REDEEM"` — add
- `"ADJUST"` — add

### NotificationType values (from schema.prisma):
- `"SYSTEM"` ✅ (already correct)  
- `"TRANSACTION"` — add
- `"BUDGET"` — add
- `"BILL"` — add
- `"REWARD"` ✅ (already correct)
- `"SECURITY"` — add

## Files to Modify

### neoviet360-backend/prisma/seed.js

Replace the `Reward.createMany` data:
```js
// Before (line 118-124):
{ userId: user.id, points: 150, type: "EARN", description: "Welcome bonus", createdAt: new Date() },
{ userId: user.id, points: 50, type: "EARN", description: "Transfer reward", createdAt: new Date() }

// After: Add REDEEM type for variety:
{ userId: user.id, points: 150, type: "EARN", description: "Welcome bonus", createdAt: new Date() },
{ userId: user.id, points: 50, type: "EARN", description: "Transfer reward", createdAt: new Date() },
{ userId: user.id, points: -20, type: "ADJUST", description: "Correction", createdAt: new Date() }
```

Replace the `Notification.createMany` data:
```js
// Before (line 127-132):
{ userId: user.id, type: "SYSTEM", title: "Chào mừng", message: "Chào mừng bạn đến với NeoViet 360!", isRead: false },
{ userId: user.id, type: "REWARD", title: "Nhận thưởng", message: "Bạn đã nhận được 50 NeoPoints từ giao dịch!", isRead: false }

// After: Use valid NotificationType values:
{ userId: user.id, type: "SYSTEM", title: "Chào mừng", message: "Chào mừng bạn đến với NeoViet 360!", isRead: false },
{ userId: user.id, type: "REWARD", title: "Nhận thưởng", message: "Bạn đã nhận được 50 NeoPoints từ giao dịch!", isRead: false },
{ userId: user.id, type: "SECURITY", title: "Đăng nhập mới", message: "Phát hiện đăng nhập từ thiết bị mới", isRead: false },
{ userId: user.id, type: "BUDGET", title: "Cảnh báo ngân sách", message: "Bạn đã chi tiêu 80% ngân sách tháng này", isRead: false }
```

## Verification

After modifying seed.js:
1. Run `node neoviet360-backend/prisma/seed.js` — should complete without error
2. Verify data inserted correctly by checking the database tables

## Working Directory
`neoviet360-backend/`