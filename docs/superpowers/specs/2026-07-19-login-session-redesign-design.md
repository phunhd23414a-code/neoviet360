# Login Session & Redesign Spec

**Date:** 2026-07-19
**Status:** Approved  
**Author:** Claude Code  
**Project:** NeoViet 360  

---

## Problem

1. Session persistence: Once logged in, reopening the site always lands on dashboard because `neoviet_token` lives permanently in `localStorage`. No expiry, no respect for the "remember me" checkbox.
2. Login copy reads as AI-generated cyberpunk: "Gate_Way Authentication", "Kích hoạt nút mạng tài chính NeoViet AI", "Mã định danh Node / Email", "Khóa mật mã bảo mật", etc. Unprofessional for a fintech product.

---

## Session Behavior

### Storage Two-Tier

| Storage | When used | Expires |
|---|---|---|
| `sessionStorage` | "Ghi nhớ" checkbox unchecked | 15 minutes from login |
| `localStorage` | "Ghi nhớ" checkbox checked | 15 minutes from login |

### Login Flow

1. User submits form with `email`, `password`, `remember` (checkbox boolean).
2. `auth.login(email, password, remember)` calls API, gets token + user.
3. If `remember === true`:
   - Write `neoviet_token`, `neoviet_user`, `neoviet_session_expires_at` to **`localStorage`**.
4. If `remember === false`:
   - Write same keys to **`sessionStorage`** (auto-cleared on tab close).
5. `auth.login` returns user object; router navigates to dashboard.

### App Init Session Check (`auth.initSession`)

1. **Priority:** `sessionStorage` first → `localStorage` fallback.
2. Read `neoviet_session_expires_at`. If `Date.now() > expires_at`, treat as logged-out.
3. On expiry:
   - Clear auth keys from both storages.
   - Set `state.currentPage = 'login'`.
   - Return `null` (not logged in).
4. If valid: read `neoviet_user`, normalize, set `state.user`, return user.

### 15-Minute Session Window

The 15-minute window is measured from the moment of login, not from last activity (simpler, matches the JWT 7d pattern but shorter). The exact timestamp is recorded as `neoviet_session_expires_at = Date.now() + 900000` (15 min × 60 sec × 1000 ms). Checked on every `router.init()` call.

### Logout (always clears both storages)

- `auth.logout()`: remove `neoviet_token`, `neoviet_user`, `neoviet_session_expires_at` from both `localStorage` and `sessionStorage`.
- 401 handler in `api-adapter.js`: calls `clearAuth()` which also clears both storages.

---

## Login Page UI

### Brand & Positioning

- Keep existing dark/neon background (eco-tech landscape, particle canvas).
- Login card: glassmorphism with refined glow — thinner borders, no aggressive laser-like hover effects.
- Card corner: `rounded-3xl` as before, shadow softer.
- Brand icon: `shield-check` (trust/finance vibe) instead of `sparkles`.

### Copy (Vietnamese)

| Element | Before (AI) | After (Refined) |
|---|---|---|
| Title | Gate_Way Authentication | **Đăng nhập NeoViet 360** |
| Subtitle | Kích hoạt nút mạng tài chính NeoViet AI | **Quản lý tài chính, thanh toán và ưu đãi của bạn trong một nơi.** |
| Email label | Mã định danh Node / Email | **Email** |
| Password label | Khóa mật mã bảo mật | **Mật khẩu** |
| Remember label | Ghi nhớ phiên node | **Ghi nhớ đăng nhập trong 15 phút** |
| Forgot action | Khôi phục khóa? | **Quên mật khẩu?** |
| Submit button | KÍCH HOẠT PHIÊN LÀM VIỆC | **Đăng nhập** |
| Register prompt | Chưa có tài khoản? | **Bạn mới sử dụng NeoViet?** |
| Register button | MỞ TÀI KHOẢN NGAY | **Tạo tài khoản** |
| Recover modal body | "Tính năng khôi phục qua khóa private-key đang được đồng bộ với NeoViet AI Core..." | **Tính năng đặt lại mật khẩu đang được hoàn thiện. Vui lòng quay lại sau hoặc liên hệ hỗ trợ NeoViet.** |

### Visual Refinements

- **Input icons:** `terminal` → `mail` for email, `lock` stays for password.
- **Labels:** Remove `font-mono uppercase tracking-widest` from all form labels. Use `text-sm font-medium text-ai-muted`.
- **Button style:** Gradient background `from-status-success to-[#00C4F4]` with white text. Hover: increased shadow/glow but not overwhelming.
- **Remember checkbox:** Unchecked by default (no auto-tick). User must explicitly opt into 15-minute session.
- **Typography:** No monospace outside of the demo helper note.
- **Default values:** Keep `value="admin@neoviet360.vn"` and `value="password123"` for demo convenience, but add proper `autocomplete` attributes: `autocomplete="email"`, `autocomplete="current-password"`.

### Layout (unchanged from current)

- Full-viewport center card on dark background particle canvas.
- Card max-width `max-w-md`, inside glass container.
- Login form → register form toggle via ID-based show/hide (same JS pattern).

---

## Files to Change

| File | Changes |
|---|---|
| `utils/auth.js` | Two-tier storage, expiry check, clear both storages on logout. `login(email, password, remember)` parameter. |
| `utils/api-adapter.js` | `setAuth` accepts storage target (local vs session). `clearAuth` clears both. Token read from active storage. |
| `utils/router.js` | `init()` relies on updated `auth.initSession()`; no additional changes. |
| `pages/LoginPage.js` | New copy, new visuals, pass `remember` to `auth.login`, checkbox unchecked by default. |

---

## Edge Cases

- **Token in one storage, not the other:** On `initSession`, if sessionStorage has a valid token but localStorage doesn't, app uses sessionStorage. Clear both on logout/expiry prevents stale cross-contamination.
- **Clock manipulation:** Uses `Date.now()` (client time). Acceptable for a demo app; for production, server-side timestamp should override.
- **Tab + browser close with localStorage token:** 15-minute window applies. If user opens again at minute 16, expiry cleared → redirected to login.
- **Concurrent tabs:** Each tab independently checks expiry. If one tab logs out (clears both storages), other tab's next route change hits `checkProtection` and redirects to login.
- **Input autocomplete:** Proper attributes enable browser password manager prompts.
