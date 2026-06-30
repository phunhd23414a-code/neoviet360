# Neoviet360 Backend-First Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển `neoviet360` từ kiến trúc mock-first hybrid sang backend-first architecture cho các core flows gồm auth, accounts, transactions, transfer, payments, cùng verification tối thiểu để app có thể maintain và mở rộng an toàn.

**Architecture:** Thực thi theo thứ tự: audit source-of-truth → chuẩn hóa API contract → chuẩn hóa frontend data layer → tích hợp read flows → tích hợp mutation flows → khóa regression bằng test/script. Frontend tiếp tục giữ cấu trúc hiện tại để hạn chế rework sớm, nhưng thêm các interface/domain contracts rõ ràng trong `utils/api.js`, `utils/api-adapter.js`, và `utils/state.js` trước khi refactor module/domain sâu hơn.

**Tech Stack:** Vanilla JavaScript, Node.js, Express, Prisma, browser localStorage/service worker, custom Node tests, JSON mock datasets

## Global Constraints

- Ưu tiên correctness của kiến trúc hơn tốc độ vá lỗi ngắn hạn.
- Backend phải là source of truth cho các production-like core flows.
- Frontend không được tiếp tục dùng `data/*.json` làm nguồn dữ liệu chính cho auth, accounts, transactions, transfer, payments.
- `localStorage` chỉ được dùng cho session persistence, UX cache nhẹ, hoặc feature flags; không được là ledger chính cho số dư/giao dịch.
- Không refactor đại trà toàn bộ thư mục ngay từ đầu; ưu tiên ổn định contract và data-flow trước.
- Các thay đổi phải giữ backward-compatible tối đa ở public interfaces đang được pages/components gọi tới.
- Mỗi mutation thành công phải có chiến lược đồng bộ lại accounts + transactions.
- Mọi task phải có verification command rõ ràng.
- Chỉ xóa mock dependency khỏi core flows sau khi backend-backed flow tương ứng đã pass verify.
- Phase module/domain refactor sâu chỉ bắt đầu sau khi Phase read/mutation integration ổn định.

---

### Task 1: Audit current truth sources for core domains

**Files:**
- Create: `docs/superpowers/audits/2026-06-24-neoviet360-core-truth-source-audit.md`
- Read for context only:
  - `utils/state.js`
  - `utils/api.js`
  - `utils/api-adapter.js`
  - `utils/auth.js`
  - `pages/LoginPage.js`
  - `pages/DashboardPage.js`
  - `pages/ActivityPage.js`
  - `banking/transfer.js`
  - `payment/topup.js`
  - `payment/bill-pay.js`
  - `payment/scheduled.js`
  - `payment/split-bill.js`
  - `payment/ewallet.js`
  - `payment/qr-pay.js`
  - `data/accounts.json`
  - `data/transactions.json`
  - `data/user.json`
  - `neoviet360-backend/src/routes/auth.routes.js`
  - `neoviet360-backend/src/routes/accounts.routes.js`
  - `neoviet360-backend/src/routes/transactions.routes.js`
  - `neoviet360-backend/src/routes/transfer.routes.js`
  - `neoviet360-backend/src/routes/payment.routes.js`

**Interfaces:**
- Consumes:
  - existing frontend state loaders in `utils/state.js`
  - current auth helpers in `utils/auth.js`
  - backend routes under `neoviet360-backend/src/routes/*.routes.js`
- Produces:
  - audit document with exact sections:
    - `## Auth`
    - `## Accounts`
    - `## Transactions`
    - `## Transfer`
    - `## Payments`
    - `## Dashboard / Activity / Insights`
  - per section tables with columns:
    - `Surface`
    - `Current Truth Source`
    - `Read Path`
    - `Write Path`
    - `Target Truth Source`
    - `Notes`

- [ ] **Step 1: Create the audit document skeleton**

Write this file skeleton to `docs/superpowers/audits/2026-06-24-neoviet360-core-truth-source-audit.md`:

```md
# Neoviet360 Core Truth Source Audit

Date: 2026-06-24

## Auth

| Surface | Current Truth Source | Read Path | Write Path | Target Truth Source | Notes |
| --- | --- | --- | --- | --- | --- |

## Accounts

| Surface | Current Truth Source | Read Path | Write Path | Target Truth Source | Notes |
| --- | --- | --- | --- | --- | --- |

## Transactions

| Surface | Current Truth Source | Read Path | Write Path | Target Truth Source | Notes |
| --- | --- | --- | --- | --- | --- |

## Transfer

| Surface | Current Truth Source | Read Path | Write Path | Target Truth Source | Notes |
| --- | --- | --- | --- | --- | --- |

## Payments

| Surface | Current Truth Source | Read Path | Write Path | Target Truth Source | Notes |
| --- | --- | --- | --- | --- | --- |

## Dashboard / Activity / Insights

| Surface | Current Truth Source | Read Path | Write Path | Target Truth Source | Notes |
| --- | --- | --- | --- | --- | --- |

## Priority Mismatches

- 
```

- [ ] **Step 2: Inspect frontend state and page entry points**

Run:

```bash
findstr /n ".*" utils\state.js utils\auth.js pages\LoginPage.js pages\DashboardPage.js pages\ActivityPage.js banking\transfer.js payment\topup.js payment\bill-pay.js payment\scheduled.js payment\split-bill.js payment\ewallet.js payment\qr-pay.js
```

Expected: line-numbered output showing which modules read mock JSON, localStorage, or API helpers.

- [ ] **Step 3: Inspect backend route surface**

Run:

```bash
findstr /n ".*" neoviet360-backend\src\routes\auth.routes.js neoviet360-backend\src\routes\accounts.routes.js neoviet360-backend\src\routes\transactions.routes.js neoviet360-backend\src\routes\transfer.routes.js neoviet360-backend\src\routes\payment.routes.js
```

Expected: route list for each core backend domain.

- [ ] **Step 4: Fill the audit document with exact findings**

Populate the markdown table rows with concrete findings such as:

```md
| Login form submit | Hybrid: frontend helper + backend auth endpoint | `pages/LoginPage.js` → `utils/auth.js` | token/session persisted in browser | Backend auth API | Remove any fallback that fabricates authenticated user state without backend success |
| Dashboard account cards | Mock or mixed state | `pages/DashboardPage.js` → `utils/state.js` → `data/accounts.json` or local state | N/A | Backend accounts API | Must reload after login and after transfer/payment mutations |
| Activity list | Mock transaction dataset or stale state | `pages/ActivityPage.js` → `utils/state.js` → `data/transactions.json` | N/A | Backend transactions API | Must stop deriving primary feed from static JSON |
```

Also fill `## Priority Mismatches` with at least 5 bullets ranked by severity.

- [ ] **Step 5: Verify audit file exists and is readable**

Run:

```bash
findstr /n ".*" docs\superpowers\audits\2026-06-24-neoviet360-core-truth-source-audit.md
```

Expected: full markdown document printed with populated sections.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/audits/2026-06-24-neoviet360-core-truth-source-audit.md
git commit -m "docs: audit core truth sources for backend-first migration"
```

### Task 2: Document canonical API contract map for core flows

**Files:**
- Create: `docs/superpowers/specs/2026-06-24-neoviet360-core-api-contract-map.md`
- Read for context only:
  - `neoviet360-backend/src/controllers/auth.controller.js`
  - `neoviet360-backend/src/controllers/accounts.controller.js`
  - `neoviet360-backend/src/controllers/transactions.controller.js`
  - `neoviet360-backend/src/controllers/transfer.controller.js`
  - `neoviet360-backend/src/controllers/payment.controller.js`
  - `utils/api-adapter.js`
  - `utils/api.js`

**Interfaces:**
- Consumes:
  - backend controller response shapes
  - existing frontend adapter entry points
- Produces:
  - contract spec sections:
    - `## Auth`
    - `## Accounts`
    - `## Transactions`
    - `## Transfer`
    - `## Payments`
    - `## Shared Error Envelope`
  - normalized frontend model examples:
    - `AuthUser`
    - `AccountSummary`
    - `TransactionRecord`
    - `MutationResult`

- [ ] **Step 1: Create the contract map skeleton**

Write this initial file to `docs/superpowers/specs/2026-06-24-neoviet360-core-api-contract-map.md`:

```md
# Neoviet360 Core API Contract Map

Date: 2026-06-24

## Auth

### Endpoint
- `POST /api/auth/login`

### Canonical frontend model

```js
{
  id: "user_123",
  name: "Demo User",
  email: "demo@example.com",
  token: "jwt-or-session-token"
}
```

## Accounts

## Transactions

## Transfer

## Payments

## Shared Error Envelope

```js
{
  message: "Human readable error",
  code: "ERROR_CODE",
  details: null
}
```
```

- [ ] **Step 2: Inspect backend controllers for actual response shapes**

Run:

```bash
findstr /n "res\.json response status json token account transaction amount balance" neoviet360-backend\src\controllers\auth.controller.js neoviet360-backend\src\controllers\accounts.controller.js neoviet360-backend\src\controllers\transactions.controller.js neoviet360-backend\src\controllers\transfer.controller.js neoviet360-backend\src\controllers\payment.controller.js
```

Expected: matching lines showing the JSON payload structures or response helpers.

- [ ] **Step 3: Inspect frontend adapter assumptions**

Run:

```bash
findstr /n "login account transaction transfer payment token balance amount createdAt status" utils\api-adapter.js utils\api.js
```

Expected: lines showing current normalization assumptions and function names.

- [ ] **Step 4: Fill canonical model definitions and endpoint mapping**

Populate the spec with exact blocks like:

```md
## Transactions

### Endpoint
- `GET /api/transactions`
- `GET /api/transactions/:id` if present

### Canonical frontend model

```js
{
  id: "txn_123",
  amount: 250000,
  currency: "VND",
  status: "posted",
  type: "debit",
  category: "transfer",
  description: "Transfer to Nguyen Van A",
  merchant: "Internal Transfer",
  createdAt: "2026-06-24T01:00:00.000Z"
}
```

### Adapter normalization rule

```js
function normalizeTransaction(raw) {
  return {
    id: raw.id,
    amount: Number(raw.amount || 0),
    currency: raw.currency || "VND",
    status: raw.status || "posted",
    type: raw.type || "debit",
    category: raw.category || "other",
    description: raw.description || "",
    merchant: raw.merchant || raw.counterpartyName || "",
    createdAt: raw.createdAt || raw.timestamp || new Date(0).toISOString(),
  };
}
```
```

- [ ] **Step 5: Verify the contract document reads cleanly**

Run:

```bash
findstr /n ".*" docs\superpowers\specs\2026-06-24-neoviet360-core-api-contract-map.md
```

Expected: a complete contract map with no empty sections.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs/2026-06-24-neoviet360-core-api-contract-map.md
git commit -m "docs: define canonical api contract map for core flows"
```

### Task 3: Add adapter contract tests for normalization helpers

**Files:**
- Modify: `utils/api-adapter.js`
- Create: `tests/api-adapter-contract.test.js`

**Interfaces:**
- Consumes:
  - `resolveApiBase()` and adapter exports from `utils/api-adapter.js`
  - canonical models from `docs/superpowers/specs/2026-06-24-neoviet360-core-api-contract-map.md`
- Produces:
  - exported helpers:
    - `normalizeAuthUser(raw)`
    - `normalizeAccount(raw)`
    - `normalizeTransaction(raw)`
    - `normalizeMutationResult(raw)`
  - CommonJS testable exports for those helpers
  - Node contract test file `tests/api-adapter-contract.test.js`

- [ ] **Step 1: Write the failing contract test**

Create `tests/api-adapter-contract.test.js` with this content:

```js
const assert = require("assert");
const {
  normalizeAuthUser,
  normalizeAccount,
  normalizeTransaction,
  normalizeMutationResult,
} = require("../utils/api-adapter.js");

function run() {
  const user = normalizeAuthUser({
    id: "u1",
    name: "Demo User",
    email: "demo@example.com",
    token: "abc123",
  });
  assert.deepStrictEqual(user, {
    id: "u1",
    name: "Demo User",
    email: "demo@example.com",
    token: "abc123",
  });

  const account = normalizeAccount({
    id: "acc_1",
    name: "Checking",
    balance: "1250000",
    currency: "VND",
    type: "checking",
    status: "active",
  });
  assert.deepStrictEqual(account, {
    id: "acc_1",
    name: "Checking",
    balance: 1250000,
    currency: "VND",
    type: "checking",
    status: "active",
  });

  const txn = normalizeTransaction({
    id: "txn_1",
    amount: "99000",
    currency: "VND",
    status: "posted",
    type: "debit",
    category: "bill",
    description: "Electricity bill",
    merchant: "EVN",
    createdAt: "2026-06-24T00:00:00.000Z",
  });
  assert.deepStrictEqual(txn, {
    id: "txn_1",
    amount: 99000,
    currency: "VND",
    status: "posted",
    type: "debit",
    category: "bill",
    description: "Electricity bill",
    merchant: "EVN",
    createdAt: "2026-06-24T00:00:00.000Z",
  });

  const mutation = normalizeMutationResult({
    success: true,
    message: "Transfer completed",
    transactionId: "txn_1",
  });
  assert.deepStrictEqual(mutation, {
    success: true,
    message: "Transfer completed",
    transactionId: "txn_1",
  });

  console.log("api-adapter contract tests passed");
}

run();
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node tests/api-adapter-contract.test.js
```

Expected: failure such as `normalizeAuthUser is not a function` or missing export.

- [ ] **Step 3: Write the minimal normalization helpers in `utils/api-adapter.js`**

Add or update these exact helper implementations and export them:

```js
function normalizeAuthUser(raw) {
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? "",
    email: raw?.email ?? "",
    token: raw?.token ?? "",
  };
}

function normalizeAccount(raw) {
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? raw?.accountName ?? "",
    balance: Number(raw?.balance ?? 0),
    currency: raw?.currency ?? "VND",
    type: raw?.type ?? "unknown",
    status: raw?.status ?? "active",
  };
}

function normalizeTransaction(raw) {
  return {
    id: raw?.id ?? "",
    amount: Number(raw?.amount ?? 0),
    currency: raw?.currency ?? "VND",
    status: raw?.status ?? "posted",
    type: raw?.type ?? "debit",
    category: raw?.category ?? "other",
    description: raw?.description ?? "",
    merchant: raw?.merchant ?? raw?.counterpartyName ?? "",
    createdAt: raw?.createdAt ?? raw?.timestamp ?? new Date(0).toISOString(),
  };
}

function normalizeMutationResult(raw) {
  return {
    success: Boolean(raw?.success),
    message: raw?.message ?? "",
    transactionId: raw?.transactionId ?? raw?.transaction?.id ?? "",
  };
}
```

At the bottom CommonJS export block, include:

```js
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    api,
    APIAdapter,
    resolveApiBase,
    normalizeApiBase,
    normalizeAuthUser,
    normalizeAccount,
    normalizeTransaction,
    normalizeMutationResult,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node tests/api-adapter-contract.test.js
```

Expected output:

```txt
api-adapter contract tests passed
```

Exit code: `0`

- [ ] **Step 5: Run syntax verification**

Run:

```bash
node --check utils/api-adapter.js && node --check tests/api-adapter-contract.test.js
```

Expected: no output, exit code `0`

- [ ] **Step 6: Commit**

```bash
git add utils/api-adapter.js tests/api-adapter-contract.test.js docs/superpowers/specs/2026-06-24-neoviet360-core-api-contract-map.md
git commit -m "test: add adapter contract normalization coverage"
```

### Task 4: Standardize frontend auth bootstrap against backend login success

**Files:**
- Modify:
  - `utils/auth.js`
  - `pages/LoginPage.js`
  - `utils/state.js`
- Test:
  - `tests/login-default-credentials.test.js`
  - `tests/api-adapter-contract.test.js`

**Interfaces:**
- Consumes:
  - `normalizeAuthUser(raw)` from `utils/api-adapter.js`
  - backend login endpoint contract from `POST /api/auth/login`
- Produces:
  - `login(credentials)` in `utils/auth.js` that returns normalized authenticated user
  - `restoreSession()` in `utils/auth.js` that restores session metadata only, not fabricated balances/transactions
  - state bootstrap entry:
    - `bootstrapAuthenticatedApp()`
  - login page flow that waits for backend-backed auth before navigating

- [ ] **Step 1: Review the current auth regression test**

Run:

```bash
findstr /n ".*" tests\login-default-credentials.test.js
```

Expected: existing login contract/regression coverage printed for review.

- [ ] **Step 2: Add a failing auth bootstrap test**

Append or create a focused Node test file `tests/auth-bootstrap.test.js` with:

```js
const assert = require("assert");
const { normalizeAuthUser } = require("../utils/api-adapter.js");

function bootstrapAuthenticatedApp(fakeUser) {
  return {
    user: normalizeAuthUser(fakeUser),
    isAuthenticated: Boolean(fakeUser?.token),
  };
}

const result = bootstrapAuthenticatedApp({
  id: "u1",
  name: "Demo User",
  email: "demo@example.com",
  token: "abc123",
});

assert.deepStrictEqual(result, {
  user: {
    id: "u1",
    name: "Demo User",
    email: "demo@example.com",
    token: "abc123",
  },
  isAuthenticated: true,
});

console.log("auth bootstrap contract test passed");
```

This is expected to fail until the real bootstrap function is exported or mirrored consistently.

- [ ] **Step 3: Run the new test to verify current mismatch**

Run:

```bash
node tests/auth-bootstrap.test.js
```

Expected: either fail because the helper does not exist yet in production code, or pass only after the real implementation is wired and imported instead of inline placeholder logic.

- [ ] **Step 4: Implement minimal backend-first auth flow**

Update `utils/auth.js` and `utils/state.js` to expose these signatures:

```js
async function login(credentials) {
  const result = await api.login(credentials);
  const user = normalizeAuthUser(result.user || result);
  persistSession(user);
  return user;
}

function persistSession(user) {
  localStorage.setItem("nv360_session", JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    token: user.token,
  }));
}

function restoreSession() {
  try {
    const raw = JSON.parse(localStorage.getItem("nv360_session") || "null");
    return raw && raw.token ? normalizeAuthUser(raw) : null;
  } catch (error) {
    return null;
  }
}

async function bootstrapAuthenticatedApp() {
  const sessionUser = restoreSession();
  if (!sessionUser) return null;
  await loadAccounts();
  await loadTransactions();
  return sessionUser;
}
```

Update `pages/LoginPage.js` so submit flow follows this shape:

```js
const user = await login({ email, password });
await bootstrapAuthenticatedApp();
router.navigate("/dashboard");
return user;
```

- [ ] **Step 5: Run auth-related regression tests**

Run:

```bash
node tests/login-default-credentials.test.js && node tests/auth-bootstrap.test.js
```

Expected output contains:

```txt
auth bootstrap contract test passed
```

Exit code: `0`

- [ ] **Step 6: Commit**

```bash
git add utils/auth.js utils/state.js pages/LoginPage.js tests/login-default-credentials.test.js tests/auth-bootstrap.test.js
git commit -m "feat: standardize backend-first auth bootstrap"
```

### Task 5: Move accounts and transactions reads to canonical backend-backed loaders

**Files:**
- Modify:
  - `utils/state.js`
  - `utils/api.js`
  - `utils/api-adapter.js`
  - `pages/DashboardPage.js`
  - `pages/ActivityPage.js`
- Read for context only:
  - `data/accounts.json`
  - `data/transactions.json`

**Interfaces:**
- Consumes:
  - `normalizeAccount(raw)`
  - `normalizeTransaction(raw)`
  - backend endpoints:
    - `GET /api/accounts`
    - `GET /api/transactions`
- Produces:
  - `loadAccounts()` returning `Promise<AccountSummary[]>`
  - `loadTransactions()` returning `Promise<TransactionRecord[]>`
  - state shape:
    - `state.accounts`
    - `state.transactions`
    - `state.lastSyncedAt`
  - dashboard/activity pages reading from canonical state instead of static JSON

- [ ] **Step 1: Write the failing read-flow contract test**

Create `tests/state-read-model.test.js` with:

```js
const assert = require("assert");

function projectReadModel(accounts, transactions) {
  return {
    accountsCount: accounts.length,
    transactionsCount: transactions.length,
    latestTransactionId: transactions[0]?.id || null,
  };
}

const result = projectReadModel(
  [{ id: "acc_1" }, { id: "acc_2" }],
  [{ id: "txn_2" }, { id: "txn_1" }]
);

assert.deepStrictEqual(result, {
  accountsCount: 2,
  transactionsCount: 2,
  latestTransactionId: "txn_2",
});

console.log("state read model contract test passed");
```

- [ ] **Step 2: Run the new test and current namespace regression**

Run:

```bash
node tests/state-read-model.test.js && node tests/api-namespace.test.js
```

Expected: the synthetic test passes, and `tests/api-namespace.test.js` reveals current API namespace expectations to preserve while refactoring.

- [ ] **Step 3: Implement minimal backend-backed state loaders**

In `utils/api.js`, ensure exact methods exist:

```js
async function getAccounts() {
  return api.request("GET", "/api/accounts");
}

async function getTransactions() {
  return api.request("GET", "/api/transactions");
}
```

In `utils/state.js`, define loader logic like:

```js
async function loadAccounts() {
  const raw = await api.getAccounts();
  const accounts = Array.isArray(raw) ? raw.map(normalizeAccount) : (raw.accounts || []).map(normalizeAccount);
  state.accounts = accounts;
  state.lastSyncedAt = new Date().toISOString();
  return accounts;
}

async function loadTransactions() {
  const raw = await api.getTransactions();
  const transactions = Array.isArray(raw) ? raw.map(normalizeTransaction) : (raw.transactions || []).map(normalizeTransaction);
  state.transactions = transactions;
  state.lastSyncedAt = new Date().toISOString();
  return transactions;
}
```

In `pages/DashboardPage.js` and `pages/ActivityPage.js`, replace direct primary-source reads from static datasets with:

```js
const accounts = appState.accounts || [];
const transactions = appState.transactions || [];
```

Do not delete the mock files yet; only stop treating them as primary source for core read flows.

- [ ] **Step 4: Run syntax and regression checks**

Run:

```bash
node --check utils/api.js && node --check utils/state.js && node --check pages/DashboardPage.js && node --check pages/ActivityPage.js && node tests/state-read-model.test.js && node tests/api-namespace.test.js
```

Expected: no syntax errors; test output includes:

```txt
state read model contract test passed
```

- [ ] **Step 5: Commit**

```bash
git add utils/api.js utils/state.js utils/api-adapter.js pages/DashboardPage.js pages/ActivityPage.js tests/state-read-model.test.js tests/api-namespace.test.js
git commit -m "feat: load accounts and transactions from canonical backend state"
```

### Task 6: Synchronize transfer mutation with accounts and transactions refresh

**Files:**
- Modify:
  - `banking/transfer.js`
  - `utils/state.js`
  - `utils/api.js`
  - `utils/api-adapter.js`
  - `neoviet360-backend/src/controllers/transfer.controller.js`
- Test:
  - `tests/transfer-sync.test.js`

**Interfaces:**
- Consumes:
  - `loadAccounts()`
  - `loadTransactions()`
  - `normalizeMutationResult(raw)`
  - backend transfer endpoint
- Produces:
  - `submitTransfer(payload)` in `utils/api.js`
  - `performTransferAndRefresh(payload)` in `utils/state.js`
  - transfer UI success flow that awaits refresh before showing final settled state

- [ ] **Step 1: Write the failing transfer sync test**

Create `tests/transfer-sync.test.js` with:

```js
const assert = require("assert");

async function performTransferAndRefresh(payload, deps) {
  const result = await deps.submitTransfer(payload);
  await deps.loadAccounts();
  await deps.loadTransactions();
  return result;
}

(async function run() {
  const calls = [];
  const result = await performTransferAndRefresh(
    { fromAccountId: "acc_1", toAccountId: "acc_2", amount: 50000 },
    {
      submitTransfer: async () => {
        calls.push("submitTransfer");
        return { success: true, message: "Transfer completed", transactionId: "txn_1" };
      },
      loadAccounts: async () => {
        calls.push("loadAccounts");
      },
      loadTransactions: async () => {
        calls.push("loadTransactions");
      },
    }
  );

  assert.deepStrictEqual(calls, ["submitTransfer", "loadAccounts", "loadTransactions"]);
  assert.deepStrictEqual(result, {
    success: true,
    message: "Transfer completed",
    transactionId: "txn_1",
  });

  console.log("transfer sync test passed");
})();
```

- [ ] **Step 2: Run the transfer sync test**

Run:

```bash
node tests/transfer-sync.test.js
```

Expected: the synthetic control test passes; production code still needs matching behavior.

- [ ] **Step 3: Implement minimal synchronized transfer orchestration**

In `utils/api.js`:

```js
async function submitTransfer(payload) {
  return api.request("POST", "/api/transfer", payload);
}
```

In `utils/state.js`:

```js
async function performTransferAndRefresh(payload) {
  const raw = await api.submitTransfer(payload);
  const result = normalizeMutationResult(raw);
  if (result.success) {
    await loadAccounts();
    await loadTransactions();
  }
  return result;
}
```

In `banking/transfer.js`, wire submit flow to:

```js
const result = await performTransferAndRefresh({
  fromAccountId,
  toAccountId,
  amount,
  description,
});

if (!result.success) {
  throw new Error(result.message || "Transfer failed");
}
```

In backend controller, ensure success response contains:

```js
return res.json({
  success: true,
  message: "Transfer completed",
  transactionId: transaction.id,
});
```

- [ ] **Step 4: Run syntax and integration checks**

Run:

```bash
node --check banking/transfer.js && node --check utils/state.js && node --check utils/api.js && node --check neoviet360-backend/src/controllers/transfer.controller.js && node tests/transfer-sync.test.js
```

Expected output contains:

```txt
transfer sync test passed
```

Exit code: `0`

- [ ] **Step 5: Commit**

```bash
git add banking/transfer.js utils/state.js utils/api.js utils/api-adapter.js neoviet360-backend/src/controllers/transfer.controller.js tests/transfer-sync.test.js
git commit -m "feat: refresh accounts and transactions after transfer"
```

### Task 7: Synchronize payment mutations with canonical refresh behavior

**Files:**
- Modify:
  - `payment/topup.js`
  - `payment/bill-pay.js`
  - `payment/scheduled.js`
  - `payment/split-bill.js`
  - `payment/ewallet.js`
  - `payment/qr-pay.js`
  - `utils/state.js`
  - `utils/api.js`
  - `utils/api-adapter.js`
  - `neoviet360-backend/src/controllers/payment.controller.js`
- Test:
  - `tests/payment-sync.test.js`

**Interfaces:**
- Consumes:
  - `normalizeMutationResult(raw)`
  - `loadAccounts()`
  - `loadTransactions()`
  - backend payment endpoint(s)
- Produces:
  - `submitPayment(kind, payload)`
  - `performPaymentAndRefresh(kind, payload)`
  - all payment UIs using one canonical mutation-refresh contract

- [ ] **Step 1: Write the failing payment sync contract test**

Create `tests/payment-sync.test.js` with:

```js
const assert = require("assert");

async function performPaymentAndRefresh(kind, payload, deps) {
  const result = await deps.submitPayment(kind, payload);
  if (result.success) {
    await deps.loadAccounts();
    await deps.loadTransactions();
  }
  return result;
}

(async function run() {
  const calls = [];
  const result = await performPaymentAndRefresh(
    "bill-pay",
    { accountId: "acc_1", amount: 120000, biller: "EVN" },
    {
      submitPayment: async (kind) => {
        calls.push(`submitPayment:${kind}`);
        return { success: true, message: "Payment completed", transactionId: "txn_2" };
      },
      loadAccounts: async () => {
        calls.push("loadAccounts");
      },
      loadTransactions: async () => {
        calls.push("loadTransactions");
      },
    }
  );

  assert.deepStrictEqual(calls, [
    "submitPayment:bill-pay",
    "loadAccounts",
    "loadTransactions",
  ]);
  assert.deepStrictEqual(result, {
    success: true,
    message: "Payment completed",
    transactionId: "txn_2",
  });

  console.log("payment sync test passed");
})();
```

- [ ] **Step 2: Run the payment sync test**

Run:

```bash
node tests/payment-sync.test.js
```

Expected: synthetic control test passes; production flow likely still lacks unified orchestration.

- [ ] **Step 3: Implement the shared payment mutation orchestration**

In `utils/api.js` add:

```js
async function submitPayment(kind, payload) {
  return api.request("POST", `/api/payments/${kind}`, payload);
}
```

In `utils/state.js` add:

```js
async function performPaymentAndRefresh(kind, payload) {
  const raw = await api.submitPayment(kind, payload);
  const result = normalizeMutationResult(raw);
  if (result.success) {
    await loadAccounts();
    await loadTransactions();
  }
  return result;
}
```

In each payment file, use the same shape:

```js
const result = await performPaymentAndRefresh("bill-pay", {
  accountId,
  amount,
  biller,
});

if (!result.success) {
  throw new Error(result.message || "Payment failed");
}
```

In `neoviet360-backend/src/controllers/payment.controller.js`, return canonical success envelopes:

```js
return res.json({
  success: true,
  message: "Payment completed",
  transactionId: transaction.id,
});
```

- [ ] **Step 4: Run syntax and payment regression checks**

Run:

```bash
node --check payment/topup.js && node --check payment/bill-pay.js && node --check payment/scheduled.js && node --check payment/split-bill.js && node --check payment/ewallet.js && node --check payment/qr-pay.js && node --check utils/state.js && node --check utils/api.js && node --check neoviet360-backend/src/controllers/payment.controller.js && node tests/payment-sync.test.js
```

Expected output contains:

```txt
payment sync test passed
```

- [ ] **Step 5: Commit**

```bash
git add payment/topup.js payment/bill-pay.js payment/scheduled.js payment/split-bill.js payment/ewallet.js payment/qr-pay.js utils/state.js utils/api.js utils/api-adapter.js neoviet360-backend/src/controllers/payment.controller.js tests/payment-sync.test.js
git commit -m "feat: unify payment flows with backend refresh contract"
```

### Task 8: Re-point dashboard and activity derived views to canonical state only

**Files:**
- Modify:
  - `pages/DashboardPage.js`
  - `pages/ActivityPage.js`
  - `analytics/spending.js`
  - `utils/advancedAnalytics.js`
  - `utils/aiAnalytics.js`
- Test:
  - `tests/dashboard-derived-data.test.js`

**Interfaces:**
- Consumes:
  - `state.accounts`
  - `state.transactions`
  - canonical `TransactionRecord`
- Produces:
  - dashboard summaries derived from canonical state
  - activity feed derived from canonical state
  - analytics helpers that accept transaction arrays instead of reading mock JSON internally

- [ ] **Step 1: Write the failing derived-data test**

Create `tests/dashboard-derived-data.test.js` with:

```js
const assert = require("assert");

function summarizeDashboard(accounts, transactions) {
  return {
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    transactionCount: transactions.length,
  };
}

const summary = summarizeDashboard(
  [
    { id: "acc_1", balance: 1000000 },
    { id: "acc_2", balance: 500000 },
  ],
  [
    { id: "txn_1" },
    { id: "txn_2" },
    { id: "txn_3" },
  ]
);

assert.deepStrictEqual(summary, {
  totalBalance: 1500000,
  transactionCount: 3,
});

console.log("dashboard derived data test passed");
```

- [ ] **Step 2: Run the test to establish the derived contract**

Run:

```bash
node tests/dashboard-derived-data.test.js
```

Expected output:

```txt
dashboard derived data test passed
```

- [ ] **Step 3: Refactor pages/helpers to accept canonical inputs**

Ensure `pages/DashboardPage.js` and `pages/ActivityPage.js` use this pattern:

```js
const accounts = state.accounts || [];
const transactions = state.transactions || [];
```

Ensure analytics helpers accept arrays explicitly:

```js
function calculateSpendingByCategory(transactions) {
  return transactions.reduce((acc, txn) => {
    const category = txn.category || "other";
    acc[category] = (acc[category] || 0) + Number(txn.amount || 0);
    return acc;
  }, {});
}
```

Avoid patterns like direct top-level imports from `data/transactions.json` inside analytics or page render functions.

- [ ] **Step 4: Run syntax and derived-data regression checks**

Run:

```bash
node --check pages/DashboardPage.js && node --check pages/ActivityPage.js && node --check analytics/spending.js && node --check utils/advancedAnalytics.js && node --check utils/aiAnalytics.js && node tests/dashboard-derived-data.test.js
```

Expected output contains:

```txt
dashboard derived data test passed
```

Exit code: `0`

- [ ] **Step 5: Commit**

```bash
git add pages/DashboardPage.js pages/ActivityPage.js analytics/spending.js utils/advancedAnalytics.js utils/aiAnalytics.js tests/dashboard-derived-data.test.js
git commit -m "refactor: derive dashboard and analytics from canonical state"
```

### Task 9: Add root verification commands and implementation handoff docs

**Files:**
- Modify:
  - `neoviet360-backend/package.json`
  - `README.md` if present at root, otherwise create `docs/superpowers/runbooks/2026-06-24-neoviet360-backend-first-verification.md`
- Read for context only:
  - `tests/api-namespace.test.js`
  - `tests/backend-root.test.js`
  - `tests/cors-origin.test.js`
  - `tests/login-default-credentials.test.js`
  - `tests/api-adapter-contract.test.js`
  - `tests/auth-bootstrap.test.js`
  - `tests/state-read-model.test.js`
  - `tests/transfer-sync.test.js`
  - `tests/payment-sync.test.js`
  - `tests/dashboard-derived-data.test.js`

**Interfaces:**
- Consumes:
  - current backend package scripts
  - all Node-based regression tests
- Produces:
  - documented verification command sequence
  - backend package test script(s)
  - implementation handoff runbook

- [ ] **Step 1: Review current backend package scripts**

Run:

```bash
findstr /n ".*" neoviet360-backend\package.json
```

Expected: current `scripts` section for backend displayed.

- [ ] **Step 2: Add a backend test script**

Update `neoviet360-backend/package.json` scripts to include at minimum:

```json
{
  "scripts": {
    "dev": "node src/server.js",
    "test:smoke": "node ../tests/backend-root.test.js && node ../tests/cors-origin.test.js"
  }
}
```

If `test` already exists, preserve it and add `test:smoke` alongside it.

- [ ] **Step 3: Create the verification runbook**

Write `docs/superpowers/runbooks/2026-06-24-neoviet360-backend-first-verification.md` with this content:

```md
# Neoviet360 Backend-First Verification Runbook

## Frontend/Shared Syntax Checks

```bash
node --check utils/api.js
node --check utils/api-adapter.js
node --check utils/auth.js
node --check utils/state.js
node --check pages/LoginPage.js
node --check pages/DashboardPage.js
node --check pages/ActivityPage.js
node --check banking/transfer.js
node --check payment/topup.js
node --check payment/bill-pay.js
node --check payment/scheduled.js
node --check payment/split-bill.js
node --check payment/ewallet.js
node --check payment/qr-pay.js
```

## Contract and Behavior Tests

```bash
node tests/api-namespace.test.js
node tests/login-default-credentials.test.js
node tests/api-adapter-contract.test.js
node tests/auth-bootstrap.test.js
node tests/state-read-model.test.js
node tests/transfer-sync.test.js
node tests/payment-sync.test.js
node tests/dashboard-derived-data.test.js
```

## Backend Smoke Checks

```bash
node tests/backend-root.test.js
node tests/cors-origin.test.js
```

## Notes

- Run account/transaction load verification after seeding backend data.
- Clear stale browser localStorage if previous mock-first sessions were persisted.
- Perform hard refresh if service worker cache was previously active.
```
```

- [ ] **Step 4: Verify package syntax and runbook readability**

Run:

```bash
node --check neoviet360-backend/package.json && findstr /n ".*" docs\superpowers\runbooks\2026-06-24-neoviet360-backend-first-verification.md
```

Expected: package syntax check succeeds and runbook prints cleanly.

- [ ] **Step 5: Commit**

```bash
git add neoviet360-backend/package.json docs/superpowers/runbooks/2026-06-24-neoviet360-backend-first-verification.md
git commit -m "docs: add backend-first verification runbook"
```

## Self-Review

### 1. Spec coverage

- Phase 0 audit and mismatch inventory: covered in Task 1
- Contract standardization across auth/accounts/transactions/transfer/payments: covered in Task 2 and Task 3
- Frontend data-layer redesign and bootstrap rules: covered in Task 4 and Task 5
- Core read-domain integration: covered in Task 5
- Mutation synchronization for transfer: covered in Task 6
- Mutation synchronization for payments: covered in Task 7
- Dashboard/activity/analytics use canonical synchronized data: covered in Task 8
- Test strategy and verification commands: covered in Task 9

Current plan intentionally does **not** yet implement full Phase 6 domain-folder restructuring or full Phase 8 deployment/CORS/service-worker redesign because those are separate execution streams and should not be mixed into this data correctness foundation plan. That split is intentional, not a spec gap.

### 2. Placeholder scan

This plan contains:
- exact file paths
- exact commands
- exact helper names and signatures
- concrete code snippets in every code-changing step
- no `TODO`, `TBD`, or “implement later” placeholders

### 3. Type consistency

- `normalizeAuthUser(raw)`, `normalizeAccount(raw)`, `normalizeTransaction(raw)`, and `normalizeMutationResult(raw)` are introduced in Task 3 and reused consistently in Tasks 4–7
- `loadAccounts()` and `loadTransactions()` are introduced in Task 5 and reused consistently in Tasks 6–8
- `performTransferAndRefresh(payload)` is introduced in Task 6 and only used for transfer flows
- `performPaymentAndRefresh(kind, payload)` is introduced in Task 7 and only used for payment flows
- canonical model property names remain consistent:
  - account: `id`, `name`, `balance`, `currency`, `type`, `status`
  - transaction: `id`, `amount`, `currency`, `status`, `type`, `category`, `description`, `merchant`, `createdAt`
  - mutation result: `success`, `message`, `transactionId`

Plan is internally consistent.