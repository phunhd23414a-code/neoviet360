# NeoViet 360 — Comprehensive Project Overview

> **Phiên bản tài liệu:** 1.0 — 2026-07-10  
> **Mục đích:** Cung cấp toàn bộ cấu trúc, kiến trúc, chức năng và luồng dữ liệu của dự án NeoViet 360 để AI khác (ChatGPT, Claude) có thể đọc và hiểu hoàn toàn.

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Tech Stack](#2-tech-stack)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Frontend — Single Page Application](#4-frontend--single-page-application)
   - 4.1 [Entry Point (index.html)](#41-entry-point-indexhtml)
   - 4.2 [Config (config.js)](#42-config-configjs)
   - 4.3 [Utils Layer](#43-utils-layer)
   - 4.4 [Components](#44-components)
   - 4.5 [Pages / Routes](#45-pages--routes)
   - 4.6 [Banking Modules](#46-banking-modules)
   - 4.7 [Payment Modules](#47-payment-modules)
   - 4.8 [Global / Ecosystem Modules](#48-global--ecosystem-modules)
   - 4.9 [Analytics](#49-analytics)
   - 4.10 [Styles](#410-styles)
   - 4.11 [PWA — Service Worker & Manifest](#411-pwa--service-worker--manifest)
5. [Backend — Express + Prisma API](#5-backend--express--prisma-api)
   - 5.1 [Cấu trúc Backend](#51-cấu-trúc-backend)
   - 5.2 [Database Schema (Prisma)](#52-database-schema-prisma)
   - 5.3 [API Endpoints](#53-api-endpoints)
   - 5.4 [Authentication & Authorization](#54-authentication--authorization)
   - 5.5 [Controllers Logic](#55-controllers-logic)
6. [Data Flow & Architecture Patterns](#6-data-flow--architecture-patterns)
7. [Mock Data](#7-mock-data)
8. [GSD Agent Framework](#8-gsd-agent-framework)
9. [Deployment](#9-deployment)
10. [Testing](#10-testing)

---

## 1. Tổng quan dự án

**NeoViet 360** là một nền tảng tài chính số (Digital Banking / Fintech) tích hợp AI, xây dựng theo mô hình SPA (Single Page Application) cho frontend và REST API cho backend.

### Tính năng cốt lõi

| Tính năng | Mô tả |
|-----------|-------|
| **Core Banking** | Quản lý tài khoản, chuyển khoản, tiết kiệm, vay, thẻ ngân hàng |
| **Thanh toán** | QR Pay, hóa đơn, nạp điện thoại, ví điện tử, chia hóa đơn, thanh toán định kỳ |
| **Toàn cầu** | Tỷ giá ngoại tệ thời gian thực, giá crypto, chuyển đổi tiền tệ |
| **AI Coach** | Trợ lý AI tích hợp Gemini 2.0, phân tích chi tiêu, dự đoán ngân sách, phát hiện bất thường |
| **Phân tích** | Báo cáo tài chính, xu hướng chi tiêu, net worth, carbon footprint, xuất CSV/Excel |
| **Bảo mật** | JWT auth, OAuth Google/Zalo, eKYC, Smart OTP |
| **PWA** | Cài đặt như app, offline caching, service worker |
| **Ecosystem** | Chatbot AI, Marketplace cổ phiếu |

---

## 2. Tech Stack

### Frontend

| Công nghệ | Vai trò | Ghi chú |
|-----------|---------|---------|
| **Vanilla JavaScript** | Framework chính | Không React/Vue/Angular — SPA thuần JS |
| **Tailwind CSS (CDN)** | Utility CSS | `cdn.tailwindcss.com` |
| **Chart.js (CDN)** | Biểu đồ | `cdn.jsdelivr.net/npm/chart.js` |
| **Lucide (CDN)** | Icons SVG | `unpkg.com/lucide` |
| **Animate.css (CDN)** | Animation | `cdnjs.cloudflare.com/ajax/libs/animate.css` |
| **QRCode.js (CDN)** | QR Code | `cdnjs.cloudflare.com/ajax/libs/qrcodejs` |
| **Google Fonts** | Typography | Inter + Outfit |

### Backend

| Công nghệ | Vai trò |
|-----------|---------|
| **Node.js** | Runtime |
| **Express 4.21** | Web framework |
| **Prisma 5.22** | ORM |
| **PostgreSQL (Supabase)** | Database |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Google Auth Library** | OAuth2 Google |
| **Axios** | HTTP client (external APIs) |
| **Google Gemini 2.0 Flash** | AI Chat |
| **Nodemon** | Dev hot reload |

### Infra

| Thành phần | Công nghệ |
|-----------|-----------|
| Frontend hosting | Vercel / Static |
| Backend hosting | Vercel Serverless / Node server |
| Database | Supabase PostgreSQL cloud |
| External APIs | exchangerate-api.com, CoinGecko, Google Gemini |

---

## 3. Cấu trúc thư mục

```
neoviet360/
├── index.html                     # Entry point SPA
├── config.js                      # Frontend config (API URL, keys)
├── manifest.json                  # PWA manifest
├── sw.js                          # Service Worker
├── .gitignore
│
├── styles/
│   ├── globals.css                # Eco-tech background, glassmorphism, layers
│   ├── theme.css                  # CSS variables, dark/light mode
│   └── components.css             # Glass panel, 3D card effects
│
├── utils/
│   ├── state.js                   # Global in-memory state store
│   ├── router.js                  # Hash-based SPA router
│   ├── auth.js                    # Auth helpers (login/logout/session)
│   ├── api.js                     # Legacy mock JSON fetcher
│   ├── api-adapter.js             # Full REST API client (main)
│   ├── format.js                  # Currency, date, account formatting
│   ├── aiAnalytics.js             # AI spending analysis engine
│   ├── advancedAnalytics.js       # Advanced financial analytics
│   ├── skeleton.js                # Skeleton loaders
│   └── mockDelay.js               # Simulated network delay
│
├── components/
│   ├── Header.js                  # Top navigation bar
│   ├── BottomNav.js               # Mobile bottom navigation
│   ├── Sidebar.js                 # Legacy sidebar
│   ├── UserMenu.js                # User dropdown menu
│   ├── Chart.js                   # Cash flow chart (Canvas)
│   ├── Modal.js                   # Reusable modal system
│   ├── AICoachModal.js            # AI Coach modal
│   ├── ReportsModal.js            # Financial reports modal
│   ├── TransactionDetailModal.js  # Transaction detail popup
│   ├── TrendAnalysisChart.js      # Spending trends modal
│   └── LogoutModal.js             # Logout confirmation
│
├── pages/
│   ├── LoginPage.js               # Auth page (login + register)
│   ├── EkycPage.js                # eKYC biometric verification
│   ├── DashboardPage.js           # Main dashboard
│   ├── ActivityPage.js            # Transaction history
│   ├── PaymentsPage.js            # Payment hub
│   ├── InsightsPage.js            # Analytics & global market
│   ├── ProfilePage.js             # User profile
│   ├── RewardsPage.js             # NeoPoints rewards
│   └── CarbonPage.js              # Carbon footprint tracking
│
├── banking/
│   ├── accounts.js                # Account management page
│   ├── transfer.js                # Money transfer (3-step: form → confirm → OTP)
│   ├── savings.js                 # Savings goals
│   ├── loan.js                    # Loan management
│   ├── cards.js                   # Card management
│   └── invest.js                  # Investment/stocks
│
├── payment/
│   ├── qr-pay.js                  # QR code payment
│   ├── bill-pay.js                # Bill payment
│   ├── scheduled.js               # Scheduled payments
│   ├── ewallet.js                 # E-wallet transfers
│   ├── topup.js                   # Mobile top-up
│   └── split-bill.js              # Split bills
│
├── global/
│   ├── fx-exchange.js             # Foreign exchange
│   └── crypto.js                  # Cryptocurrency
│
├── ecosystem/
│   ├── chatbot.js                 # AI Chatbot (Gemini)
│   └── marketplace.js             # Marketplace
│
├── analytics/
│   └── spending.js                # Spending analysis page
│
├── profile/
│   ├── settings.js                # Account settings
│   └── security.js                # Security settings
│
├── data/                          # Mock JSON data
│   ├── user.json
│   ├── accounts.json
│   ├── transactions.json
│   ├── budgets.json
│   ├── bills.json
│   ├── crypto.json
│   ├── fx-rates.json
│   ├── products.json
│   ├── savings-goals.json
│   ├── recurring-payments.json
│   ├── split-bills.json
│   └── stocks.json
│
├── public/                        # Static assets
│   ├── favicon.svg
│   ├── logo.svg
│   ├── avatar-default.svg
│   ├── mock-qr.svg
│   └── mountain-lake-bg.png
│
├── neoviet360-backend/            # Backend API server
│   ├── package.json
│   ├── .env / .env.example
│   ├── vercel.json
│   ├── README.md
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (24 models)
│   │   └── seed.js                # Database seeder
│   └── src/
│       ├── server.js              # Entry point
│       ├── app.js                 # Express app setup
│       ├── config/prisma.js       # Prisma client
│       ├── utils/httpError.js
│       ├── utils/asyncHandler.js
│       ├── middleware/authGuard.js
│       ├── middleware/errorHandler.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── accounts.controller.js
│       │   ├── transactions.controller.js
│       │   ├── transfer.controller.js
│       │   ├── features.controller.js
│       │   ├── external.controller.js
│       │   └── payment.controller.js
│       └── routes/
│           ├── auth.routes.js
│           ├── accounts.routes.js
│           ├── transactions.routes.js
│           ├── transfer.routes.js
│           ├── features.routes.js
│           ├── external.routes.js
│           └── payment.routes.js
│
├── tests/
│   ├── api-namespace.test.js
│   ├── backend-root.test.js
│   ├── cors-origin.test.js
│   ├── login-default-credentials.test.js
│   └── modal-contract.test.js
│
├── agents/                        # 34 GSD agent definitions
├── gsd-core/                      # GSD framework CLI
├── docs/                          # Planning docs, specs, tasks
├── scripts/                       # Build/utility scripts
└── generated-images/              # AI-generated images
```

---

## 4. Frontend — Single Page Application

### 4.1 Entry Point (`index.html`)

File đầu vào duy nhất, nạp toàn bộ ứng dụng qua **script tags** (không bundler).

**Luồng khởi tạo:**
```
1. Theme khởi tạo ngay lập tức (chống flash)
2. Nạp CDN: Tailwind → Lucide → Chart.js → Animate.css → QRCode
3. Config Tailwind: custom colors (ai-bg, ai-surface, status-*), fonts, animations
4. HTML layout:
   - .eco-tech-landscape (background 5 layers: photo, mist, grid, canvas, spores)
   - #app (header + main + bottom nav) — ẩn khi chưa login
   - #auth-layout (login page) — hiện khi chưa login
   - Nút chatbot FAB (góc phải dưới)
   - #toast-container (thông báo nổi)
   - #modal-container (modal overlay)
5. Scripts nạp theo thứ tự: config → utils → components → pages
6. DOMContentLoaded:
   - Khởi tạo Canvas Background (particles, connections, adaptive FPS)
   - router.init() → kiểm tra session → điều hướng
   - Register Service Worker
```

**Background System (eco-tech-landscape):**
- Layer 1: Ảnh thật `mountain-lake-bg.png` + gradient overlay (màu xanh rêu/công nghệ)
- Layer 2: Mist/sương mờ động (CSS animation)
- Layer 3: Cyber grid perspective (HUD)
- Layer 4: Canvas neural network particles (Vanilla JS, adaptive FPS)
- Layer 5: CSS currency spores floating ($, €, ¥, ₫) (tắt trên mobile)

**Adaptive Performance:**
- FPS tracking (EMA) tự động giảm chất lượng nếu FPS < 42
- Tắt canvas animation khi tab không active
- Tắt hiệu ứng phức tạp khi scrolling
- `prefers-reduced-motion`: tắt tất cả animation
- Mobile: tắt mist, grid, spores

### 4.2 Config (`config.js`)

```javascript
CONFIG = {
  API_BASE: 'http://localhost:3001',    // Backend URL
  ENV: { API_URL: 'http://localhost:3001' },
  STORAGE_KEYS: { USER, TRANSACTIONS, BUDGETS, NOTIFICATIONS },
  GEMINI_API_KEY: "",                    // Google Gemini key
  GEMINI_MODEL: "gemini-2.0-flash",
  MOCK_DELAY_MS: 0,                      // Network simulation delay
  APP_NAME: "NeoViet 360",
  DEFAULT_CURRENCY: "VND"
};
window.ENV = CONFIG.ENV;
window.CONFIG = CONFIG;
```

### 4.3 Utils Layer

#### `utils/state.js` — Global State Store
Store in-memory toàn bộ ứng dụng, gắn vào `window.state`:
```javascript
state = {
  user: null,              // Current user
  accounts: [],            // Bank accounts
  transactions: [],        // Transaction history
  fxRates: {},             // Forex rates
  cryptoPrices: [],        // Crypto prices
  notifications: [],       // Notifications
  budgets: {},             // Budget data
  chatHistory: [],         // AI chat history
  savings: [],             // Savings
  goals: [],               // Goals
  currentPage: 'login',    // Current route
  isLoading: false,
  theme: 'light',
  
  initData()               // Load mock JSON → localStorage
  save()                   // Persist to localStorage
  load()                   // Restore from localStorage
  updateAccountBalance()   // Update + auto-save
  addTransaction()         // Add + auto-save
}
```

#### `utils/router.js` — Hash-based SPA Router
Điều hướng dựa trên `window.location.hash`:
```javascript
router = {
  navigate(page)    // Render page + update hash
  init()            // Boot: restore session → init data → render
}
```
- `hashchange` event listener cho Back/Forward browser
- Kiểm tra `auth.checkProtection()` trước mọi trang core banking
- 25+ route mappings (dashboard, ekyc, accounts, transfer, savings, loan, cards, invest, qr-pay, bill-pay, etc.)

#### `utils/auth.js` — Authentication
```javascript
auth = {
  normalizeUser(user),   // Chuẩn hóa user object (fullName, tier)
  initSession(),          // Restore từ localStorage
  login(email, password), // POST /api/auth/login → lưu token
  getUser(),              // Lấy user từ localStorage
  isLoggedIn(),           // Kiểm tra token tồn tại
  logout(),               // Xóa token + user, redirect login
  checkProtection()       // Redirect nếu chưa login
}
```

#### `utils/api-adapter.js` — REST API Client
Class `APIAdapter` — giao tiếp chính với backend:
```javascript
api = new APIAdapter()
api.setAuth(token, user)
api.clearAuth()

// Auth
api.auth.register(email, password, name)
api.auth.login(email, password)
api.auth.getMe()
api.auth.googleLogin(code)
api.auth.zaloLogin(code)

// Accounts
api.accounts.list(), .get(id), .create(data), .update(id, data)

// Transactions
api.transactions.list(filters), .get(id)

// Transfer
api.transfer.execute(data)

// Payment
api.topup.list(), .create(data)
api.ewallet.list(), .create(data)
api.qrpay.list(), .create(data)
api.scheduled.list(), .get(id), .create(data), .update(id, data), .delete(id), .toggle(id)
api.bills.list(), .get(id), .create(data), .update(id, data), .pay(id, data)
api.splitBills.list(), .get(id), .create(data), .settle(id, data)

// Features
api.budgets.*
api.savings.*
api.loans.*
api.cards.*
api.rewards.*
api.notifications.*

// External
api.external.getFxRates()
api.external.getCryptoPrices()
api.external.chat(message)
api.external.getCarbonTracks()
api.external.addCarbonTrack(data)
```

**Tự động:** Nếu response 401 → clearAuth + redirect login.

#### `utils/api.js` — Legacy Mock Data Fetcher
Đọc file JSON từ `./data/`, có localStorage caching. Được merge vào `window.api` nếu không có API adapter.

#### `utils/format.js` — Format Utilities
```javascript
formatUtils = {
  currency(amount, 'VND')   // "1,000,000 VND"
  maskAccount(accNum)       // "1234 **** **** 3456"
  relativeTime(isoString)   // "2 giờ trước", "Hôm qua"
}
```

#### `utils/aiAnalytics.js` — AI Financial Analysis Engine
Phân tích chi tiêu client-side (không cần gọi API):
- `analyzeSpending(transactions, days)` — tổng chi, trung bình/ngày, top categories
- `compareWithPreviousPeriod(transactions)` — so sánh tháng này/tháng trước (% change)
- `detectAnomalies(transactions)` — phát hiện giao dịch bất thường (lớn hơn 3x trung bình, 3 giao dịch nhanh trong 1 giờ)
- `generateInsights(transactions, budgets)` — gợi ý thông minh (chi tiêu cao ở category, budget alert, daily status)
- `predictNextMonth(transactions)` — dự đoán chi tiêu tháng sau dựa trên trend
- `getCategoryLabel(category)` — map category code → tiếng Việt
- `getSummary(transactions, budgets)` — tổng hợp tất cả

#### `utils/advancedAnalytics.js` — Advanced Reporting
```javascript
advancedAnalytics = {
  groupByPeriod(transactions, 'month'|'quarter'|'year'),
  calculatePeriodStats(transactions),
  generateReport(transactions, period),
  calculateCategoryTrends(transactions),
  calculateNetWorth(accounts, transactions),
  generateTaxExport(transactions),     // headers + rows format
  exportToCSV(headers, rows, filename),// Download CSV
  getTopItems(transactions, 'merchant'|'category', limit),
  getAverageMetrics(transactions),
  compareYearOverYear(transactions),
  getDailyTrend(transactions, days)
}
```

#### `utils/skeleton.js` — Skeleton Loaders
Component loading placeholder: `SkeletonLoader.card(n)`, `.transactionRow(n)`, `.text(lines)`.

### 4.4 Components

#### `Header.js` — Top Navigation Bar
- Logo + brand name (NeoViet 360)
- Menu items: Trang chủ, Lịch sử, Thanh toán, Hệ sinh thái, Phân tích
- Search dropdown (giao dịch gần đây, feature suggestions)
- Notification dropdown (mock + real transaction notifications)
- UserMenu integration
- Lucide icons
- `renderNotifications()` — kết hợp transaction gần đây + mock notifications
- `toggleNoti()`, `toggleSearch()`, `closeAllDropdowns()`
- Global click listener (đóng dropdown khi click ngoài)

#### `BottomNav.js` — Mobile Navigation
- 5 items: Trang chủ, Lịch sử, Quét QR (FAB center), Phân tích, Cá nhân
- Chỉ hiển thị trên mobile (`md:hidden`)
- Nút QR lồi lên (Floating Action Button)

#### `UserMenu.js` — User Dropdown
- Avatar + name + tier
- Dropdown: Hồ sơ, Cài đặt, Bảo mật, Đăng xuất
- Tự động tạo avatar từ tên (ui-avatars.com)

#### `Chart.js` — Cash Flow Chart (Canvas)
Vẽ biểu đồ dòng tiền bằng Canvas API thuần (không Chart.js):
- 3 series: Income (xanh), Expense (đỏ), Savings (cyan)
- Bezier curves, gradient fill, glow effect
- Legend, grid, Y-axis labels
- Hover tooltip với pointer tracking
- Legend: Tiết kiệm, Chi tiêu, Thu nhập
- Adaptive High DPI (`devicePixelRatio`)
- Clean up event listeners khi rerender

#### `Modal.js` — Reusable Modal System
```javascript
Modal = {
  init()                          // Tạo container DOM
  open(htmlContent, size)         // Mở modal với kích thước (md, lg, 2xl, 4xl, full)
  close()                         // Đóng với animation
  showSuccess(message, title)     // Modal success nhanh
}
```
- Backdrop click to close
- Scale/fade animation
- Lucide icons

#### `AICoachModal.js` — AI Financial Coach
Modal phân tích chi tiêu toàn diện:
- Monthly summary (total spent, avg daily, transaction count)
- AI Insights (top gợi ý với severity color)
- Category breakdown (progress bars)
- Prediction cho tháng tới
- Anomaly detection alerts
- Export report (download .txt)
- Buttons: Phân tích, Báo cáo

#### `ReportsModal.js` — Financial Reports
Báo cáo tài chính nâng cao:
- Net balance hero card
- KPI cards (Income, Expense, Investment)
- Spending ratio progress bar (màu: safe/warning/danger)
- Donut chart (Chart.js) — spending by category
- Line chart — cash flow over time
- Top merchants + top categories lists
- Export buttons: Báo cáo thuế (tax CSV), Báo cáo tháng (monthly CSV)

#### `TransactionDetailModal.js` — Transaction Detail Popup
- Status, amount, merchant icon
- Transaction ID (copy), time, category, account, notes
- Buttons: Đóng, Biên lai
- Toast notification khi copy ID

#### `TrendAnalysisChart.js` — Spending Trends
- Main trend chart (daily spending line chart — Chart.js)
- MoM (Month-over-Month) comparison
- Category breakdown cards (icon, current month, change %, average, sparkline)
- Sparkline Chart.js per category

#### `LogoutModal.js` — Logout Confirmation
- Modal xác nhận đăng xuất
- Hiệu ứng loading 600ms trước khi logout

### 4.5 Pages / Routes

#### `LoginPage.js` — Authentication
- Giao diện dark theme với hiệu ứng cyber grid
- Login form (email/password mặc định: `admin@neoviet360.vn` / `password123`)
- Register form toggle
- Khôi phục khóa (modal thông báo)
- Login flow: `auth.login()` → router.navigate('dashboard')
- Register flow: fetch user.json mock → lưu localStorage → dashboard

#### `EkycPage.js` — Biometric Verification
- Giao diện quét khuôn mặt giả lập
- Animation scanline + rotating border
- 3 bước giả lập: scan → match 99.8% → hoàn tất
- `mockDelay(1500)` → `mockDelay(1500)` → `mockDelay(1000)` → dashboard

#### `DashboardPage.js` — Main Dashboard (Bento Grid)
Layout 12-column responsive grid:

1. **Hero Card (col-span-5):** Số dư khả dụng + counter animation + account switcher (Tổng hợp/Thanh toán/Tiết kiệm/Đầu tư) + AI daily insight + 2 CTA buttons (Nạp tiền, Chuyển tiền)
2. **Quick Actions (col-span-7):** 10 icon action buttons (Chuyển tiền, Tài khoản, Thẻ, Đầu tư, Tiết kiệm, Khoản vay, Quét QR, Thanh toán, Chia hóa đơn, Hệ sinh thái) — mỗi icon SVG riêng với glow on hover
3. **AI Coach Widget (col-span-12):** SVG neural network entity + description + daily signal + "MỞ COACH AI" button
4. **Cash Flow Chart (col-span-7):** Canvas chart 7 ngày (income/expense/savings) + Deep View button
5. **Recent Transactions (col-span-5):** 6 transactions gần nhất với icon theo type (credit/transfer/investment/expense), click mở modal detail

#### `ActivityPage.js` — Transaction History
- Filter tabs: Tất cả, Thu nhập, Chi tiêu, Chuyển khoản, Đầu tư
- Transaction list với icon + merchant + amount + time
- AI coaching cho giao dịch > 500k
- Export CSV (sao kê ngân hàng)
- View Trends button → mở TrendAnalysisChart

#### `PaymentsPage.js` — Payment Hub
6 payment methods grid:
- Chuyển khoản liên ngân hàng
- Quét mã VNPAY QR
- Thanh toán hóa đơn
- Thanh toán định kỳ
- Chia tiền nhóm
- Nạp tiền điện thoại

#### `InsightsPage.js` — Analytics & Global
- Risk Score AI card (0-100 dựa trên anomaly count)
- Net Worth card (total assets - total liabilities)
- Carbon Footprint card (tính kg CO₂e từ transactions)
- AI Coach section (insights từ aiAnalytics)
- FX Rates (USD, EUR, ...)
- Crypto (BTC, ETH, SOL, ...)
- Analytics & Reports (Financial reports, HNX30, Global stocks)
- Export CSV

#### `ProfilePage.js` — User Profile
- Avatar + name + email + phone + tier + NeoPoints
- Theme toggle (light/dark) với localStorage persistence
- Language, Notifications, Security settings
- Biometric login toggle
- Device management
- Logout button

#### `RewardsPage.js` — NeoPoints & Offers
- Points hero card với progress bar lên tier tiếp theo (Silver→Gold→Platinum)
- Offers grid: Voucher Highlands, Hoàn tiền, Vé CGV, Giảm GrabFood
- Points history (earn/redeem)

#### `CarbonPage.js` — Carbon Footprint
- Total CO₂e this month + trend vs last month
- Tree equivalent calculation
- Breakdown by category
- Tips giảm phát thải
- "Bù đắp Carbon" button

#### Other Pages (routing exists, render methods defined):
- `banking/accounts.js` — AccountsPage
- `banking/transfer.js` — TransferPage
- `banking/savings.js` — SavingsPage
- `banking/loan.js` — LoanPage
- `banking/cards.js` — CardsPage
- `banking/invest.js` — InvestPage
- `payment/qr-pay.js` — QRPayPage
- `payment/bill-pay.js` — BillPayPage
- `payment/scheduled.js` — ScheduledPage
- `payment/ewallet.js` — EwalletPage
- `payment/topup.js` — TopupPage
- `payment/split-bill.js` — SplitBillPage
- `global/fx-exchange.js` — FxExchangePage
- `global/crypto.js` — CryptoPage
- `ecosystem/chatbot.js` — ChatbotPage
- `ecosystem/marketplace.js` — MarketplacePage
- `analytics/spending.js` — SpendingPage
- `profile/settings.js` — SettingsPage
- `profile/security.js` — SecurityPage

### 4.6 Banking Modules

#### `banking/accounts.js` — AccountsPage
- Thẻ ngân hàng 3D (flip animation) với gradient màu theo account
- Số tài khoản được che (maskAccount)
- Balance + quick links (Chuyển tiền, Gửi tiết kiệm)

#### `banking/transfer.js` — TransferPage (3-step flow)
**Step 1: Form**
- Danh bạ thụ hưởng (5 mock contacts với avatar)
- Chọn tài khoản nguồn (dropdown)
- Nhập số tài khoản đích
- Số tiền
- Nội dung chuyển khoản
- Kiểm tra số dư (frontend validation)

**Step 2: Confirm**
- Review thông tin giao dịch
- Phí: Miễn phí

**Step 3: OTP**
- Nhập mã OTP (mặc định: `123456`)
- Gọi API `api.transfer.execute()` → backend transaction
- Thành công → redirect dashboard
- Thất bại → error modal

#### `banking/savings.js` — Savings Goals
- Danh sách mục tiêu (localStorage persistence)
- Progress bar mỗi mục tiêu
- Form tạo mới: tên, số tiền gửi, mục tiêu, deadline, kỳ hạn (1/3/6/12 tháng)
- Tính lãi real-time (công thức: `(gốc * lãi suất * ngày) / 365`)
- `localStorage` để lưu goals

### 4.7 Payment Modules

Mỗi module trong `payment/` là một page riêng với form nhập liệu và gọi API tương ứng.

### 4.8 Global / Ecosystem Modules

- `global/fx-exchange.js` — UI chuyển đổi ngoại tệ
- `global/crypto.js` — Bảng giá crypto + biểu đồ
- `ecosystem/chatbot.js` — Chat với Gemini AI, voice input (Web Speech API)
- `ecosystem/marketplace.js` — Marketplace chứng khoán

### 4.9 Analytics

- `analytics/spending.js` — Phân tích chi tiêu chi tiết với charts

### 4.10 Styles

#### `styles/globals.css` (759 dòng)
Hệ thống visual chính của app:

**Pointer-tracking gradient overlay** (body::before) — radial gradient theo vị trí chuột

**Glassmorphism Layers:**
- `.glass-layer` — Header, backdrop-blur, border glow
- `.layer-primary` — Hero cards, nổi nhất
- `.layer-secondary` — Insight cards
- `.layer-tertiary` — Utility cards

**Hero Effects:**
- `.hero-core` — Gradient theo pointer + energy wave animation
- `.energy-wave` — Sóng năng lượng phía dưới

**Grid Systems:**
- `.bento-grid` — 12-column grid layout
- `.chart-grid` — Background grid cho biểu đồ

**Text Glow:** `.text-glow` (cyan), `.text-glow-emerald`

**3D Card:** flip animation (rotateY 180deg)

**Eco-Tech Background System (chi tiết):**
- `.eco-photo-bg` — mountain-lake-bg.png + gradient overlays
- `.eco-photo-treatment` — Vignette + color grading
- `.mist-layer-1/2/3` — Sương mờ động (radial gradient + filter blur)
- `.lake-hologram-mist` — Hiệu ứng hologram trên mặt hồ
- `.cyber-grid-perspective` — Grid 3D perspective (rotateX)
- Animation: `mistDrift`, `lakeMistSweep`, `landscapeAura`, `gridPerspectiveMove`

**Floating Currency Spores:** 6 ký tự ($, €, ¥, ₫) float từ dưới lên với CSS animation

**AI Coach Widget:** SVG neural network pulsing animation

**Light Mode Overrides:** CSS variables cho chế độ sáng

**Performance Optimizations:**
- `content-visibility: auto` cho main content
- Scroll detection → giảm chất lượng animation khi scroll
- `prefers-reduced-motion` → tắt animation
- Mobile: tắt mist, grid, spores, glow effects
- **Final override:** tắt backdrop-filter, tắt animation tất cả decorative elements, tắt shimmer/glow hover

#### `styles/theme.css` — CSS Variables
```css
:root {
  --color-primary, --color-secondary, --color-danger, --color-success, --color-warning
}
.dark { --color-bg-base, --color-bg-surface, --color-text-main, ... }
```

#### `styles/components.css` — Component Styles
- `.glass-panel` — Glassmorphism card
- `.card-3d-wrap` / `.card-3d-inner` — 3D flip card

### 4.11 PWA — Service Worker & Manifest

**`sw.js`:**
- Cache name: `neoviet360-v2`
- Pre-cache: index.html, CSS, config, utils, logo
- Strategy: Cache-first cho static assets
- API endpoints (pattern: `/api/`) NEVER cache — always network
- Cũng không cache domain `vercel.app`, `neoviet360-backend`, `.json` files

**`manifest.json`:**
- name: "NeoViet 360", short_name: "NeoViet"
- display: standalone (PWA)
- icons: SVG logo 192x192 + 512x512

---

## 5. Backend — Express + Prisma API

### 5.1 Cấu trúc Backend

```
neoviet360-backend/
├── src/
│   ├── server.js                 # Khởi động server + graceful shutdown
│   ├── app.js                    # Express app: CORS, routes, error handler
│   ├── config/prisma.js          # Prisma client singleton
│   ├── utils/httpError.js        # Custom HTTP error class
│   ├── utils/asyncHandler.js     # Async route wrapper
│   ├── middleware/authGuard.js   # JWT authentication middleware
│   ├── middleware/errorHandler.js # Centralized error handler
│   ├── controllers/              # 7 controllers
│   └── routes/                   # 7 routers
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.js                   # Seed data
├── package.json
├── .env / .env.example
└── vercel.json
```

**`server.js`:**
```javascript
const server = app.listen(port, () => ...);
// Graceful shutdown: SIGINT + SIGTERM → disconnect Prisma + close server
```

**`app.js`:**
- CORS: whitelist origins + development mode cho phép tất cả
- `express.json({ limit: '2mb' })`
- Root endpoint: `GET /` — JSON listing all API endpoints
- `GET /health` — Health check
- 7 route groups mounted
- 404 handler + error handler

### 5.2 Database Schema (Prisma)

**Database:** PostgreSQL (Supabase cloud)

**Enums (11):**
`AuthProvider` (LOCAL/GOOGLE/ZALO), `KycStatus`, `AccountType` (CHECKING/SAVINGS/WALLET/CREDIT/INVESTMENT), `TransactionType`, `TransactionStatus`, `BudgetPeriod`, `LoanStatus`, `CardType`, `BillStatus`, `SplitBillStatus`, `NotificationType`, `RewardType`, `ChatRole`

**Models (24 tables):**

| Model | Bảng | Fields chính | Relations |
|-------|------|-------------|-----------|
| **User** | `users` | id, email (unique), passwordHash, name, avatar, provider, providerId, phone, kycStatus | accounts, transactions, budgets, savingsGoals, loans, cards, bills, splitBills, notifications, rewards, chatHistory, carbonTracks, topups, ewalletTxs, qrPayTxs, scheduledPmts |
| **Account** | `accounts` | id, userId, type, name, balance (Decimal 18,2), currency, accountNumber (unique), isDefault | user, outgoing[], incoming[], savingsGoals[], cards[] |
| **Transaction** | `transactions` | id, userId, fromAccountId, toAccountId, amount, currency, category, description, type, status | user, fromAccount, toAccount, splitBills[], rewards[], carbonTracks[] |
| **Budget** | `budgets` | id, userId, category, limitAmount, period, startDate, endDate | user |
| **SavingsGoal** | `savings_goals` | id, userId, accountId, name, targetAmount, currentAmount, deadline | user, account |
| **Loan** | `loans` | id, userId, amount, interestRate, termMonths, monthlyPayment, remaining, status | user |
| **Card** | `cards` | id, userId, accountId, cardNumber (unique), type, limitAmount, spent, isFrozen, expiresAt | user, account |
| **Bill** | `bills` | id, userId, name, amount, category, dueDate, isRecurring, status | user |
| **SplitBill** | `split_bills` | id, creatorId, transactionId, title, totalAmount, members (JSON), status | creator, transaction |
| **Notification** | `notifications` | id, userId, type, title, message, isRead | user |
| **Reward** | `rewards` | id, userId, transactionId, points, type, description | user, transaction |
| **FxRate** | `fx_rates` | id, fromCurrency, toCurrency, rate, source | — |
| **CryptoPrice** | `crypto_prices` | id, symbol, name, priceUsd, change24h, marketCap | — |
| **ChatHistory** | `chat_history` | id, userId, role, content | user |
| **CarbonTrack** | `carbon_tracks` | id, userId, transactionId, category, carbonKg | user, transaction |
| **Topup** | `topups` | id, userId, accountId, phone, amount, status, provider | user |
| **EwalletTransaction** | `ewallet_transactions` | id, userId, fromAccountId, toWallet, amount, status | user |
| **QrPayTransaction** | `qr_pay_transactions` | id, userId, accountId, qrData, amount, merchantName | user |
| **ScheduledPayment** | `scheduled_payments` | id, userId, accountId, type, recipient, amount, frequency, nextRunAt, isActive, lastRunAt | user |

### 5.3 API Endpoints

| Method | Endpoint | Auth | Controller | Mô tả |
|--------|----------|------|------------|-------|
| GET | `/` | No | — | API info |
| GET | `/health` | No | — | Health check |
| POST | `/api/auth/register` | No | auth | Register |
| POST | `/api/auth/login` | No | auth | Login |
| GET | `/api/auth/me` | JWT | auth | Current user |
| GET | `/api/auth/google` | No | auth | Start Google OAuth |
| GET | `/api/auth/google/callback` | No | auth | Google callback |
| GET | `/api/auth/zalo` | No | auth | Start Zalo OAuth |
| GET | `/api/auth/zalo/callback` | No | auth | Zalo callback |
| GET | `/api/accounts` | JWT | accounts | List accounts |
| GET | `/api/accounts/:id` | JWT | accounts | Get account |
| POST | `/api/accounts` | JWT | accounts | Create account |
| PUT | `/api/accounts/:id` | JWT | accounts | Update account |
| GET | `/api/transactions` | JWT | transactions | List (filterable) |
| GET | `/api/transactions/:id` | JWT | transactions | Get transaction |
| POST | `/api/transfer` | JWT | transfer | Execute transfer |
| GET | `/api/budgets` | JWT | features | List budgets |
| POST | `/api/budgets` | JWT | features | Create budget |
| PUT | `/api/budgets/:id` | JWT | features | Update budget |
| DELETE | `/api/budgets/:id` | JWT | features | Delete budget |
| GET | `/api/savings` | JWT | features | List savings goals |
| POST | `/api/savings` | JWT | features | Create savings goal |
| PUT | `/api/savings/:id` | JWT | features | Update savings goal |
| GET | `/api/loans` | JWT | features | List loans |
| POST | `/api/loans` | JWT | features | Create loan |
| GET | `/api/cards` | JWT | features | List cards |
| POST | `/api/cards` | JWT | features | Create card |
| PUT | `/api/cards/:id/freeze` | JWT | features | Toggle freeze |
| GET | `/api/bills` | JWT | features | List bills |
| POST | `/api/bills` | JWT | features | Create bill |
| PUT | `/api/bills/:id` | JWT | features | Update bill |
| DELETE | `/api/bills/:id` | JWT | features | Delete bill |
| GET | `/api/split-bills` | JWT | features | List split bills |
| POST | `/api/split-bills` | JWT | features | Create split bill |
| GET | `/api/rewards` | JWT | features | Get rewards balance |
| GET | `/api/notifications` | JWT | features | List notifications |
| PUT | `/api/notifications/:id/read` | JWT | features | Mark read |
| GET | `/api/chat-history` | JWT | features | Get chat history |
| POST | `/api/chat-history` | JWT | features | Add chat message |
| GET | `/api/fx-rates` | No | external | Forex rates |
| GET | `/api/crypto` | No | external | Crypto prices |
| POST | `/api/chat` | JWT | external | AI Chat (Gemini) |
| GET | `/api/carbon` | JWT | external | Carbon tracks |
| POST | `/api/carbon` | JWT | external | Add carbon track |
| GET | `/api/payment/topups` | JWT | payment | List topups |
| POST | `/api/payment/topups` | JWT | payment | Create topup |
| GET | `/api/payment/ewallet` | JWT | payment | E-wallet list |
| POST | `/api/payment/ewallet` | JWT | payment | E-wallet transfer |
| GET | `/api/payment/qrpay` | JWT | payment | QR pay list |
| POST | `/api/payment/qrpay` | JWT | payment | QR pay transaction |
| GET | `/api/payment/scheduled` | JWT | payment | Scheduled payments |
| POST | `/api/payment/scheduled` | JWT | payment | Create scheduled |
| PUT | `/api/payment/scheduled/:id` | JWT | payment | Update scheduled |
| DELETE | `/api/payment/scheduled/:id` | JWT | payment | Delete scheduled |
| PATCH | `/api/payment/scheduled/:id/toggle` | JWT | payment | Toggle active |
| POST | `/api/payment/bill/pay` | JWT | payment | Pay bill |
| POST | `/api/payment/split-bill/settle` | JWT | payment | Settle split bill |

### 5.4 Authentication & Authorization

**`authGuard.js`:**
```javascript
// 1. Lấy Bearer token từ header
// 2. jwt.verify(token, JWT_SECRET)
// 3. prisma.user.findUnique({ id: payload.sub })
// 4. Gán req.user + req.userId
// 5. next()
```

**`auth.controller.js`:**
- **Register:** bcrypt hash(12), Prisma create, JWT sign
- **Login:** 
  1. Thử database trước
  2. Nếu DB unavailable → fallback mock users (admin@neoviet360.vn, demo@neoviet360.vn) với hardcoded passwords
  3. JWT sign với `{ sub, email }`, expires 7d
- **Google OAuth2:** OAuth2Client → getToken → verifyIdToken → upsert user → redirect với token
- **Zalo OAuth:** Zalo OAuth → access token → graph API → upsert user

**`errorHandler.js`:**
- HttpError class → status + message
- JWT errors → 401
- Prisma errors (P####) → DB error hoặc validation error
- Sanitize: giấu internal details trong production
- DB connection errors → 503 "Database service temporarily unavailable"

### 5.5 Controllers Logic

#### `transfer.controller.js` — Transfer (wrapped in Prisma transaction)
```
1. Validate inputs (fromAccountId, toAccountId/number, amount)
2. Prisma $transaction:
   a. Check fromAccount tồn tại + belongs to user + đủ balance
   b. Find toAccount (by ID hoặc accountNumber)
   c. Decrement fromAccount balance
   d. Increment toAccount balance
   e. Create Transaction record (type: TRANSFER, status: COMPLETED)
   f. Auto-earn reward points (amount / 1000)
   g. Check budgets → nếu vượt ngân sách → tạo notification
3. Return transaction
```

#### `features.controller.js` — CRUD cho 9 feature
Mỗi feature có pattern:
```
getAll: prisma.findMany({ where: { userId }, orderBy })
create: prisma.create({ data: { userId, ... }})
getById / update / delete: kiểm tra ownership trước
```

Đặc biệt:
- `getBudgets`: Aggregation spent amount từ transactions
- `getRewards`: Sum all points
- `getCards`: include account relation

#### `external.controller.js` — External APIs
- **FX Rates:** Cache 1 giờ trong DB → nếu hết hạn → fetch từ exchangerate-api.com → lưu DB → return
- **Crypto:** Cache 1 giờ → fetch CoinGecko (BTC, ETH, SOL, ADA, DOT) → lưu DB
- **Chat (Gemini):** User context (accounts, budgets, savings, transactions) → system prompt → Gemini API → lưu chat history
- **Carbon:** Basic CRUD

#### `payment.controller.js` — Payment features
Mỗi payment type (topup, ewallet, qrpay):
1. Create record trong bảng riêng
2. Tạo Transaction record trong bảng transactions (type: TOPUP/PAYMENT, status: COMPLETED)
3. Return

---

## 6. Data Flow & Architecture Patterns

### 6.1 Application Bootstrap Flow
```
index.html loads
  ↓
DOMContentLoaded:
  ├── Canvas background init
  ├── router.init()
  │   ├── auth.initSession()     ← restore từ localStorage
  │   ├── if logged in:
  │   │   ├── state.initData()   ← load mock JSON
  │   │   ├── read URL hash
  │   │   └── router.navigate(page)
  │   └── else:
  │       └── router.navigate('login')
  └── Service Worker register
```

### 6.2 Page Navigation Flow
```
User clicks a link/button
  ↓
onclick="router.navigate('page')"
  ↓
router.navigate(page):
  ├── Nếu login → auth.checkProtection() + auth.isLoggedIn()
  ├── Ẩn/hiện #app / #auth-layout
  ├── Header.render(headerContainer, page)
  ├── BottomNav.render(bottomNavContainer, page)
  └── Page.render(mainContent)
```

### 6.3 Login Flow
```
LoginPage → form submit
  ↓
auth.login(email, password)
  ↓
api.auth.login(email, password)
  ↓
POST /api/auth/login
  ├── DB available → Prisma lookup + bcrypt compare
  └── DB unavailable → Mock credentials check
  ↓
JWT token + user object
  ↓
api.setAuth(token, user) → localStorage
state.user = user
  ↓
router.navigate('dashboard')
  ↓
state.initData() → load accounts, transactions, budgets
```

### 6.4 Transfer Flow
```
TransferPage → Step 1 (Form)
  ↓ Kiểm tra số dư frontend
Step 2 (Confirm)
  ↓
Step 3 (OTP) → mã "123456"
  ↓
api.transfer.execute(data)
  ↓
POST /api/transfer (JWT)
  ↓
Transfer controller:
  ├── Prisma $transaction
  │   ├── Check fromAccount
  │   ├── Decrement balance
  │   ├── Increment toAccount
  │   ├── Create Transaction
  │   ├── Create Reward points
  │   └── Check budget thresholds
  └── Response 201
  ↓
Success → router.navigate('dashboard')
Failed → Modal error
```

### 6.5 AI Coach Flow
```
Dashboard → Click "MỞ COACH AI"
  ↓
AICoachModal.open()
  ↓
aiAnalytics.getSummary(state.transactions, state.budgets)
  ├── analyzeSpending(30 days)
  ├── compareWithPreviousPeriod()
  ├── predictNextMonth()
  ├── generateInsights()
  └── detectAnomalies()
  ↓
Render: summary cards → insights → category breakdown → prediction → anomalies
```

### 6.6 AI Chat Flow
```
ChatbotPage → form submit
  ↓
Gọi Gemini API trực tiếp từ frontend:
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
  ├── system_instruction (Vietnamese financial assistant)
  └── contents (state.chatHistory)
  ↓
Lưu response vào state.chatHistory
  ↓
Render lại chat messages
```

Hoặc từ backend:
```
POST /api/chat (JWT)
  ↓
external.controller → chat()
  ├── Load user context (accounts, budgets, savings, transactions)
  ├── Build system prompt
  ├── Gemini API call
  ├── Save to ChatHistory
  └── Return { reply, context }
```

### 6.7 Mock Data Fallback
Khi backend không available:
- Login: mock users (admin@neoviet360.vn / password123)
- Data: 12 file JSON trong `data/`
- Caching: localStorage cho transactions, accounts, budgets
- API: `api.fetchJSON(path)` → fetch `./data/*.json`

---

## 7. Mock Data

12 file JSON trong `data/`:

| File | Nội dung |
|------|---------|
| `user.json` | 1 user: Admin NeoViet, email admin@neoviet360.vn, tier VIP |
| `accounts.json` | 7 accounts: VCB Checking (100M), VCB Savings (500M), VCB Credit (50M), VCB Investment (200M), Techcombank (150M), VPBank (75M), ACB (60M) |
| `transactions.json` | ~20 transactions: salary credit, transfers, shopping, dining, investment, bills |
| `budgets.json` | Budgets cho: bill-payment, shopping, entertainment, eating, transport |
| `bills.json` | Bills: điện, nước, internet, Netflix |
| `crypto.json` | BTC, ETH, SOL, ADA, DOT prices |
| `fx-rates.json` | USD, EUR, GBP, JPY, KRW, THB rates |
| `products.json` | Marketplace products |
| `savings-goals.json` | Savings goals (Mua xe, Du lịch, Quỹ khẩn cấp) |
| `recurring-payments.json` | Recurring payments |
| `split-bills.json` | Split bills (Tiền nhà, Tiền điện, Ăn nhóm) |
| `stocks.json` | Stock data |

---

## 8. GSD Agent Framework

Thư mục `gsd-core/` là GSD (Get Shit Done) — framework agent-based CLI:
- 382+ Node.js files
- Phase lifecycle: discuss → spec → plan → execute → verify → ship
- 34 agent definitions trong `agents/` (code reviewer, debugger, planner, executor, UI auditor, security auditor, etc.)
- Workflow orchestration, milestone tracking, code review automation
- Không ảnh hưởng đến logic frontend/backend chính

---

## 9. Deployment

### Frontend
- Static hosting (Vercel)
- URL: `neoviet360.vercel.app` (trong code)
- PWA với service worker caching

### Backend
- Node.js server hoặc Vercel serverless
- `vercel.json` config
- Environment variables trong `.env`:
  - `DATABASE_URL` — Supabase PostgreSQL
  - `JWT_SECRET` + `JWT_EXPIRES_IN`
  - `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
  - `ZALO_APP_ID` + `ZALO_APP_SECRET`
  - `GEMINI_API_KEY`
  - `FRONTEND_ORIGIN` — CORS whitelist
  - `FRONTEND_AUTH_REDIRECT` — OAuth redirect URL
  - `NODE_ENV`

---

## 10. Testing

5 test files trong `tests/`:

| File | Mô tả |
|------|-------|
| `api-namespace.test.js` | Kiểm tra `window.api` namespace tồn tại |
| `backend-root.test.js` | Test backend root endpoint |
| `cors-origin.test.js` | Test CORS headers |
| `login-default-credentials.test.js` | Test login với default credentials |
| `modal-contract.test.js` | Test Modal API contract |

---

## Tổng kết

NeoViet 360 là một **fintech dashboard toàn diện** với:
- **Frontend:** SPA thuần JavaScript với eco-tech dark theme, glassmorphism, canvas animation, bento grid layout
- **Backend:** REST API với Express + Prisma + PostgreSQL (Supabase)
- **AI Integration:** Google Gemini 2.0 Flash cho chatbot + phân tích chi tiêu thông minh
- **PWA:** Service worker caching, manifest, offline-capable
- **Bảo mật:** JWT authentication, OAuth2 (Google, Zalo), OTP simulation, eKYC
- **Tính năng fintech:** 6 banking modules, 6 payment modules, forex, crypto, rewards, carbon tracking
- **Phân tích:** AI spending insights, financial reports, trend analysis, CSV export
- **Visual:** 5-layer eco-tech background system, adaptive FPS, glassmorphism layers, 3D card animation
- **Mock data fallback:** Hoạt động độc lập không cần backend

---

*Tài liệu được tạo bởi Claude Code — 2026-07-10*
