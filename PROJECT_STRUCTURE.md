# NEOVIET 360 - AI Financial Platform

## Tổng quan Project

**NeoViet 360** là một nền tảng tài chính AI (AI Financial Platform) được xây dựng dưới dạng Progressive Web App (PWA) với backend Node.js/Express.

## Kiến trúc tổng thể

```
neoviet360/
├── index.html              # Entry point (SPA)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── config.js               # App configuration
│
├── neoviet360-backend/     # Backend API (Node.js/Express/Prisma)
│   └── src/
│       ├── app.js          # Express app setup
│       ├── server.js       # Server entry
│       ├── config/         # Database config
│       ├── controllers/    # Business logic
│       ├── routes/         # API routes
│       ├── middleware/     # Auth, error handling
│       └── utils/          # Helpers
│
├── pages/                  # Page components (SPA routes)
├── components/             # Reusable UI components
├── banking/                # Banking features
├── payment/               # Payment features
├── analytics/             # Analytics features
├── global/                 # Global features (FX, Crypto)
├── ecosystem/             # Ecosystem features (Chatbot, Marketplace)
├── profile/               # User profile pages
├── utils/                 # Utility functions
├── data/                  # Mock data (JSON)
├── styles/                # CSS styles
└── public/                # Static assets
```

## BACKEND (neoviet360-backend)

### Công nghệ
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma (PostgreSQL/Supabase)
- **Auth:** JWT tokens

### API Endpoints

| Route | Mục đích |
|-------|----------|
| `/api/auth` | Authentication (login, register, refresh token) |
| `/api/accounts` | Quản lý tài khoản ngân hàng |
| `/api/transactions` | Lịch sử giao dịch |
| `/api/transfer` | Chuyển khoản |
| `/api/features` | Features (savings, loans, investments) |
| `/api/external` | External APIs (FX rates, crypto) |

### Backend Structure

```
src/
├── app.js                  # Express setup, CORS, routes
├── server.js               # Server bootstrap
├── config/
│   └── prisma.js           # Prisma client
├── controllers/
│   ├── auth.controller.js
│   ├── accounts.controller.js
│   ├── transactions.controller.js
│   ├── transfer.controller.js
│   ├── features.controller.js
│   └── external.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── accounts.routes.js
│   ├── transactions.routes.js
│   ├── transfer.routes.js
│   ├── features.routes.js
│   └── external.routes.js
├── middleware/
│   ├── authGuard.js        # JWT verification
│   ├── errorHandler.js     # Global error handler
│   └── ... (asyncHandler, httpError)
└── utils/
    ├── asyncHandler.js
    └── httpError.js
```

## FRONTEND (Vanilla JS SPA)

### Công nghệ
- **UI:** Tailwind CSS, Lucide Icons
- **Charts:** Chart.js
- **QR:** QRCode.js
- **Animations:** Animate.css, Canvas API
- **Routing:** Custom SPA router

### Pages (Routes)

| Page | Mục đích |
|------|----------|
| `LoginPage.js` | Trang đăng nhập/đăng ký |
| `EkycPage.js` | eKYC verification |
| `DashboardPage.js` | Dashboard chính |
| `ActivityPage.js` | Lịch sử hoạt động |
| `PaymentsPage.js` | Trang thanh toán |
| `InsightsPage.js` | AI-powered insights |
| `ProfilePage.js` | Trang cá nhân |
| `RewardsPage.js` | Rewards/Points |
| `CarbonPage.js` | Carbon footprint tracking |

### Components

| Component | Mục đích |
|-----------|----------|
| `Header.js` | Header navigation |
| `BottomNav.js` | Mobile bottom navigation |
| `UserMenu.js` | User dropdown menu |
| `Modal.js` | Generic modal |
| `LogoutModal.js` | Logout confirmation |
| `AICoachModal.js` | AI Coach chat |
| `ReportsModal.js` | Financial reports |
| `TransactionDetailModal.js` | Transaction details |
| `Chart.js` | Chart wrapper |
| `TrendAnalysisChart.js` | Trend analysis |
| `Sidebar.js` | Desktop sidebar |

### Banking Features

| Module | Mục đích |
|--------|----------|
| `accounts.js` | Quản lý tài khoản |
| `transfer.js` | Chuyển khoản |
| `savings.js` | Tiết kiệm |
| `loan.js` | Vay vốn |
| `cards.js` | Quản lý thẻ |
| `invest.js` | Đầu tư |

### Payment Features

| Module | Mục đích |
|--------|----------|
| `qr-pay.js` | QR Payment |
| `bill-pay.js` | Bill payment |
| `scheduled.js` | Scheduled payments |
| `ewallet.js` | E-wallet |
| `topup.js` | Nạp tiền |
| `split-bill.js` | Chia bill |

### Utilities

| Module | Mục đích |
|--------|----------|
| `router.js` | SPA routing |
| `state.js` | Global state management |
| `auth.js` | Auth utilities |
| `api.js` | API client |
| `api-adapter.js` | API adapter |
| `format.js` | Formatting utilities |
| `mockDelay.js` | Mock API delay |
| `skeleton.js` | Loading skeletons |
| `aiAnalytics.js` | AI analytics |
| `advancedAnalytics.js` | Advanced analytics |

### Global Features

| Module | Mục đích |
|--------|----------|
| `fx-exchange.js` | Foreign exchange |
| `crypto.js` | Cryptocurrency |

### Ecosystem

| Module | Mục đích |
|--------|----------|
| `chatbot.js` | AI Chatbot |
| `marketplace.js` | Marketplace |

### Analytics

| Module | Mục đích |
|--------|----------|
| `spending.js` | Spending analysis |

### Profile

| Module | Mục đích |
|--------|----------|
| `settings.js` | User settings |
| `security.js` | Security settings |

## Data Files (Mock Data)

| File | Mục đích |
|------|----------|
| `accounts.json` | Mock accounts |
| `transactions.json` | Mock transactions |
| `bills.json` | Bills data |
| `budgets.json` | Budget data |
| `savings-goals.json` | Savings goals |
| `recurring-payments.json` | Recurring payments |
| `split-bills.json` | Split bills |
| `stocks.json` | Stock data |
| `crypto.json` | Crypto data |
| `fx-rates.json` | FX rates |
| `products.json` | Products |
| `user.json` | User data |

## Styles

| File | Mục đích |
|------|----------|
| `globals.css` | Global styles |
| `theme.css` | Theme variables |
| `components.css` | Component styles |

## PWA Features

- **Service Worker:** Offline support
- **Manifest:** Installable app
- **Theme:** Dark mode (default) với màu chủ đạo cyan (#00BCD4)
- **Fonts:** Inter, Outfit

## Design System

### Colors
- **Primary:** `#00E676` (Emerald)
- **Accent:** `#00F5FF` (Cyan)
- **Background:** `#020b08` (Dark forest)
- **Surface:** `rgba(6, 24, 18, 0.6)`

### Animations
- Neural network canvas background
- Particle effects
- Floating currency symbols
- Glass morphism UI

## API Integration

Frontend giao tiếp với backend qua:
- `utils/api.js` - API client chính
- `utils/api-adapter.js` - API adapter
- Mock data trong `data/` folder

## Development

```bash
# Backend
cd neoviet360-backend
npm install
npx prisma generate
npm run dev

# Frontend
# Open index.html in browser hoặc serve qua http-server
```

## Git Repository

- **Remote:** https://github.com/phunhd23414a-code/neoviet360.git
- **Latest Commit:** 416e3ca7ad1b86121a1e61e5e3d356beeb13282f