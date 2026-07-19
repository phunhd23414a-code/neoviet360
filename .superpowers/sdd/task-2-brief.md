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
