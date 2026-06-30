# NeoViet 360 Backend

Backend hoàn chỉnh cho NeoViet 360 - Ứng dụng ngân hàng số Việt Nam.

## Stack

- **Runtime**: Node.js + Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT + Google OAuth2 + Zalo OAuth2
- **AI**: Gemini API

## Cấu trúc

```
neoviet360-backend/
├── prisma/
│   ├── schema.prisma    # 15 bảng database
│   └── seed.js          # Seed data mẫu
├── src/
│   ├── config/
│   │   └── prisma.js    # Prisma client
│   ├── controllers/     # Logic xử lý API
│   ├── middleware/      # Auth guard, error handler
│   ├── routes/          # API routes
│   ├── utils/           # Helpers
│   ├── app.js           # Express app
│   └── server.js        # Entry point
├── .env.example         # Template biến môi trường
└── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/google` - Login Google
- `GET /api/auth/zalo` - Login Zalo
- `GET /api/auth/me` - Thông tin user hiện tại

### Banking
- `GET /api/accounts` - Danh sách tài khoản
- `GET /api/transactions` - Lịch sử giao dịch
- `POST /api/transfer` - Chuyển khoản (atomic)

### Features
- `GET/POST /api/budgets` - Ngân sách
- `GET/POST /api/savings` - Mục tiêu tiết kiệm
- `GET/POST /api/loans` - Khoản vay
- `GET/POST /api/cards` - Thẻ ngân hàng
- `GET/POST /api/bills` - Hóa đơn định kỳ
- `GET/POST /api/split-bills` - Chia hóa đơn nhóm
- `GET /api/rewards` - NeoPoints
- `GET /api/notifications` - Thông báo

### External
- `GET /api/fx-rates` - Tỷ giá ngoại tệ
- `GET /api/crypto` - Giá crypto
- `POST /api/chat` - AI Chatbot (Gemini)
- `GET/POST /api/carbon` - Carbon tracking

## Setup

### 1. Cài đặt dependencies
```bash
cd neoviet360-backend
npm install
```

### 2. Cấu hình Supabase
1. Tạo project tại https://supabase.com
2. Lấy `DATABASE_URL` từ Settings > Database
3. Copy `.env.example` thành `.env` và điền thông tin

### 3. Chạy Migration
```bash
npx prisma migrate dev --name init
```

### 4. Seed Data
```bash
npm run seed
```

### 5. Chạy Server
```bash
npm run dev
```

Server chạy tại http://localhost:3001

## Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Render
1. Connect GitHub repo
2. Build Command: `npm run build`
3. Start Command: `npm start`

### Environment Variables cần thiết
- `DATABASE_URL` - Supabase connection string
- `JWT_SECRET` - Secret key cho JWT (tối thiểu 32 ký tự)
- `GOOGLE_CLIENT_ID` - Từ Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - Từ Google Cloud Console
- `ZALO_APP_ID` - Từ Zalo Developer
- `ZALO_APP_SECRET` - Từ Zalo Developer
- `GEMINI_API_KEY` - Từ Google AI Studio

## Kết nối Frontend

Frontend hiện tại sử dụng `utils/api-adapter.js` để gọi API:

```javascript
import api from './utils/api-adapter.js';

// Login
const { token, user } = await api.auth.login(email, password);
api.setAuth(token, user);

// Lấy accounts
const accounts = await api.accounts.list();

// Chuyển khoản
await api.transfer.execute({
  fromAccountId: 'acc-1',
  toAccountId: 'acc-2',
  amount: 1000000,
  description: 'Chuyển tiền'
});
```

## Database Schema

15 bảng liên kết đầy đủ:
- users, accounts, transactions, budgets, savings_goals
- loans, cards, bills, split_bills, notifications
- rewards, fx_rates, crypto_prices, chat_history, carbon_tracks

## Demo Account

Sau khi seed:
- Email: `demo@neoviet360.com`
- Password: `demo123`