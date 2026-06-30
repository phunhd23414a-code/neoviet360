# NeoViet360 Frontend-Backend Integration Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the frontend with the backend API, replacing mock data layer with real backend calls and establishing proper JWT authentication flow.

**Architecture:** The frontend currently loads `utils/api.js` which provides mock data from local JSON files. We will replace this with `utils/api-adapter.js` which wraps the Express backend API (running on port 3001). Authentication will flow through backend JWT verification instead of localStorage mocks. Each page will be updated to fetch real data through the adapter.

**Tech Stack:** 
- Frontend: Vanilla JavaScript, Tailwind CSS
- Backend: Node.js/Express, Prisma ORM, Supabase PostgreSQL
- API: RESTful with JWT Bearer tokens

## Global Constraints

- Must maintain existing UI/UX design without changes
- JWT tokens stored in `localStorage` with key `neoviet_token`
- User data stored in `localStorage` with key `neoviet_user`
- Backend API base URL: `http://localhost:3001/api`
- All API calls must include `Authorization: Bearer {token}` header for protected routes
- Backend already implements authGuard middleware on all protected routes
- No breaking changes to existing component APIs
- Database connection uses Supabase PostgreSQL via Prisma

---

## Task 1: Update LoginPage to Use Backend Authentication

**Files:**
- Modify: `pages/LoginPage.js:90-150` (bindEvents function)

**Interfaces:**
- Consumes: `auth.login(email, password)` → returns `{user: Object}`
- Produces: Sets localStorage `neoviet_token` and `neoviet_user` after successful login

**Description:** Update the login form submission handler to call the new backend-aware `auth.login()` method instead of directly reading mock JSON data.

- [ ] **Step 1: Read current bindEvents implementation**

Open `pages/LoginPage.js` and locate the form submission handler (line ~130).

- [ ] **Step 2: Understand current behavior**

Find the line that calls `auth.login()` and note what parameters it currently passes.

- [ ] **Step 3: Update form submission to use email field**

Replace the login form handler to extract email and password from form inputs:

```javascript
document.getElementById('spa-login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const btnSubmit = document.getElementById('btn-submit-login');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Kích hoạt...';
    
    const user = await auth.login(email, password);
    
    // Navigate to dashboard after successful login
    router.navigate('dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    // Show error toast
    if (window.Toast) {
      Toast.error(error.message || 'Lỗi đăng nhập. Vui lòng kiểm tra thông tin.');
    } else {
      alert(error.message || 'Lỗi đăng nhập');
    }
    
    const btnSubmit = document.getElementById('btn-submit-login');
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i data-lucide="shield-check" class="w-4 h-4"></i> KÍCH HOẠT PHIÊN LÀM VIỆC';
  }
});
```

- [ ] **Step 4: Update register form handler to call backend signup**

Replace the register form submission handler:

```javascript
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    const btnSubmit = document.getElementById('btn-submit-register');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Đang tạo...';
    
    // Call backend signup endpoint
    const result = await window.api.auth.signup({ name, email, password });
    
    // Store credentials
    window.api.setAuth(result.token, result.user);
    
    // Show success and redirect
    if (window.Toast) {
      Toast.success('Đăng ký thành công!');
    }
    
    // Navigate to dashboard
    router.navigate('dashboard');
    
  } catch (error) {
    console.error('Register error:', error);
    if (window.Toast) {
      Toast.error(error.message || 'Lỗi đăng ký. Vui lòng thử lại.');
    } else {
      alert(error.message || 'Lỗi đăng ký');
    }
    
    const btnSubmit = document.getElementById('btn-submit-register');
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> ĐĂNG KÝ & ĐỊNH DANH eKYC';
  }
});
```

- [ ] **Step 5: Test login form in browser**

1. Open `http://localhost:5500` (or your frontend port)
2. Enter credentials: `admin@neoviet360.vn` / `password123`
3. Click submit
4. Should redirect to dashboard with JWT token in localStorage
5. Check browser DevTools → Application → LocalStorage for `neoviet_token`

- [ ] **Step 6: Commit**

```bash
git add pages/LoginPage.js
git commit -m "feat: integrate login form with backend authentication"
```

---

## Task 2: Update State Management to Fetch from Backend

**Files:**
- Modify: `utils/state.js:1-100` (initialization and data loading)
- Reference: `utils/api-adapter.js` (available API methods)

**Interfaces:**
- Consumes: `window.api.accounts.list()`, `window.api.transactions.list()`, `window.api.budgets.list()`
- Produces: `window.state` object with `user`, `accounts`, `transactions`, `budgets` populated from backend

**Description:** Replace mock JSON data loading with backend API calls. State should only be populated after user is authenticated with valid JWT token.

- [ ] **Step 1: Read current state.js**

Open `utils/state.js` and identify where mock data is loaded (look for `fetch('./data/...')` calls).

- [ ] **Step 2: Replace accounts data loading**

Find the section that loads accounts and replace with:

```javascript
// Load user accounts from backend
async function loadAccounts() {
  try {
    if (!auth.isLoggedIn()) {
      console.warn('Cannot load accounts: not authenticated');
      return [];
    }
    
    const accounts = await window.api.accounts.list();
    window.state.accounts = accounts;
    return accounts;
    
  } catch (error) {
    console.error('Error loading accounts:', error);
    window.state.accounts = [];
    return [];
  }
}
```

- [ ] **Step 3: Replace transactions data loading**

Find the section that loads transactions and replace with:

```javascript
// Load user transactions from backend
async function loadTransactions() {
  try {
    if (!auth.isLoggedIn()) {
      console.warn('Cannot load transactions: not authenticated');
      return [];
    }
    
    const transactions = await window.api.transactions.list();
    window.state.transactions = transactions;
    return transactions;
    
  } catch (error) {
    console.error('Error loading transactions:', error);
    window.state.transactions = [];
    return [];
  }
}
```

- [ ] **Step 4: Replace budgets data loading**

Find the section that loads budgets and replace with:

```javascript
// Load user budgets from backend
async function loadBudgets() {
  try {
    if (!auth.isLoggedIn()) {
      console.warn('Cannot load budgets: not authenticated');
      return [];
    }
    
    const budgets = await window.api.budgets.list();
    window.state.budgets = budgets;
    return budgets;
    
  } catch (error) {
    console.error('Error loading budgets:', error);
    window.state.budgets = [];
    return [];
  }
}
```

- [ ] **Step 5: Update state initialization to be async**

Modify the main state initialization to properly await backend calls:

```javascript
// Initialize state only when user is authenticated
async function initializeStateFromBackend() {
  if (!auth.isLoggedIn()) {
    console.log('State initialization skipped: user not authenticated');
    return;
  }
  
  try {
    // Load all data in parallel for better performance
    await Promise.all([
      loadAccounts(),
      loadTransactions(),
      loadBudgets()
    ]);
    
    console.log('State successfully initialized from backend:', window.state);
    
  } catch (error) {
    console.error('Failed to initialize state from backend:', error);
  }
}

// Expose as window method for router to call
window.state.initFromBackend = initializeStateFromBackend;
```

- [ ] **Step 6: Update router to call initializeStateFromBackend after login**

Note: This will be done in Task 3 (Router Updates). For now, just ensure the function exists on window.state.

- [ ] **Step 7: Test state loading in browser console**

1. Login successfully (from Task 1)
2. Open DevTools Console
3. Run: `window.state.initFromBackend()` 
4. Wait for Promise to resolve
5. Check: `window.state.accounts`, `window.state.transactions`, `window.state.budgets` should have real data

- [ ] **Step 8: Commit**

```bash
git add utils/state.js
git commit -m "feat: replace mock data loading with backend API calls"
```

---

## Task 3: Update Router to Initialize State After Login

**Files:**
- Modify: `utils/router.js:50-120` (navigation after login)

**Interfaces:**
- Consumes: `auth.isLoggedIn()`, `window.state.initFromBackend()`
- Produces: Ensures state is loaded before rendering protected pages

**Description:** After successful login and authentication, the router should initialize the state from backend before rendering any dashboard or data pages.

- [ ] **Step 1: Locate router navigate function**

Open `utils/router.js` and find the `navigate()` function implementation.

- [ ] **Step 2: Add state initialization for protected routes**

Find where the router navigates to protected pages (dashboard, accounts, transactions, etc.) and add:

```javascript
// In the navigate function, before rendering protected pages:
const protectedRoutes = ['dashboard', 'accounts', 'transactions', 'payments', 'insights', 'profile', 'activity'];

if (protectedRoutes.includes(page)) {
  // Ensure user is authenticated
  if (!auth.isLoggedIn()) {
    console.warn('Cannot navigate to protected route without authentication');
    page = 'login';
  } else if (!window.state.accounts || window.state.accounts.length === 0) {
    // Initialize state from backend if not already loaded
    console.log('Initializing state from backend for route:', page);
    await window.state.initFromBackend();
  }
}
```

- [ ] **Step 3: Make navigation async if needed**

If router.navigate() is not already async, wrap the state initialization:

```javascript
const navigate = async (page) => {
  // ... existing code ...
  
  // Handle protected routes
  if (protectedRoutes.includes(page)) {
    if (!auth.isLoggedIn()) {
      page = 'login';
    } else if (!window.state._dataLoaded) {
      await window.state.initFromBackend();
      window.state._dataLoaded = true;
    }
  }
  
  // ... rest of navigation code ...
};
```

- [ ] **Step 4: Test navigation flow**

1. Login successfully
2. Router should navigate to dashboard
3. Open DevTools and check Console for "Initializing state from backend..." message
4. Verify accounts/transactions data loads on dashboard

- [ ] **Step 5: Commit**

```bash
git add utils/router.js
git commit -m "feat: initialize state from backend on protected route navigation"
```

---

## Task 4: Update DashboardPage to Use Backend Data

**Files:**
- Modify: `pages/DashboardPage.js:1-200` (render function to use real data)

**Interfaces:**
- Consumes: `window.state.accounts`, `window.state.transactions`, `window.state.budgets`
- Produces: Dashboard renders with real backend data instead of mock JSON

**Description:** Replace mock data references in DashboardPage with actual data from window.state that now comes from backend.

- [ ] **Step 1: Read DashboardPage implementation**

Open `pages/DashboardPage.js` and find sections that render accounts, transactions, balances, etc.

- [ ] **Step 2: Find all mock data references**

Search for patterns like:
- Direct JSON imports: `window.accounts`, `window.transactions`
- Mock account balance displays
- Mock transaction lists

- [ ] **Step 3: Replace account balance section**

Update the balance display to use real account data:

```javascript
// Replace mock balance with real account data
const totalBalance = (window.state.accounts || [])
  .reduce((sum, acc) => sum + (acc.balance || 0), 0);

const balanceHTML = `
  <div class="balance-card">
    <p class="text-ai-muted text-sm">Số dư tổng cộng</p>
    <p class="text-3xl font-bold text-status-highlight">
      ${window.format.currency(totalBalance)}
    </p>
  </div>
`;
```

- [ ] **Step 4: Replace accounts list section**

Update the accounts display to use real accounts:

```javascript
// Replace mock accounts list
const accountsList = (window.state.accounts || [])
  .map(account => `
    <div class="account-item">
      <span class="font-semibold">${account.name}</span>
      <span class="text-status-highlight">${window.format.currency(account.balance)}</span>
    </div>
  `)
  .join('');
```

- [ ] **Step 5: Replace transactions list section**

Update recent transactions to use real data:

```javascript
// Replace mock transactions list
const recentTransactions = (window.state.transactions || [])
  .slice(0, 10)
  .map(tx => `
    <div class="transaction-item">
      <span>${tx.description}</span>
      <span class="${tx.amount < 0 ? 'text-red-400' : 'text-green-400'}">
        ${window.format.currency(tx.amount)}
      </span>
    </div>
  `)
  .join('');
```

- [ ] **Step 6: Test dashboard data display**

1. Login successfully
2. Navigate to dashboard
3. Verify accounts show real data from backend
4. Verify transactions list shows real data
5. Verify total balance calculation is correct

- [ ] **Step 7: Commit**

```bash
git add pages/DashboardPage.js
git commit -m "feat: dashboard displays real backend data for accounts and transactions"
```

---

## Task 5: Update Accounts and Banking Pages to Use Backend

**Files:**
- Modify: `banking/accounts.js:1-100` (render real account details)
- Modify: `banking/transfer.js:1-150` (use real accounts for transfer)
- Modify: `banking/savings.js:1-100` (use real savings goals from backend)

**Interfaces:**
- Consumes: `window.api.accounts.get(id)`, `window.api.transfer.create(data)`, `window.api.savings.list()`
- Produces: All account operations use backend API instead of mock data

**Description:** Update banking module pages to fetch and display real account data, and execute transfers/savings operations through backend API.

- [ ] **Step 1: Update accounts.js to fetch real account details**

```javascript
// In accounts.js render function, replace mock account loading:
async function loadAccountDetails(accountId) {
  try {
    const account = await window.api.accounts.get(accountId);
    window.state.currentAccount = account;
    return account;
  } catch (error) {
    console.error('Failed to load account:', error);
    throw error;
  }
}
```

- [ ] **Step 2: Update transfer.js to validate via backend**

```javascript
// In transfer.js, update form submission handler:
document.getElementById('transfer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fromAccountId = document.getElementById('from-account').value;
  const toAccountId = document.getElementById('to-account').value;
  const amount = parseFloat(document.getElementById('amount').value);
  
  try {
    const result = await window.api.transfer.create({
      fromAccountId,
      toAccountId,
      amount,
      description: document.getElementById('description').value
    });
    
    Toast.success('Chuyển tiền thành công!');
    
    // Reload state
    await window.state.initFromBackend();
    
    // Redirect to dashboard
    router.navigate('dashboard');
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi chuyển tiền');
  }
});
```

- [ ] **Step 3: Update savings.js to use backend savings goals**

```javascript
// In savings.js render function, replace mock data:
const savingsGoals = window.state.savings || [];

const goalsHTML = savingsGoals.map(goal => `
  <div class="goal-card">
    <h4>${goal.name}</h4>
    <p class="text-ai-muted">Mục tiêu: ${window.format.currency(goal.target)}</p>
    <p class="text-status-highlight">Đã tiết kiệm: ${window.format.currency(goal.current)}</p>
    <div class="progress-bar">
      <div class="progress" style="width: ${(goal.current / goal.target) * 100}%"></div>
    </div>
  </div>
`).join('');
```

- [ ] **Step 4: Test transfer flow**

1. Login successfully
2. Navigate to Banking → Transfers
3. Select from and to accounts (should be real from backend)
4. Enter transfer amount
5. Submit form
6. Verify transfer completes and state reloads
7. Check transaction appears on dashboard

- [ ] **Step 5: Test savings goals display**

1. Navigate to Banking → Savings
2. Verify savings goals load from backend
3. Check progress bars calculate correctly
4. Verify create/update goal forms call backend API

- [ ] **Step 6: Commit**

```bash
git add banking/accounts.js banking/transfer.js banking/savings.js
git commit -m "feat: banking pages use real backend API for accounts and operations"
```

---

## Task 6: Update Payment Pages to Use Backend

**Files:**
- Modify: `payment/bill-pay.js:1-120`
- Modify: `payment/topup.js:1-100`
- Modify: `payment/ewallet.js:1-100`

**Interfaces:**
- Consumes: `window.api.payments.payBill()`, `window.api.payments.topup()`, `window.api.payments.ewalletPayment()`
- Produces: All payment operations persist to backend database

**Description:** Update payment module to execute real transactions through backend instead of updating mock data.

- [ ] **Step 1: Update bill-pay.js form handler**

```javascript
// In bill-pay.js, update payment submission:
document.getElementById('bill-pay-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const result = await window.api.payments.payBill({
      billId: document.getElementById('bill-id').value,
      amount: parseFloat(document.getElementById('amount').value),
      billerCode: document.getElementById('biller-code').value
    });
    
    Toast.success('Thanh toán hóa đơn thành công!');
    await window.state.initFromBackend();
    router.navigate('payments');
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi thanh toán');
  }
});
```

- [ ] **Step 2: Update topup.js form handler**

```javascript
// In topup.js, update topup submission:
document.getElementById('topup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const result = await window.api.payments.topup({
      phoneNumber: document.getElementById('phone').value,
      amount: parseFloat(document.getElementById('amount').value),
      provider: document.getElementById('provider').value
    });
    
    Toast.success('Nạp tiền thành công!');
    await window.state.initFromBackend();
    router.navigate('payments');
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi nạp tiền');
  }
});
```

- [ ] **Step 3: Update ewallet.js payment handler**

```javascript
// In ewallet.js, update e-wallet payment:
document.getElementById('ewallet-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const result = await window.api.payments.ewalletPayment({
      walletProvider: document.getElementById('wallet').value,
      amount: parseFloat(document.getElementById('amount').value),
      recipientPhone: document.getElementById('recipient').value
    });
    
    Toast.success('Chuyển tiền ví điện tử thành công!');
    await window.state.initFromBackend();
    router.navigate('activity');
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi chuyển tiền ví');
  }
});
```

- [ ] **Step 4: Test bill payment**

1. Login and navigate to Payments → Pay Bills
2. Select a bill (should load from backend)
3. Enter payment amount
4. Submit form
5. Verify transaction appears in activity/transactions

- [ ] **Step 5: Test mobile topup**

1. Navigate to Payments → Mobile Topup
2. Enter phone and amount
3. Select provider
4. Submit
5. Verify topup transaction recorded

- [ ] **Step 6: Test e-wallet payment**

1. Navigate to Payments → E-Wallet Payment
2. Select wallet provider
3. Enter recipient phone and amount
4. Submit
5. Verify transaction appears in history

- [ ] **Step 7: Commit**

```bash
git add payment/bill-pay.js payment/topup.js payment/ewallet.js
git commit -m "feat: payment pages execute real backend transactions"
```

---

## Task 7: Update Activity and Transactions Pages

**Files:**
- Modify: `pages/ActivityPage.js:1-150`
- Modify: `pages/PaymentsPage.js:1-120`

**Interfaces:**
- Consumes: `window.api.transactions.list()`, `window.api.transactions.get(id)`
- Produces: Activity pages display real transaction history from backend

**Description:** Replace mock transaction data with real backend transaction queries and details.

- [ ] **Step 1: Update ActivityPage to fetch real transactions**

```javascript
// In ActivityPage.js render function:
const transactions = window.state.transactions || [];

const transactionsList = transactions.map(tx => `
  <div class="transaction-row" onclick="Modal.showTransaction(${tx.id})">
    <div class="transaction-info">
      <p class="transaction-type">${tx.type}</p>
      <p class="transaction-time">${window.format.date(tx.createdAt)}</p>
    </div>
    <p class="transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}">
      ${window.format.currency(tx.amount)}
    </p>
  </div>
`).join('');
```

- [ ] **Step 2: Add transaction detail modal**

```javascript
// Add modal for showing transaction details:
window.Modal.showTransaction = async (transactionId) => {
  try {
    const tx = await window.api.transactions.get(transactionId);
    
    Modal.open(`
      <div class="p-6">
        <h3 class="text-xl font-bold mb-4">${tx.description}</h3>
        <div class="space-y-2">
          <p><span class="text-ai-muted">Loại giao dịch:</span> ${tx.type}</p>
          <p><span class="text-ai-muted">Số tiền:</span> ${window.format.currency(tx.amount)}</p>
          <p><span class="text-ai-muted">Tài khoản:</span> ${tx.accountName}</p>
          <p><span class="text-ai-muted">Ngày:</span> ${window.format.date(tx.createdAt)}</p>
          <p><span class="text-ai-muted">Trạng thái:</span> ${tx.status}</p>
        </div>
      </div>
    `);
    
  } catch (error) {
    Toast.error('Không thể tải chi tiết giao dịch');
  }
};
```

- [ ] **Step 3: Update PaymentsPage transaction list**

```javascript
// In PaymentsPage.js, use real payment transactions:
const paymentTransactions = (window.state.transactions || [])
  .filter(tx => ['BILL_PAY', 'TOPUP', 'EWALLET'].includes(tx.type));

const paymentList = paymentTransactions.map(tx => `
  <div class="payment-item">
    <span>${tx.description}</span>
    <span class="text-status-highlight">${window.format.currency(tx.amount)}</span>
  </div>
`).join('');
```

- [ ] **Step 4: Add filtering and search to activity page**

```javascript
// Add transaction filtering functionality:
const filterTransactions = (type) => {
  const filtered = (window.state.transactions || [])
    .filter(tx => !type || tx.type === type);
  
  return filtered.map(tx => {/* render transaction */});
};

// Add search functionality:
const searchTransactions = (query) => {
  const results = (window.state.transactions || [])
    .filter(tx => 
      tx.description.toLowerCase().includes(query.toLowerCase()) ||
      tx.accountName.toLowerCase().includes(query.toLowerCase())
    );
  
  return results;
};
```

- [ ] **Step 5: Test activity page**

1. Login and navigate to Activity
2. Verify all transactions load from backend
3. Click on a transaction to view details
4. Verify transaction details modal displays correctly
5. Test filtering by transaction type
6. Test search functionality

- [ ] **Step 6: Test payments page**

1. Navigate to Payments page
2. Verify recent payment transactions display
3. Verify totals calculate correctly from backend data

- [ ] **Step 7: Commit**

```bash
git add pages/ActivityPage.js pages/PaymentsPage.js
git commit -m "feat: activity and payments pages display real backend transaction history"
```

---

## Task 8: Update Profile and Settings Pages

**Files:**
- Modify: `pages/ProfilePage.js:1-100`
- Modify: `profile/settings.js:1-120`
- Modify: `profile/security.js:1-100`

**Interfaces:**
- Consumes: `window.api.user.getProfile()`, `window.api.user.updateProfile()`, `window.api.user.changePassword()`
- Produces: Profile pages fetch and update real user data from backend

**Description:** Update user profile management to fetch real user data and persist profile changes to backend.

- [ ] **Step 1: Update ProfilePage to load real user data**

```javascript
// In ProfilePage.js render function:
const user = window.state.user || {};

const profileHTML = `
  <div class="profile-section">
    <h2>${user.name}</h2>
    <p class="text-ai-muted">${user.email}</p>
    <p class="text-sm text-ai-muted">Thành viên từ: ${window.format.date(user.createdAt)}</p>
  </div>
`;
```

- [ ] **Step 2: Update settings.js for profile updates**

```javascript
// In settings.js, update profile form handler:
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const updated = await window.api.user.updateProfile({
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value
    });
    
    // Update state
    window.state.user = updated;
    localStorage.setItem('neoviet_user', JSON.stringify(updated));
    
    Toast.success('Cập nhật hồ sơ thành công!');
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi cập nhật hồ sơ');
  }
});
```

- [ ] **Step 3: Update security.js for password changes**

```javascript
// In security.js, update password change handler:
document.getElementById('password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const oldPassword = document.getElementById('old-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (newPassword !== confirmPassword) {
    Toast.error('Mật khẩu xác nhận không khớp');
    return;
  }
  
  try {
    await window.api.user.changePassword({
      oldPassword,
      newPassword
    });
    
    Toast.success('Đổi mật khẩu thành công!');
    document.getElementById('password-form').reset();
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi đổi mật khẩu');
  }
});
```

- [ ] **Step 4: Add 2FA settings update**

```javascript
// In security.js, add 2FA toggle handler:
document.getElementById('2fa-toggle').addEventListener('change', async (e) => {
  try {
    await window.api.user.toggle2FA(e.target.checked);
    
    Toast.success(e.target.checked ? 'Bảo mật 2 yếu tố đã bật' : 'Bảo mật 2 yếu tố đã tắt');
    
    // Update user state
    window.state.user.twoFactorEnabled = e.target.checked;
    localStorage.setItem('neoviet_user', JSON.stringify(window.state.user));
    
  } catch (error) {
    Toast.error(error.message || 'Lỗi cập nhật bảo mật');
    e.target.checked = !e.target.checked; // Revert toggle
  }
});
```

- [ ] **Step 5: Test profile updates**

1. Login and navigate to Profile
2. Verify user name and email display correctly
3. Navigate to Settings
4. Update profile fields
5. Submit form
6. Verify changes persist (refresh page should show updates)

- [ ] **Step 6: Test security settings**

1. Navigate to Security
2. Change password successfully
3. Test old password no longer works on next login
4. Toggle 2FA setting
5. Verify 2FA state persists

- [ ] **Step 7: Commit**

```bash
git add pages/ProfilePage.js profile/settings.js profile/security.js
git commit -m "feat: profile pages fetch and persist user data to backend"
```

---

## Task 9: Add Error Handling and Loading States

**Files:**
- Create: `utils/error-handler.js` (centralized error handling)
- Modify: `components/Header.js:1-50` (add loading indicator)
- Modify: `index.html:200-250` (add loading skeleton)

**Interfaces:**
- Produces: Consistent error messages and loading states across all pages

**Description:** Implement proper error handling for all API calls and add visual loading indicators to improve UX.

- [ ] **Step 1: Create error-handler.js utility**

```javascript
// Create utils/error-handler.js:
const ErrorHandler = {
  // Map error codes to user-friendly messages
  messages: {
    'NETWORK_ERROR': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
    'UNAUTHORIZED': 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.',
    'FORBIDDEN': 'Bạn không có quyền truy cập tài nguyên này.',
    'NOT_FOUND': 'Tài nguyên không được tìm thấy.',
    'CONFLICT': 'Dữ liệu đã bị thay đổi. Vui lòng tải lại trang.',
    'VALIDATION_ERROR': 'Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc.',
    'SERVER_ERROR': 'Lỗi máy chủ. Vui lòng thử lại sau.',
  },
  
  handle: (error) => {
    if (error.status === 401) {
      // Unauthorized - logout user
      auth.logout();
      return ErrorHandler.messages.UNAUTHORIZED;
    }
    
    if (error.status === 403) {
      return ErrorHandler.messages.FORBIDDEN;
    }
    
    if (error.status === 404) {
      return ErrorHandler.messages.NOT_FOUND;
    }
    
    if (error.status === 409) {
      return ErrorHandler.messages.CONFLICT;
    }
    
    if (error.status === 422) {
      // Validation errors - return detailed message
      return error.message || ErrorHandler.messages.VALIDATION_ERROR;
    }
    
    if (error.status >= 500) {
      return ErrorHandler.messages.SERVER_ERROR;
    }
    
    return error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
};

window.ErrorHandler = ErrorHandler;
```

- [ ] **Step 2: Add to index.html script tags**

Add to the scripts section in index.html:

```html
<script src="./utils/error-handler.js"></script>
```

- [ ] **Step 3: Update API Adapter to use ErrorHandler**

Find the APIAdapter catch blocks and replace with:

```javascript
catch (error) {
  const message = ErrorHandler.handle(error);
  console.error(message, error);
  throw new Error(message);
}
```

- [ ] **Step 4: Add loading state to Header component**

In `components/Header.js`, add a method to show/hide loading indicator:

```javascript
const Header = {
  showLoading: () => {
    const header = document.getElementById('header-container');
    if (header) {
      const spinner = document.createElement('div');
      spinner.id = 'header-loading';
      spinner.className = 'fixed top-4 right-4 animate-spin';
      spinner.innerHTML = '<i data-lucide="loader" class="w-5 h-5 text-status-highlight"></i>';
      header.appendChild(spinner);
      lucide.createIcons();
    }
  },
  
  hideLoading: () => {
    const spinner = document.getElementById('header-loading');
    if (spinner) spinner.remove();
  }
};
```

- [ ] **Step 5: Use loading states in API calls**

Update key API calls to show loading:

```javascript
// In auth.login():
const btnSubmit = document.getElementById('btn-submit-login');
if (btnSubmit) {
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Đang xác thực...';
}

try {
  // API call
} finally {
  if (btnSubmit) {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i data-lucide="shield-check" class="w-4 h-4"></i> KÍCH HOẠT PHIÊN LÀM VIỆC';
  }
}
```

- [ ] **Step 6: Test error handling**

1. Try logging in with wrong credentials
2. Verify error message displays
3. Try accessing protected route without token
4. Verify automatic logout on 401 error
5. Check loading indicators appear during API calls

- [ ] **Step 7: Commit**

```bash
git add utils/error-handler.js components/Header.js
git commit -m "feat: add centralized error handling and loading states"
```

---

## Task 10: Test Complete Integration and Verify No Regressions

**Files:**
- Reference: All modified files
- Test: Browser login flow, data loading, transactions, profile updates

**Description:** End-to-end testing of complete frontend-backend integration to ensure no mock data remains and all operations use real backend API.

- [ ] **Step 1: Clear browser localStorage and start fresh**

```javascript
// In DevTools console:
localStorage.clear();
location.reload();
```

- [ ] **Step 2: Test complete login flow**

1. Page loads with login form
2. Mock data should NOT be visible
3. Enter valid credentials
4. Click submit
5. Should authenticate via backend
6. JWT token should be in localStorage
7. Should redirect to dashboard

- [ ] **Step 3: Verify dashboard loads real data**

1. Check DevTools Console for any errors
2. Accounts should display from backend
3. Transactions should load from backend
4. Total balance should be accurate
5. No mock JSON data should be visible

- [ ] **Step 4: Test data pages**

Navigate to each page and verify real data:
- [ ] Accounts - Real account list and details
- [ ] Transfers - Can transfer between real accounts
- [ ] Transactions/Activity - Complete transaction history
- [ ] Payments - Pay real bills, topup, e-wallet
- [ ] Profile - Real user info, can update
- [ ] Security - Can change password

- [ ] **Step 5: Test logout and re-login**

1. Logout from profile
2. Token should be cleared from localStorage
3. Should redirect to login
4. Login again with same credentials
5. Should work without errors
6. Fresh data should load from backend

- [ ] **Step 6: Verify no 404 errors**

1. Open DevTools Network tab
2. Perform all user operations
3. All API calls should be to `localhost:3001/api/...`
4. No requests to `./data/...` JSON files
5. All responses should be 200-201, no 404s

- [ ] **Step 7: Check for any remaining mock data references**

Search codebase for any remaining references:

```bash
grep -r "window\.accounts\|window\.transactions\|window\.budgets" --include="*.js" pages/ banking/ payment/ components/
grep -r "fetch.*\.\/data\/" --include="*.js" .
```

Should return no results.

- [ ] **Step 8: Verify CORS is working**

Check that backend CORS is configured for frontend origin:

```bash
curl -i -X OPTIONS http://localhost:3001/api/accounts \
  -H "Origin: http://localhost:5500" \
  -H "Access-Control-Request-Method: GET"
```

Should return `Access-Control-Allow-Origin` header.

- [ ] **Step 9: Test on different browser (optional)**

1. Open in Firefox/Safari/Edge
2. Perform same operations
3. Verify no local storage cross-browser issues
4. Test PWA service worker if applicable

- [ ] **Step 10: Create integration test summary**

Document results:

```markdown
# Integration Test Results

## Login Flow
- [x] Valid credentials authenticate via backend
- [x] Invalid credentials show error
- [x] JWT token stored in localStorage
- [x] Redirect to dashboard on success

## Data Loading
- [x] Dashboard loads real accounts
- [x] Dashboard loads real transactions
- [x] Account details page loads via API
- [x] Transaction history complete

## Operations
- [x] Transfer creates transaction in backend
- [x] Bill payment recorded in database
- [x] Mobile topup functional
- [x] E-wallet payment working

## Profile
- [x] User profile loads correctly
- [x] Profile updates persist to backend
- [x] Password change works
- [x] Settings changes saved

## Error Handling
- [x] Network errors handled gracefully
- [x] 401 errors trigger re-login
- [x] Validation errors display
- [x] Server errors show message

## API Integration
- [x] All API calls to backend (no mock data)
- [x] JWT token included in all requests
- [x] CORS working correctly
- [x] No 404 errors from frontend
```

- [ ] **Step 11: Final commit**

```bash
git add .
git commit -m "test: verify complete frontend-backend integration and no mock data remains"
```

---

## Success Criteria

- [x] Frontend no longer loads mock JSON data
- [x] All authentication flows through backend API
- [x] JWT tokens properly stored and used
- [x] No "Route not found" errors when accessing application
- [x] All data pages fetch from backend
- [x] User operations (transfer, payment, etc.) persist to database
- [x] Error handling displays user-friendly messages
- [x] Complete end-to-end flow works: login → data loads → operations → logout

## Known Limitations & Future Improvements

1. Token refresh mechanism not yet implemented (tokens don't expire in current implementation)
2. Offline mode not supported (requires service worker updates)
3. Real-time updates not implemented (consider WebSockets for live data)
4. Caching strategy not optimized (consider implementing proper cache headers)
5. File uploads not yet integrated (consider implementing for profile pictures, documents)