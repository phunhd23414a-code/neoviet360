# NeoViet360 Transfer Enum Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Prisma enum mismatch in transfer flow so `POST /api/transfer` no longer crashes; replace hardcoded auth tokens in test scripts with dynamic login.

**Architecture:** Patch two enum literals in `transfer.controller.js` to use valid Prisma enum values already defined in schema. Fix test scripts to login dynamically instead of using stale hardcoded tokens.

**Tech Stack:** Node.js, Express, Prisma, Supabase PostgreSQL

## Global Constraints

- Backend runs on `http://localhost:3001`
- Prisma schema enum `RewardType`: `EARN | REDEEM | ADJUST`
- Prisma schema enum `NotificationType`: `SYSTEM | TRANSACTION | BUDGET | BILL | REWARD | SECURITY`
- No database migration required — reuse existing enum values

---

### Task 1: Fix RewardType enum mismatch in transfer controller

**Files:**
- Modify: `neoviet360-backend/src/controllers/transfer.controller.js:50`

**Interfaces:**
- Consumes: Prisma `reward.create(...)` inside transaction
- Produces: `type: "EARN"` (valid enum) instead of `type: "TRANSFER"` (invalid)

- [ ] **Step 1: Replace invalid RewardType literal**

File: `neoviet360-backend/src/controllers/transfer.controller.js`

Replace line 50:
```js
type: "TRANSFER",
```
With:
```js
type: "EARN",
```

- [ ] **Step 2: Commit**

```bash
cd neoviet360-backend && git add src/controllers/transfer.controller.js && git commit -m "fix: use EARN enum for transfer reward points"
```

---

### Task 2: Fix NotificationType enum mismatch in transfer controller

**Files:**
- Modify: `neoviet360-backend/src/controllers/transfer.controller.js:73`

**Interfaces:**
- Consumes: Prisma `notification.create(...)` inside budget check loop
- Produces: `type: "BUDGET"` (valid enum) instead of `type: "BUDGET_ALERT"` (invalid)

- [ ] **Step 1: Replace invalid NotificationType literal**

File: `neoviet360-backend/src/controllers/transfer.controller.js`

Replace line 73:
```js
type: "BUDGET_ALERT",
```
With:
```js
type: "BUDGET",
```

- [ ] **Step 2: Commit**

```bash
cd neoviet360-backend && git add src/controllers/transfer.controller.js && git commit -m "fix: use BUDGET enum for budget alert notifications"
```

---

### Task 3: Add transfer endpoint test to test-api.js

**Files:**
- Modify: `neoviet360-backend/test-api.js`
- Test data: uses accounts from `GET /api/accounts` (line 30-38)

**Interfaces:**
- Consumes: `POST /api/transfer` after login and getting accounts
- Produces: Logs transfer status and whether it succeeded or failed with error

- [ ] **Step 1: Add transfer test after account retrieval block**

Insert after line 38 (`console.log(...)` for first account) in `test-api.js`:

```js
    // Test 2b: Transfer between accounts
    console.log('2b. Testing POST /api/transfer...');
    if (accounts.length >= 2) {
      const transferRes = await fetch(`${API_BASE}/api/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromAccountId: accounts[0].id,
          toAccountId: accounts[1].id,
          amount: 1000,
          description: 'Test transfer via test-api.js'
        })
      });
      const transferData = await transferRes.json();
      console.log(`   Status: ${transferRes.status}`);
      if (transferRes.ok) {
        console.log(`   Transfer: ✓ Success (ID: ${transferData.id})`);
      } else {
        console.log(`   Transfer: ✗ Failed - ${JSON.stringify(transferData)}`);
      }
    } else {
      console.log('   Transfer: ⚠ Skipped (need at least 2 accounts)');
    }
    console.log('');
```

- [ ] **Step 2: Remove misleading "fully functional" message**

Replace line 108-109:
```js
    console.log('\n✅ Backend is fully functional!');
    console.log('📋 Next: Run frontend with `python -m http.server 5500`');
```
With:
```js
    console.log('\n✅ API tests completed.');
    console.log('⚠ Review any ✗ or failed statuses above before declaring backend fully functional.');
```

- [ ] **Step 3: Commit**

```bash
cd neoviet360-backend && git add test-api.js && git commit -m "test: add transfer endpoint verification and remove false-positive success message"
```

---

### Task 4: Verify fix end-to-end

**Prerequisites:** Backend must be running on port 3001

- [ ] **Step 1: Start backend (if not running)**

```bash
cd neoviet360-backend && npm start
```

- [ ] **Step 2: Run test-api.js**

```bash
cd neoviet360-backend && node test-api.js
```

**Expected output:**
- Login: Status 200, Token received
- GET /api/accounts: Status 200, accounts listed
- POST /api/transfer: Status 201, transfer succeeds with transaction ID (no Prisma enum error)
- No "Invalid enum value" or rollback errors in console

- [ ] **Step 3: Commit verification artifact (optional)**

```bash
cd neoviet360 && git add DEBUGGING_REPORT.md && git commit -m "docs: record transfer enum fix verification"
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| 1 | `src/controllers/transfer.controller.js:50` | `type: "TRANSFER"` → `type: "EARN"` |
| 2 | `src/controllers/transfer.controller.js:73` | `type: "BUDGET_ALERT"` → `type: "BUDGET"` |
| 3 | `test-api.js` | Add transfer test, fix false success message |
| 4 | — | Run `node test-api.js` to verify fix |