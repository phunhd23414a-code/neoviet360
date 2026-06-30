# NeoViet 360 - Hướng dẫn Tích hợp Backend & Frontend

## Overview

Toàn bộ hệ thống NeoViet 360 đã được xây dựng theo kiến trúc **Backend-Frontend Separation**:
- **Frontend**: HTML/CSS/Vanilla JS - **KHÔNG THAY ĐỔI**
- **Backend**: Express.js + Prisma + Supabase
- **Kết nối**: REST API qua HTTP, xác thực JWT

---

## Kiến trúc Dữ liệu

### Thay đổi từ Mock → Real Data

**TRƯỚC (Mock JSON)**:
```javascript
// Cách cũ - lấy dữ liệu từ file JSON cục bộ
fetch('./data/accounts.json')
  .then(r => r.json())
  .then(data => displayAccounts(data));
```

**SAU (Real API)**:
```javascript
// Cách mới - lấy dữ liệu từ Backend API
const token = localStorage.getItem('jwt_token');
fetch(`${CONFIG.API_BASE}/api/accounts`, {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => displayAccounts(data));
```

**Duy nhất thay đổi**: 
- `config.js`: Thêm `API_BASE = 'http://localhost:3001'`
- `utils/api-adapter.js`: Wrapper để gọi API thay vì mock JSON

---

## API Endpoints đã Triển khai

### 🔐 Authentication (Phase 2)
```
POST   /api/auth/register          ← Đăng ký user mới
POST   /api/auth/login             ← Đăng nhập với email/password
GET    /api/auth/google            ← Login Google OAuth
GET    /api/auth/zalo              ← Login Zalo OAuth
GET    /api/auth/me                ← Lấy thông tin user hiện tại
```

**Test Login**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@neoviet360.com","password":"demo123"}'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": "...", "email": "demo@neoviet360.com", ... }
# }
```

### 💳 Banking - Core (Phase 3)
```
GET    /api/accounts                ← Danh sách tài khoản của user
GET    /api/accounts/:id            ← Chi tiết 1 tài khoản
GET    /api/transactions            ← Lịch sử giao dịch
GET    /api/transactions/:id        ← Chi tiết 1 giao dịch
POST   /api/transfer                ← Chuyển khoản (Atomic)
```

**Test Accounts**:
```bash
curl -X GET http://localhost:3001/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
# [
#   {
#     "id": "acc-main-001",
#     "userId": "...",
#     "type": "CHECKING",
#     "name": "Tài khoản chính",
#     "balance": "147500000",
#     "currency": "VND",
#     ...
#   }
# ]
```

### 📊 Features (Phase 4)
```
GET/POST  /api/budgets              ← Ngân sách theo category
GET/POST  /api/savings              ← Mục tiêu tiết kiệm
GET/POST  /api/loans                ← Quản lý khoản vay
GET/POST  /api/cards                ← Thẻ ngân hàng
GET/POST  /api/bills                ← Hóa đơn định kỳ
GET/POST  /api/split-bills          ← Chia hóa đơn nhóm
GET       /api/rewards              ← NeoPoints
GET       /api/notifications        ← Thông báo
```

### 🌐 External & AI (Phase 5)
```
GET    /api/fx-rates                ← Tỷ giá ngoại tệ (cached)
GET    /api/crypto                  ← Giá crypto (cached)
POST   /api/chat                    ← AI Chatbot (Gemini + Context)
GET/POST /api/carbon                ← Carbon footprint tracking
```

---

## Quy trình Tích hợp

### 1. Local Development Setup

```bash
# Terminal 1: Backend (Port 3001)
cd neoviet360-backend
npm install
npm run dev

# Terminal 2: Frontend (Port 5500)
cd neoviet360
python -m http.server 5500
# hoặc dùng Live Server extension trong VS Code
```

### 2. Cấu hình Frontend

**Step 1: Kiểm tra config.js**
```javascript
// config.js đã có:
const CONFIG = {
  API_BASE: 'http://localhost:3001',
  // ... rest
};
```

**Step 2: Import API Adapter**
```javascript
// Trong các pages (e.g., pages/LoginPage.js)
import api from '../utils/api-adapter.js';

// Sử dụng API
const { token, user } = await api.auth.login(email, password);
api.setAuth(token, user);

// Lấy accounts
const accounts = await api.accounts.list();
```

### 3. Database Sync

Tất cả dữ liệu đã được **seed vào Supabase**:
- Users (1 demo user)
- Accounts (2 tài khoản: Checking + Savings)
- Transactions (10 giao dịch mẫu)
- Budgets (4 ngân sách)
- Savings goals (2 mục tiêu)
- Loans, Cards, Bills, etc. (mẫu)

**Demo Account**:
- Email: `demo@neoviet360.com`
- Password: `demo123`
- Tài khoản chính: 147,500,000 VND
- Tài khoản tiết kiệm: 50,000,000 VND

---

## Luồng Chuyển Khoản (Atomic Transaction)

```
User clicks "Chuyển Tiền"
    ↓
Frontend gọi: POST /api/transfer
    {
      "fromAccountId": "acc-main-001",
      "toAccountId": "acc-savings-001",
      "amount": 5000000,
      "description": "Tiết kiệm tháng 6"
    }
    ↓
Backend validate JWT
    ↓
Backend BEGIN TRANSACTION
    ├─ Kiểm tra balance account từ
    ├─ Debit account từ: -5,000,000
    ├─ Credit account đến: +5,000,000
    ├─ Insert transaction record
    ├─ Check budgets → nếu vượt, insert notification
    ├─ Update rewards → cộng NeoPoints
    └─ COMMIT (nếu thành công) hoặc ROLLBACK (nếu lỗi)
    ↓
Response trả về: 200 OK + updated state
    ↓
Frontend hiển thị balance mới, notification toast
```

**Đảm bảo tính toàn vẹn dữ liệu**: Nếu bất kỳ bước nào fail, toàn bộ transaction rollback. Không bao giờ trừ một account mà không cộng nơi khác.

---

## Chatbot AI + Financial Context

AI Chatbot (Gemini) được **inject context thật** của user:

```javascript
// Request đến /api/chat
{
  "message": "Nên tiết kiệm như thế nào?",
  "userId": "cmqkh1ey00000wgzoqkqwmhtr"
}

// Backend tự động:
// 1. Lấy user profile
// 2. Lấy danh sách tài khoản + balance
// 3. Lấy giao dịch tháng này
// 4. Lấy budgets hiện tại
// 5. Lấy savings goals
// 6. Tính toán spending patterns

// Inject vào system prompt:
const systemPrompt = `
User: Nguyễn Văn Demo
Tổng số dư: 197,500,000 VND (2 tài khoản)
Chi tiêu tháng này:
- Ăn uống: 2,500,000 / 10,000,000 (ngân sách)
- Transport: 1,200,000 / 3,000,000
- Giải trí: 800,000 / 5,000,000
Savings goal: Mua nhà (đã tiết kiệm 5,000,000 / 50,000,000 - 10%)
...`

// Gemini response sẽ chính xác theo tình hình tài chính thật của user
```

---

## Migration từ Mock → Real Data

### Automatic (sử dụng api-adapter.js)
```javascript
// File: utils/api-adapter.js
// Wrapper tự động convert:
// fetch('./data/xxx.json') → fetch(`${API_BASE}/api/xxx`)

import api from './utils/api-adapter.js';

// Thay vì:
// const accounts = await fetchJSON('./data/accounts.json');

// Dùng:
const accounts = await api.accounts.list();
```

### Manual (thay đổi trực tiếp)
Nếu một file không dùng adapter, thay thế:

```javascript
// TRƯỚC
const users = await fetch('./data/user.json').then(r => r.json());

// SAU
const users = await fetch(`${CONFIG.API_BASE}/api/auth/me`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` }
}).then(r => r.json());
```

---

## Error Handling

Backend trả về lỗi chuẩn:

```javascript
// 400 Bad Request
{ "message": "Email and password are required" }

// 401 Unauthorized
{ "message": "Invalid credentials" }
{ "message": "Invalid or expired token" }

// 500 Internal Server Error
{ "message": "Database error", "details": "..." }
```

**Frontend xử lý**:
```javascript
try {
  const accounts = await api.accounts.list();
} catch (error) {
  if (error.status === 401) {
    // Token hết hạn, redirect login
    window.location.hash = '#/login';
  } else if (error.status === 400) {
    // Validation error
    showErrorToast(error.message);
  }
}
```

---

## Performance & Caching

- **API Response caching**: Browser cache HTTP headers
- **FX rates caching**: Backend cache tỷ giá 1 giờ
- **Crypto prices caching**: Backend cache 5 phút
- **Transaction caching**: GET /api/transactions hỗ trợ filter + pagination

---

## Checklist Deploy

### Local Testing ✅
- [x] Backend chạy `npm start` (port 3001)
- [x] Frontend chạy (port 5500)
- [x] Login thành công với demo@neoviet360.com
- [x] Xem danh sách accounts
- [x] Chuyển khoản (balance update)
- [x] Chatbot response chính xác

### Production Setup
- [ ] Deploy backend lên Vercel/Render
- [ ] Cấu hình environment variables
- [ ] Update `CONFIG.API_BASE` → domain thật
- [ ] Deploy frontend lên Vercel
- [ ] Test API từ production domain
- [ ] Monitor logs & errors

---

## Tài liệu Thêm

- **Backend README**: `neoviet360-backend/README.md`
- **Deployment Guide**: `neoviet360-backend/DEPLOYMENT_GUIDE.md`
- **API Docs**: Xem files trong `neoviet360-backend/src/routes/`
- **Database Schema**: `neoviet360-backend/prisma/schema.prisma`

---

## Support

Nếu gặp issues:
1. Kiểm tra terminal logs (backend/frontend)
2. Kiểm tra network tab (DevTools > Network)
3. Kiểm tra browser console (DevTools > Console)
4. Kiểm tra `.env` variables (backend)
5. Kiểm tra CORS headers (backend logs sẽ hiển thị)

**Example debug**:
```javascript
// Browser console
CONFIG // → Check API_BASE
localStorage.getItem('jwt_token') // → Check token
fetch(`${CONFIG.API_BASE}/api/health`) // → Test connection