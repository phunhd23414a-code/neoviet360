# NeoViet 360 - Hướng Dẫn Deploy Lên Vercel

## Đã Hoàn Thành ✅
1. ✅ Migration Prisma lên Supabase Cloud
2. ✅ Seed dữ liệu demo (user: admin@neoviet360.vn / password123)
3. ✅ Cập nhật API adapter cho Vercel

## Cần Thực Hiện (Deploy Manual)

### Bước 1: Deploy Backend lên Vercel

1. **Cài Vercel CLI** (nếu chưa có):
   ```bash
   npm i -g vercel
   ```

2. **Login Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Backend**:
   ```bash
   cd neoviet360-backend
   vercel --prod
   ```

4. **Thêm Environment Variables trên Vercel Dashboard**:
   - DATABASE_URL
   - JWT_SECRET
   - FRONTEND_ORIGIN
   - GEMINI_API_KEY (nếu có)

5. **Copy URL backend** (ví dụ: `https://neoviet360-backend.vercel.app`)

### Bước 2: Deploy Frontend lên Vercel

1. **Tạo vercel.json cho frontend** (nếu chưa có):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Deploy Frontend**:
   ```bash
   vercel --prod
   ```

3. **Thêm Environment Variable**:
   - API_URL = URL_backend_của_bạn

## Kiểm Tra Sau Deploy

1. Test login: `https://your-backend.vercel.app/api/auth/login`
   ```json
   { "email": "admin@neoviet360.vn", "password": "password123" }
   ```

2. Test accounts: `https://your-backend.vercel.app/api/accounts`

## Troubleshooting

### Lỗi CORS
- Kiểm tra FRONTEND_ORIGIN trong .env có chứa domain Vercel frontend

### Lỗi 401 Unauthorized
- Kiểm tra JWT_SECRET giống nhau ở local và Vercel

### Lỗi Database Connection
- Kiểm tra DATABASE_URL đúng trong Vercel Environment Variables
- Kiểm tra Supabase password còn valid

## Thông Tin Tài Khoản Demo
- Email: admin@neoviet360.vn
- Password: password123