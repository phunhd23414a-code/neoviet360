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
          try {
            const user = this.normalizeUser(JSON.parse(userStr));
            return { token, user, storage: type };
          } catch {
            // Malformed user data — clean up this storage
            this._clearAll(type);
            continue;
          }
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
      if (window.api) {
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
    if (window.api) {
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
