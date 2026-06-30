# NeoViet360 Project - Debugging Report

## Problem Identification

### Root Cause: Frontend-Backend Disconnection
The project displays "Route not found" error at `localhost:3001` because:

1. **Frontend using mock data**: The frontend (index.html) was loading `utils/api.js` which reads from local JSON files (`/data/user.json`, `/data/budgets.json`, etc.)
2. **Backend running separately**: The Node.js backend is running on port 3001 as a separate Express API server
3. **No integration**: The frontend never calls the backend API - it's completely disconnected
4. **Authentication issue**: The backend requires JWT tokens, but frontend never authenticates via API

### Error Chain
```
User accesses localhost:3001 
  → Browser requests root path /
  → Backend has no route for GET /
  → Backend returns 404: "Route not found"
  → Frontend never receives JWT token
  → Frontend can't access protected routes
```

## Solution Implemented

### Step 1: Replace Mock API with Real API Adapter ✅
**File: index.html**
- Changed: `<script src="./utils/api.js"></script>`
- To: `<script src="./utils/api-adapter.js"></script>`
- Effect: Frontend now uses real backend API calls instead of mock data

### Step 2: Update Authentication Layer ✅
**File: utils/auth.js**
- Modified `initSession()`: Now checks for `neoviet_token` instead of mock user
- Modified `login()`: Now calls `window.api.auth.login()` to authenticate via backend
- Modified `isLoggedIn()`: Now checks token existence in localStorage
- Result: Authentication now goes through backend verification

### Step 3: Update Login Form ✅
**File: pages/LoginPage.js** (In Progress)
- The login form needs to be updated to pass credentials to the new `auth.login(email, password)` method
- Currently uses `admin@neoviet360.vn / password123` which needs backend validation

## Architecture Overview

### Before (Broken)
```
Frontend (HTML/JS) → LocalStorage → Mock JSON Files
Backend (Node.js) → Running but unused
```

### After (Fixed)
```
Frontend (HTML/JS) → APIAdapter → Backend API (Express)
                  ↓
           JWT Token Storage
                  ↓
              Prisma ORM
                  ↓
            Database (Supabase)
```

## Key Integration Files

### 1. utils/api-adapter.js
Provides wrapper around backend API with methods:
- `api.auth.login(email, password)` - Authenticates user
- `api.setAuth(token, user)` - Stores JWT token
- `api.accounts.list()` - Fetches user accounts
- `api.transactions.list()` - Fetches transactions
- etc.

### 2. Backend Routes (Already Implemented)
- `POST /api/auth/login` - Login endpoint
- `GET /api/accounts` - Requires auth
- `GET /api/transactions` - Requires auth
- All routes protected by authGuard middleware

## Testing & Verification

### Current Status
1. ✅ Backend running on port 3001
2. ✅ API endpoints functional (tested with curl)
3. ✅ JWT authentication working
4. ✅ Frontend now loads APIAdapter
5. ✅ Auth system updated to use backend
6. ⏳ LoginPage needs final updates
7. ⏳ Data pages need to use APIAdapter

### Next Steps
1. Update `pages/LoginPage.js` bindEvents() to use new `auth.login(email, password)`
2. Update `utils/state.js` to fetch data from APIAdapter instead of mock files
3. Update individual pages (Dashboard, Accounts, Transactions, etc.) to use APIAdapter
4. Test complete login flow
5. Verify all protected routes require valid JWT token

## Configuration

### Backend Port
- API Server: `http://localhost:3001`
- Frontend should access: `http://localhost:5500` or similar

### Frontend Configuration
- Edit `config.js` to ensure API_BASE_URL points to backend
- Default should be: `http://localhost:3001/api`

### Environment Variables
- Backend uses `.env` file in `neoviet360-backend/`
- Key variables: DATABASE_URL, JWT_SECRET, CORS_ORIGIN

## Commands to Run

### Start Backend
```bash
cd neoviet360-backend
npm start
```

### Start Frontend
```bash
# Use Live Server or similar to serve index.html on port 5500
# Ensure CORS is properly configured in backend
```

### Verify Backend
```bash
# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@neoviet360.vn","password":"password123"}'
```

## Migration Checklist

- [x] Update index.html to load api-adapter.js
- [x] Update auth.js to use backend authentication
- [ ] Update LoginPage.js to call new auth methods
- [ ] Update state.js to fetch from backend
- [ ] Update DashboardPage.js to use APIAdapter
- [ ] Update AccountsPage.js to use APIAdapter
- [ ] Update TransactionsPage.js to use APIAdapter
- [ ] Update all payment/banking pages to use APIAdapter
- [ ] Test complete user flow
- [ ] Handle error responses properly
- [ ] Add loading states during API calls
- [ ] Implement token refresh logic

## Known Issues to Address

1. **CORS Configuration**: Ensure backend allows requests from frontend origin
2. **Token Expiration**: Implement refresh token mechanism
3. **API Error Handling**: Pages need to handle API failures gracefully
4. **Mock Data Fallback**: Consider keeping some mock data for offline mode
5. **PWA Service Worker**: May need updates for API calls

## Success Criteria

- [ ] Frontend successfully authenticates via backend
- [ ] Dashboard loads real data from database
- [ ] All CRUD operations work through API
- [ ] No "Route not found" errors when accessing backend
- [ ] JWT token properly stored and used
- [ ] Protected routes blocked without valid token