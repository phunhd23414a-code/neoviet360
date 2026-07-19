# Login Session & Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite login page copy, refine visuals, and implement 15-minute session expiry with two-tier storage (localStorage vs sessionStorage based on "remember me" checkbox).

**Architecture:** The app uses vanilla JS with global `window.*` objects. Auth lives in `utils/auth.js`, HTTP client in `utils/api-adapter.js`, page rendering in `pages/LoginPage.js`. The plan is: (a) add two-tier storage + expiry to auth utilities, (b) rewrite login page copy and refine visuals. Decoupled so order doesn't matter — but storage/expiry must be done before or alongside the page since the page passes a new `remember` parameter.

**Tech Stack:** Vanilla JS, Tailwind CSS (CDN), localStorage/sessionStorage Web API

## Global Constraints

- All copy must be in Vietnamese, natural, no AI-sounding cyberpunk terms.
- "Ghi nhớ đăng nhập" checkbox defaults to **unchecked**.
- `neoviet_session_expires_at` = `Date.now() + 900000` (15 minutes).
- `neoviet_token`, `neoviet_user`, `neoviet_session_expires_at` written to either localStorage or sessionStorage depending on `remember` flag.
- sessionStorage has priority over localStorage during `initSession()`.
- Logout and 401 handler MUST clear auth keys from **both** localStorage and sessionStorage.
- Keep auto-filled demo values: `admin@neoviet360.vn` / `password123`.

---
### Task 1: Add session expiry & two-tier storage to auth.js

**Files:**
- Modify: `utils/auth.js`

**Interfaces:**
- Consumes: `window.api.setAuth(token, user, storage)` (storage = 'local' | 'session')
- Produces: `auth.initSession()` returns user or null (expiry-aware), `auth.login(email, password, remember)` accepts third param, `auth.logout()` clears both storages

- [ ] **Step 1: Add storage helpers**

Replace entire `utils/auth.js` with:

```javascript
// neoviet360/utils/auth.js

const AUTH_KEYS = {
  TOKEN: 'neoviet_token',
  USER: 'neoviet_user',
  EXPIRES: 'neoviet_session_expires_at',
};
const SESSION_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const auth = {
  _storage(type) {
    return type === 'local' ? localStorage : sessionStorage;
  },

  _write(type, key, value) {
    this._storage(type).setItem(key, value);
  },

  _read(type, key) {
    return this._storage(type).getItem(key);
  },

  _remove(type, key) {
    this._storage(type).removeItem(key);
  },

  _clearAll(type) {
    const store = this._storage(type);
    store.removeItem(AUTH_KEYS.TOKEN);
    store.removeItem(AUTH_KEYS.USER);
    store.removeItem(AUTH_KEYS.EXPIRES);
  },

  _clearBoth() {
    this._clearAll('local');
    this._clearAll('session');
  },

  _findValidSession() {
    // Priority: sessionStorage first, then localStorage
    for (const type of ['session', 'local']) {
      const token = this._read(type, AUTH_KEYS.TOKEN);
      const userStr = this._read(type, AUTH_KEYS.USER);
      const expiresStr = this._read(type, AUTH_KEYS.EXPIRES);

      if (token && userStr && expiresStr) {
        const expiresAt = parseInt(expiresStr, 10);
        if (Date.now() < expiresAt) {
          const user = this.normalizeUser(JSON.parse(userStr));
          this._activeStorage = type; // remember which storage was used
          return { token, user, storage: type };
        } else {
          // Expired — clean up this storage
          this._clearAll(type);
        }
      }
    }
    return null;
  },

  normalizeUser(user) {
    if (!user) return null;
    return {
      ...user,
      fullName: user.fullName || user.name || user.email?.split('@')[0] || 'Khách hàng NeoViet',
      name: user.name || user.fullName || user.email?.split('@')[0] || 'Khách hàng NeoViet',
      tier: user.tier || user.membershipTier || 'Thành viên'
    };
  },

  async initSession() {
    const session = this._findValidSession();
    if (session) {
      if (window.api && typeof window.api.setToken === 'function') {
        window.api.token = session.token;
        window.api.user = session.user;
      }
      if (window.state) {
        window.state.user = session.user;
      }
      return session.user;
    }
    // No valid session found — clear everything to be safe
    this._clearBoth();
    if (window.state) {
      window.state.user = null;
    }
    return null;
  },

  async login(email, password, remember = false) {
    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      }

      const result = await window.api.auth.login(email, password);
      const normalizedUser = this.normalizeUser(result.user);
      const storageType = remember ? 'local' : 'session';

      // Store auth data
      this._write(storageType, AUTH_KEYS.TOKEN, result.token);
      this._write(storageType, AUTH_KEYS.USER, JSON.stringify(normalizedUser));
      this._write(storageType, AUTH_KEYS.EXPIRES, String(Date.now() + SESSION_DURATION_MS));

      // Also sync window.api for API calls
      if (window.api) {
        window.api.token = result.token;
        window.api.user = normalizedUser;
      }

      // Also put in localStorage for backward-compat with api-adapter's constructor
      // BUT only if remember=true — adapter constructor will fallback to sessionStorage
      // actually we need to keep api-adapter in sync. Let's update adapter separately.

      if (window.state) {
        window.state.user = normalizedUser;
      }

      return normalizedUser;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      throw error;
    }
  },

  getUser() {
    const session = this._findValidSession();
    return session ? session.user : null;
  },

  isLoggedIn() {
    return this._findValidSession() !== null;
  },

  logout() {
    this._clearBoth();
    if (window.api && typeof window.api.clearAuth === 'function') {
      window.api.token = null;
      window.api.user = null;
    }
    if (window.state) {
      window.state.user = null;
      window.state.currentPage = 'login';
    }
    window.location.hash = '#/login';
    if (window.router) {
      window.router.navigate('login');
    }
  },

  checkProtection() {
    if (!this.isLoggedIn()) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  }
};

window.auth = auth;
```

- [ ] **Step 2: Verify the file loads without syntax errors**

Run in browser console after next reload, or check: `node -e "require('./utils/auth.js')"` fails due to `window` dependency — skip, deploy and test in browser.

- [ ] **Step 3: Commit**

```bash
git add utils/auth.js
git commit -m "feat: add two-tier session storage with 15-min expiry to auth.js

- sessionStorage (remember=false) / localStorage (remember=true)
- expiry check on initSession()
- clearBoth() on logout/401
- login() accepts third 'remember' param

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---
### Task 2: Update api-adapter to support two-tier storage

**Files:**
- Modify: `utils/api-adapter.js`

**Interfaces:**
- Consumes: nothing new — `auth.login()` now manages storage directly
- Produces: `setAuth` still writes to localStorage for backward compat; `clearAuth` clears both storages; constructor reads from either storage.

- [ ] **Step 1: Rewrite api-adapter constructor/setAuth/clearAuth**

Edit `utils/api-adapter.js` lines 29-46:

```javascript
  constructor() {
    // Read from sessionStorage first, then localStorage
    this.token = sessionStorage.getItem('neoviet_token') || localStorage.getItem('neoviet_token');
    const userStr = sessionStorage.getItem('neoviet_user') || localStorage.getItem('neoviet_user');
    this.user = userStr ? JSON.parse(userStr) : null;
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    // Write to both storages so whichever is active will find it
    localStorage.setItem('neoviet_token', token);
    localStorage.setItem('neoviet_user', JSON.stringify(user));
    sessionStorage.setItem('neoviet_token', token);
    sessionStorage.setItem('neoviet_user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('neoviet_token');
    localStorage.removeItem('neoviet_user');
    localStorage.removeItem('neoviet_session_expires_at');
    sessionStorage.removeItem('neoviet_token');
    sessionStorage.removeItem('neoviet_user');
    sessionStorage.removeItem('neoviet_session_expires_at');
  }
```

> **Note:** The constructor still reads both storages as fallback, but `auth.js` owns the actual session logic (including expiry). The `api-adapter` is kept compatible so that any direct callers still work. The `setAuth` method writes to **both** storages so whichever the session logic uses will find the data. The login flow in `auth.js` writes to **one** storage (depending on `remember`) before adapter's `setAuth` writes to both — the adapter runs after the API call returns. Actually, looking at the flow more carefully:

The `auth.login()` calls `window.api.auth.login()` which is the HTTP request. The adapter itself doesn't call `setAuth` in its `auth.login` — it just calls `this.request()`. The `setAuth` is called by `auth.login()` in `auth.js`. So `auth.js` is the one that writes storage. The adapter's `setAuth` is only used externally (e.g., registration flow in `LoginPage.js` line 179). The adapter's `clearAuth` IS called by the 401 handler. So we need consistency.

Let me keep the adapter's `setAuth` simple — it just writes to both storages (belt and suspenders). The `clearAuth` clears both storages. The constructor reads from session first for priority.

- [ ] **Step 2: Commit**

```bash
git add utils/api-adapter.js
git commit -m "fix: update api-adapter for two-tier session storage

- Constructor reads sessionStorage first, then localStorage
- clearAuth removes keys from both storages
- setAuth writes to both for cross-compatibility

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---
### Task 3: Rewrite LoginPage.js — copy, visuals, and remember-me wiring

**Files:**
- Modify: `pages/LoginPage.js`

**Interfaces:**
- Consumes: `auth.login(email, password, remember)` — third param boolean
- Produces: `LoginPage.render()` — renders the new UI

- [ ] **Step 1: Replace the entire LoginPage.js**

```javascript
// neoviet360/pages/LoginPage.js
const LoginPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden select-none animate__animated animate__fadeIn">
        <div class="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
        <div class="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-status-highlight/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-duration: 8s;"></div>
        <div class="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-status-premium/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-duration: 10s;"></div>

        <div class="w-full max-w-md bg-[#0C1728]/70 backdrop-blur-[20px] border border-[#00F5FF]/10 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10 transition-all hover:border-[#00F5FF]/20 duration-500">
          
          <div class="text-center mb-8">
            <div class="inline-flex p-3.5 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/20 mb-4 shadow-[0_0_25px_rgba(0,230,118,0.12)] animate__animated animate__zoomIn">
              <i data-lucide="shield-check" class="w-6 h-6 text-status-highlight"></i>
            </div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Đăng nhập NeoViet 360</h1>
            <p class="text-ai-muted text-sm mt-1.5 leading-relaxed max-w-xs mx-auto">Quản lý tài chính, thanh toán và ưu đãi của bạn trong một nơi.</p>
          </div>

          <div id="login-form-container">
            <form id="spa-login-form" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-ai-muted mb-1.5">Email</label>
                <div class="relative">
                  <i data-lucide="mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ai-muted"></i>
                  <input type="email" id="login-username" value="admin@neoviet360.vn" required autocomplete="email"
                         class="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)] text-[14px]">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-ai-muted mb-1.5">Mật khẩu</label>
                <div class="relative">
                  <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ai-muted"></i>
                  <input type="password" id="login-password" value="password123" required autocomplete="current-password"
                         class="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)] text-[14px]">
                </div>
              </div>

              <div class="flex items-center justify-between text-[13px] pt-1">
                <label class="flex items-center gap-2 text-ai-muted cursor-pointer select-none transition-colors hover:text-white/80">
                  <input type="checkbox" id="login-remember" class="rounded bg-black/50 border-white/10 text-status-highlight focus:ring-0 accent-status-highlight cursor-pointer">
                  <span>Ghi nhớ đăng nhập trong 15 phút</span>
                </label>
                <a href="#" id="btn-recover-key" class="text-status-highlight hover:text-white transition-colors text-[13px] font-medium">Quên mật khẩu?</a>
              </div>

              <button type="submit" id="btn-submit-login" 
                      class="relative w-full overflow-hidden rounded-xl border-0 py-3.5 font-bold text-[14px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-2 group
                             bg-gradient-to-r from-[#00E676]/90 to-[#00C4F4]/80 text-white
                             shadow-[0_0_20px_rgba(0,230,118,0.15)] hover:shadow-[0_0_30px_rgba(0,230,118,0.3)]
                             hover:from-[#00E676]/100 hover:to-[#00C4F4]/90 active:scale-[0.98]">
                <i data-lucide="log-in" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i> 
                Đăng nhập
              </button>
            </form>

            <div class="mt-8 pt-6 border-t border-white/10">
              <p class="text-center text-ai-muted text-[13px] mb-3">Bạn mới sử dụng NeoViet?</p>
              <button type="button" id="btn-open-register"
                      class="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-semibold text-[13px] tracking-wide transition-all
                             flex items-center justify-center gap-2 group">
                <i data-lucide="user-plus" class="w-4 h-4 group-hover:scale-110 transition-transform text-status-premium"></i> 
                Tạo tài khoản
              </button>
            </div>
          </div>

          <div id="register-form-container" class="hidden space-y-4">
            <button type="button" id="btn-back-login" class="text-ai-muted hover:text-white transition-colors flex items-center gap-2 text-[13px] mb-4">
              <i data-lucide="arrow-left" class="w-4 h-4"></i> Quay lại đăng nhập
            </button>
            <form id="register-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-ai-muted mb-1.5">Họ và tên</label>
                <input type="text" id="register-name" class="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)]" placeholder="Ví dụ: Nguyễn Văn A" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-ai-muted mb-1.5">Email</label>
                <input type="email" id="register-email" class="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)]" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-ai-muted mb-1.5">Mật khẩu</label>
                <input type="password" id="register-password" class="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)]" placeholder="Từ 6 ký tự trở lên" required>
              </div>
              <button type="submit" id="btn-submit-register"
                      class="w-full bg-gradient-to-r from-status-premium/90 to-[#A855F7]/80 text-white border-0 py-3 rounded-xl font-semibold text-[13px] tracking-wide transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:from-status-premium hover:to-[#A855F7] flex items-center justify-center gap-2 mt-4 group active:scale-[0.98]">
                <i data-lucide="check-circle" class="w-4 h-4 group-hover:scale-110 transition-transform"></i> ĐĂNG KÝ & ĐỊNH DANH eKYC
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    LoginPage.bindEvents();
  },

  bindEvents: () => {
    // Handle login form submission
    document.getElementById('spa-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;
      
      try {
        const btnSubmit = document.getElementById('btn-submit-login');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Đang đăng nhập...';
        lucide.createIcons();
        
        const user = await auth.login(email, password, remember);

        // Khởi tạo dữ liệu state sau đăng nhập (giống luồng reload)
        if (window.state && typeof state.initData === 'function') {
          await state.initData();
        }

        // Navigate to dashboard after successful login
        if (window.router) {
          router.navigate('dashboard');
        }
        
      } catch (error) {
        console.error('Login error:', error);
        const message = error.message || 'Lỗi đăng nhập. Vui lòng kiểm tra thông tin.';
        
        if (window.Toast) {
          Toast.error(message);
        } else {
          alert(message);
        }
        
        const btnSubmit = document.getElementById('btn-submit-login');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i> Đăng nhập';
        lucide.createIcons();
      }
    });

    // Handle recover key button
    document.getElementById('btn-recover-key').addEventListener('click', (e) => {
       e.preventDefault();
       Modal.open(`
         <div class="p-8 text-center border-b border-white/5 relative">
           <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
             <i data-lucide="x" class="w-5 h-5"></i>
           </button>
           <div class="w-20 h-20 rounded-full bg-status-highlight/20 border-2 border-status-highlight/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,230,118,0.2)]">
             <i data-lucide="key" class="w-10 h-10 text-status-highlight"></i>
           </div>
          <h3 class="text-white text-xl font-bold mb-2">Quên mật khẩu</h3>
          <p class="text-[14px] text-ai-muted leading-relaxed">Tính năng đặt lại mật khẩu đang được hoàn thiện. Vui lòng quay lại sau hoặc liên hệ hỗ trợ NeoViet.</p>
        </div>
        <div class="p-6 bg-white/5">
          <button onclick="Modal.close()" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold transition-all">
            ĐÃ HIỂU
          </button>
        </div>
      `);
      lucide.createIcons();
    });

    document.getElementById('btn-open-register').addEventListener('click', () => {
      document.getElementById('login-form-container').classList.add('hidden');
      document.getElementById('register-form-container').classList.remove('hidden');
    });

    document.getElementById('btn-back-login').addEventListener('click', () => {
      document.getElementById('register-form-container').classList.add('hidden');
      document.getElementById('login-form-container').classList.remove('hidden');
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-register');
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG KHỞI TẠO...`;
      btn.disabled = true;
      lucide.createIcons();
      
      await mockDelay(1500);
      
      // Đăng ký demo thành công -> tự gán thông tin user mock và vào app
      try {
        const response = await fetch('./data/user.json');
        const user = await response.json();
        // Registration uses sessionStorage (no remember) by default
        const storage = window.auth._storage('session');
        storage.setItem('neoviet_token', 'demo-registration-token');
        storage.setItem('neoviet_user', JSON.stringify(user));
        storage.setItem('neoviet_session_expires_at', String(Date.now() + 15 * 60 * 1000));
        if (window.state) window.state.user = user;
        
        if (window.state && typeof state.initData === 'function') {
          await state.initData();
        }
        
        window.location.hash = '#/dashboard';
        router.navigate('dashboard');
      } catch (error) {
        console.error('Lỗi đăng ký:', error);
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> ĐĂNG KÝ & ĐỊNH DANH eKYC`;
        lucide.createIcons();
      }
    });
  }
};

window.LoginPage = LoginPage;
```

- [ ] **Step 2: Verify the checkbox default is unchecked**

In the HTML: `<input type="checkbox" id="login-remember" ...>`. No `checked` attribute → defaults to unchecked.

- [ ] **Step 3: Commit**

```bash
git add pages/LoginPage.js
git commit -m "feat: redesign login page — refined copy and visuals

- Rewrite all copy to natural Vietnamese (remove AI-sounding terms)
- Gradient login button (emerald→cyan), softer glow
- Icon swapped: sparkles→shield-check, terminal→mail
- Labels use font-medium sans-serif instead of mono uppercase
- Checkbox 'Ghi nhớ đăng nhập trong 15 phút' unchecked by default
- Proper autocomplete attributes
- Submit button is 'Đăng nhập', register is 'Tạo tài khoản'
- Register form uses sessionStorage (no remember)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---
### Verify

- [ ] **Step: Open `index.html` in a browser**
  - Login page shows new copy: "Đăng nhập NeoViet 360", "Email", "Mật khẩu", gradient button
  - Checkbox "Ghi nhớ đăng nhập trong 15 phút" is unchecked by default
  - Demo values pre-filled: `admin@neoviet360.vn` / `password123`
  - Login works → navigates to dashboard
  - close tab, reopen → sessionStorage cleared → back at login page
  - Login again with checkbox checked → close tab, reopen within 15 min → lands on dashboard
  - Wait 15+ min (or manually clear `neoviet_session_expires_at` and reload) → back at login
  - "Quên mật khẩu?" opens modal with new text
