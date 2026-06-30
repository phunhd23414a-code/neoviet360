# NeoViet 360 Backend - Hướng dẫn Deploy

## Phase 6: Triển khai sản xuất (Production Deployment)

### 1. Chuẩn bị Supabase Production

#### A. Tạo Database mới (nếu chưa có)
1. Đăng nhập vào https://supabase.com
2. Tạo project mới cho production
3. Đợi database khởi tạo (5-10 phút)
4. Lấy `DATABASE_URL` từ **Settings > Database > Connection Pooling**

#### B. Chạy Migration trên Production
```bash
# Đặt DATABASE_URL tạm thời (production database)
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Chạy migration
npx prisma migrate deploy

# Seed dữ liệu ban đầu (nếu cần)
npm run seed
```

---

### 2. Deploy Backend lên Vercel

#### A. Chuẩn bị Project
```bash
cd neoviet360-backend
git init
git add .
git commit -m "Initial backend setup"
```

#### B. Deploy
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel
# Chọn thư mục hiện tại: .
# Chọn framework: Other
# Chọn build command: npm run build (hoặc bỏ trống nếu không build)
# Chọn output directory: . (bỏ trống)
```

#### C. Thiết lập Environment Variables trên Vercel
1. Vào Dashboard Vercel > Project > Settings > Environment Variables
2. Thêm các biến:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET = [tạo chuỗi ngẫu nhiên 32+ ký tự: openssl rand -hex 32]
JWT_EXPIRES_IN = 7d

FRONTEND_ORIGIN = https://your-frontend.vercel.app,http://localhost:5500
FRONTEND_AUTH_REDIRECT = https://your-frontend.vercel.app/#/login

GOOGLE_CLIENT_ID = [từ Google Cloud Console]
GOOGLE_CLIENT_SECRET = [từ Google Cloud Console]
GOOGLE_CALLBACK_URL = https://your-backend.vercel.app/api/auth/google/callback

ZALO_APP_ID = [từ Zalo Developer]
ZALO_APP_SECRET = [từ Zalo Developer]
ZALO_CALLBACK_URL = https://your-backend.vercel.app/api/auth/zalo/callback

GEMINI_API_KEY = [từ Google AI Studio - aistudio.google.com]

PORT = 3001
NODE_ENV = production
```

3. Redeploy sau khi thêm biến:
```bash
vercel --prod
```

---

### 3. Alternative: Deploy lên Render

#### A. Liên kết GitHub
1. Push code lên GitHub
2. Đăng nhập vào https://render.com
3. Tạo service mới > Web Service
4. Chọn repository `neoviet360-backend`

#### B. Cấu hình Build & Start
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (hoặc Starter tùy nhu cầu)

#### C. Environment Variables
Thêm các biến trong Render Dashboard > Environment

---

### 4. Cấu hình Frontend để kết nối Backend Production

#### A. Cập nhật config.js
```javascript
// config.js
const CONFIG = {
  // Đổi từ localhost sang URL backend thật
  API_BASE: 'https://your-backend.vercel.app',  // hoặc render.com
  // ... rest of config
};
```

#### B. Deploy Frontend
```bash
# Từ thư mục root (neoviet360)
git add config.js
git commit -m "Update API_BASE for production"
git push
# Vercel tự động deploy
```

---

### 5. Kiểm tra & Troubleshooting

#### A. Test API endpoints
```bash
# Test login
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@neoviet360.com","password":"demo123"}'

# Test accounts (với JWT token)
curl -X GET https://your-backend.vercel.app/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### B. Kiểm tra logs
- **Vercel**: Dashboard > Deployments > Select Deployment > Logs
- **Render**: Service > Logs

#### C. Issues phổ biến

**1. CORS Error**
- Kiểm tra `FRONTEND_ORIGIN` trong .env production
- Đảm bảo frontend URL khớp đúng

**2. Database Connection Timeout**
- Kiểm tra `DATABASE_URL` có đúng không
- Đảm bảo Supabase IP whitelist cấu hình (hoặc bỏ qua)

**3. JWT Token Invalid**
- Kiểm tra `JWT_SECRET` khác trên dev/prod
- Token phát sinh trên dev không dùng được trên prod (ngược lại)

**4. Prisma Migration Fails**
- Chạy `npx prisma migrate resolve --rolled-back [migration-name]`
- Rồi chạy lại `npx prisma migrate deploy`

---

### 6. Monitoring & Updates

#### A. Log monitoring
- Cài đặt uptime monitoring (UptimeRobot, Pingdom, etc.)
- Monitor email từ Vercel/Render khi có issues

#### B. Database backup
- Supabase tự động backup hàng ngày
- Tải backup thủ công từ Settings > Backups

#### C. Updates & Patches
```bash
# Cập nhật dependencies
npm update

# Test locally trước
npm run dev

# Push & deploy
git add package*.json
git commit -m "Update dependencies"
git push
```

---

### 7. Load Testing (Optional)

```bash
# Dùng Apache Bench
ab -n 100 -c 10 https://your-backend.vercel.app/api/health

# Hoặc wrk
wrk -t4 -c100 -d30s https://your-backend.vercel.app/api/health
```

---

### 8. Security Checklist

- [ ] JWT_SECRET là chuỗi ngẫu nhiên dài (32+ ký tự)
- [ ] FRONTEND_ORIGIN chỉ chứa domain tin cậy
- [ ] Database connection dùng connection pooling
- [ ] Không commit `.env` file vào git
- [ ] Enable HTTPS (Vercel/Render tự động)
- [ ] Kiểm tra rate limiting nếu có (thêm express-rate-limit)
- [ ] Validate input trên server (đã implement)

---

## Summary

| Step | Platform | Time |
|------|----------|------|
| 1. Supabase Setup | Supabase | 10 min |
| 2. Backend Deploy | Vercel/Render | 5 min |
| 3. Env Variables | Vercel/Render | 5 min |
| 4. Frontend Config | Vercel | 2 min |
| 5. Testing | - | 5 min |

**Total: ~30 minutes**

Sau khi deploy, mọi tính năng sẽ hoạt động với dữ liệu thật từ Supabase. UI không thay đổi, chỉ gọi API thực tế thay vì mock JSON.