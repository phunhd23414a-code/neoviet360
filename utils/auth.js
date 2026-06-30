// neoviet360/utils/auth.js

const auth = {
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
    const token = localStorage.getItem('neoviet_token');
    const userStr = localStorage.getItem('neoviet_user');
    const parsedUser = userStr ? this.normalizeUser(JSON.parse(userStr)) : null;

    if (token && parsedUser) {
      localStorage.setItem('neoviet_user', JSON.stringify(parsedUser));

      if (window.state) {
        window.state.user = parsedUser;
      }
    }

    return token ? parsedUser : null;
  },

  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      }

      const result = await window.api.auth.login(email, password);
      const normalizedUser = this.normalizeUser(result.user);
      
      // Store token and user info
      window.api.setAuth(result.token, normalizedUser);

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
    const userStr = localStorage.getItem('neoviet_user');
    return userStr ? this.normalizeUser(JSON.parse(userStr)) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem('neoviet_token');
  },

  logout() {
    localStorage.removeItem('neoviet_token');
    localStorage.removeItem('neoviet_user');
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
