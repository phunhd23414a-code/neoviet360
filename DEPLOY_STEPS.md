# NeoViet 360 - Hướng Dẫn Deploy Lên Vercel

## Mô hình triển khai

Frontend và backend được deploy trong **một Vercel project** từ thư mục gốc.
Backend serverless nằm tại `api/index.js` và sử dụng Express app trong
`neoviet360-backend/src/app.js`. Frontend gọi API cùng domain qua `/api/*`.

### Cấu hình Vercel một lần

1. **Cài Vercel CLI** (nếu chưa có):
   ```bash
   npm i -g vercel
   ```

2. **Login Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy từ thư mục gốc repository**:
   ```bash
   vercel --prod
   ```

4. **Thêm Environment Variables trên Vercel Dashboard**:
   - `DATABASE_URL`: Supabase **Transaction pooler** URI, thường dùng port `6543` và có `pgbouncer=true`
   - `DIRECT_URL`: Supabase **Session pooler** URI, thường dùng port `5432`
   - JWT_SECRET
   - FRONTEND_ORIGIN (ví dụ: `https://neoviet360.vercel.app`)
   - NODE_ENV=`production`
   - GEMINI_API_KEY (nếu có)

5. **Migration database (nếu Supabase vừa tạo lại hoặc có migration mới)**:
   ```bash
   npm run db:deploy
   ```

Trong Supabase lấy cả hai URI tại **Connect → Connection string → ORMs/Prisma**.
Không dùng URI host `db.<project-ref>.supabase.co:5432` làm `DATABASE_URL` trên Vercel
vì Vercel serverless có thể không truy cập được host direct này.

Vercel chỉ chạy `npm run build` để build frontend và serverless API. Build không
kết nối database, vì Supabase Free có thể tạm pause project khi không có hoạt động.
Sau khi resume Supabase, chạy `npm run db:deploy` một lần từ máy local với
`DATABASE_URL` và `DIRECT_URL` đúng, rồi redeploy Vercel nếu cần.

Khi Supabase bị pause, cần bấm **Resume project** trong Supabase Dashboard
trước. Vercel không thể tự đánh thức project Supabase đã bị pause; đây là giới
hạn của gói Free, không phải lỗi code.

Sau lần cấu hình đầu tiên, các lần push GitHub tiếp theo sẽ tự động deploy
cả frontend và API cùng project.

## Kiểm Tra Sau Deploy

1. Health check: `https://your-frontend.vercel.app/health`
2. Test login: `https://your-frontend.vercel.app/api/auth/login`
   ```json
   { "email": "admin@neoviet360.vn", "password": "password123" }
   ```

3. Test accounts: `https://your-frontend.vercel.app/api/accounts`

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