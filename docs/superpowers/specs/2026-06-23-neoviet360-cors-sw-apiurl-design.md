# NeoViet360 CORS + Service Worker + API URL Design

## Mục tiêu

Khắc phục triệt để lỗi frontend không thể gọi backend do CORS/preflight trên deployment, đồng thời loại bỏ hai nguồn gây nhiễu hoặc sai lệch request ở frontend:

1. Service worker đang intercept mọi `fetch` request, bao gồm API requests.
2. Frontend đang resolve API base URL không nhất quán giữa `window.ENV`, `config.js`, và fallback hardcoded.

## Phạm vi

Thiết kế này chỉ bao gồm các thay đổi cần thiết để sửa lỗi tích hợp frontend/backend hiện tại:

- Backend:
  - Cấu hình CORS rõ ràng cho local development và deployment
  - Xử lý chắc chắn preflight `OPTIONS` cho `/api/*`
- Frontend:
  - Giới hạn service worker chỉ cache static assets cùng origin
  - Không intercept requests tới backend API
  - Chuẩn hóa cách xác định API base URL
- Verification:
  - Kiểm tra cú pháp
  - Chạy test hiện có liên quan tới CORS/API nếu phù hợp
  - Xác định rõ phần nào cần redeploy để có hiệu lực production

Ngoài phạm vi:

- Refactor toàn bộ kiến trúc config frontend/backend
- Thay đổi business logic auth/login
- Tái cấu trúc toàn bộ deployment pipeline

## Hiện trạng và nguyên nhân gốc

### 1. Backend CORS chưa ổn định trên deployment

`neoviet360-backend/src/app.js` hiện đã có `cors()` middleware, nhưng có các rủi ro sau:

- `app.options("*", cors())` dùng một cấu hình CORS khác với middleware chính
- allowlist phụ thuộc vào `FRONTEND_ORIGIN`, nhưng khi deployment/env không đồng bộ có thể chặn `http://127.0.0.1:5500`
- preflight có thể không trả về headers đúng như frontend cần trong mọi môi trường

Kết quả là browser chặn request ngay ở bước preflight, khiến login fail trước khi vào controller.

### 2. Service worker đang bắt toàn bộ request

`sw.js` hiện dùng cache-first cho mọi request:

- `caches.match(event.request) || fetch(event.request)`

Cách này áp dụng cho cả API requests và có thể:

- làm request API bị xử lý sai
- giữ response cũ sau deploy
- tạo log lỗi nhiễu khi network/API thất bại
- làm khó phân biệt nguyên nhân gốc giữa backend CORS và frontend cache layer

### 3. API base URL bị phân tán

`utils/api-adapter.js` đang ưu tiên `window.ENV?.API_URL`, nhưng fallback trực tiếp sang một URL Vercel hardcoded.

Trong khi đó `config.js` lại có `window.CONFIG.API_BASE`.

Kết quả:

- các nguồn cấu hình mâu thuẫn nhau
- frontend có thể gọi nhầm backend
- môi trường local và production không nhất quán

## Phương án được chọn

Phương án được duyệt là **fix đồng bộ tối thiểu nhưng triệt để**:

1. Sửa backend CORS/preflight để cho phép origin local và deployment hợp lệ một cách rõ ràng.
2. Sửa service worker để bỏ qua API requests và chỉ cache static assets nội bộ.
3. Chuẩn hóa frontend API URL resolution theo thứ tự ưu tiên rõ ràng.

Lý do chọn:

- xử lý đúng ba nguồn lỗi hiện tại
- phạm vi đủ nhỏ để bugfix an toàn
- tránh refactor lớn ngoài nhu cầu

## Thiết kế chi tiết

### A. Backend CORS và preflight

#### Yêu cầu

Backend phải:

- luôn cho phép các origin local phổ biến:
  - `http://127.0.0.1:5500`
  - `http://localhost:5500`
- cho phép bổ sung các origin khác qua env
- xử lý `OPTIONS` cho toàn bộ API endpoints bằng cùng một policy CORS
- cho phép các headers và methods mà frontend thực sự dùng

#### Thiết kế

Tạo một danh sách allowed origins gồm:

- hardcoded local origins
- các origin lấy từ env, ví dụ `FRONTEND_ORIGIN`, tách bằng dấu phẩy

Dùng **một cấu hình CORS thống nhất**:

- `origin(origin, callback)` kiểm tra origin
- cho phép request không có origin
- cho phép origin nằm trong allowlist
- chỉ cho phép toàn bộ origins nếu có cờ debug rõ ràng như `ALLOW_ALL_ORIGINS=true`

Preflight sẽ dùng cùng policy đó thay vì `cors()` mặc định rời rạc. Điều này giúp `OPTIONS` và `POST/GET` trả header nhất quán.

#### Tác động mong đợi

- browser nhận `Access-Control-Allow-Origin` đúng
- preflight `OPTIONS` cho `/api/auth/login` không còn bị chặn
- login flow có thể tiếp tục xuống controller

### B. Service worker

#### Yêu cầu

Service worker phải:

- chỉ cache static assets cùng origin
- không đụng vào API requests
- không đụng vào cross-origin requests tới backend
- dọn cache version cũ để tránh dữ liệu cũ tiếp tục được dùng

#### Thiết kế

Tăng `CACHE_NAME` version.

Trong `fetch` handler:

- nếu request method khác `GET` thì bỏ qua
- nếu request URL khác origin hiện tại thì bỏ qua
- nếu path bắt đầu bằng `/api` thì bỏ qua
- chỉ với static asset nội bộ mới áp dụng cache strategy

Thêm `activate` handler để xóa cache version cũ.

#### Tác động mong đợi

- service worker không còn chen vào login/API requests
- giảm log nhiễu kiểu `sw.js` khi API fail
- tránh stale cache sau khi deploy bản sửa

### C. Frontend API base URL resolution

#### Yêu cầu

Frontend cần một chiến lược resolve API URL rõ ràng và thống nhất.

#### Thiết kế

Trong `utils/api-adapter.js`, xác định API base theo thứ tự:

1. `window.ENV.API_URL` nếu tồn tại
2. `window.CONFIG.API_BASE` nếu tồn tại
3. fallback production URL mặc định cuối cùng

Giá trị cuối cùng sẽ được normalize bằng cách bỏ dấu `/` ở cuối để tránh lỗi ghép path.

Frontend không nên bỏ qua `config.js`, vì file này đang là nguồn cấu hình hiện hữu trong dự án.

#### Tác động mong đợi

- local có thể dùng `config.js`
- production có thể override bằng `window.ENV`
- fallback chỉ còn là lưới an toàn cuối cùng
- tránh hardcode mù

## Kế hoạch verification

### Kiểm tra cục bộ

- đọc lại file sau khi sửa để xác nhận logic đúng
- chạy test hoặc script liên quan CORS/API nếu có
- kiểm tra syntax Node cho backend
- kiểm tra syntax service worker/frontend JS ở mức cơ bản

### Kiểm tra production/deploy

Một số thay đổi chỉ có hiệu lực sau redeploy backend/frontend, đặc biệt:

- CORS headers trên Vercel backend
- service worker mới được activate trên client đang chạy

Vì vậy kết quả cuối cùng cần phân loại rõ:

- phần đã verify local
- phần cần redeploy và hard refresh/service worker refresh để xác nhận

## Rủi ro và cách giảm thiểu

### Rủi ro 1: Allowlist thiếu origin deploy thật
Giảm thiểu bằng cách hỗ trợ env ngoài local defaults.

### Rủi ro 2: Service worker cũ vẫn còn trên máy người dùng
Giảm thiểu bằng cache version mới và activate cleanup.

### Rủi ro 3: Frontend vẫn load config cũ
Giảm thiểu bằng cách ưu tiên `window.ENV`, rồi `window.CONFIG`, rồi fallback cuối cùng.

## Tiêu chí hoàn thành

Công việc được coi là hoàn thành khi:

1. Backend trả CORS/preflight nhất quán cho local origins.
2. Service worker không intercept API requests.
3. Frontend resolve API URL theo thứ tự rõ ràng và nhất quán.
4. Các kiểm tra local liên quan chạy qua.
5. Báo cáo rõ phần nào cần redeploy để thấy hiệu lực production.