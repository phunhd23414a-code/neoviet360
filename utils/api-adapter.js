// API Adapter - Kết nối UI với Backend NeoViet 360
// Thay thế tất cả fetch('./data/xxx.json') bằng gọi API thực

// Determine API base URL based on environment
function getApiBase() {
  // 1. Check window.ENV (set by config.js)
  if (typeof window !== 'undefined' && window.ENV?.API_URL) {
    return window.ENV.API_URL;
  }
  
  // 2. Check window.API_URL (direct config)
  if (typeof window !== 'undefined' && window.API_URL) {
    return window.API_URL;
  }
  
  // 3. Check meta tag for API URL
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="api-url"]');
    if (meta) return meta.content;
  }
  
  // 4. Default to localhost for development
  return 'http://localhost:3001';
}

const API_BASE = getApiBase();

class APIAdapter {
  constructor() {
    this.token = localStorage.getItem('neoviet_token');
    this.user = JSON.parse(localStorage.getItem('neoviet_user') || 'null');
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('neoviet_token', token);
    localStorage.setItem('neoviet_user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('neoviet_token');
    localStorage.removeItem('neoviet_user');
  }

  async fetchJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to fetch ${path}`);
      return await response.json();
    } catch (error) {
      console.error(`fetchJSON Error [${path}]:`, error);
      return null;
    }
  }

  clearPersistedJSON(path) {
    console.log(`Mock: Clearing persisted data at ${path}`);
    // In a real browser environment, we can't delete files from the server.
    // This is kept for compatibility with legacy mock calls.
  }

  async request(method, endpoint, data = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (response.status === 401) {
        this.clearAuth();
        window.location.href = '/index.html?page=login';
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth APIs
  auth = {
    register: (email, password, name) =>
      this.request('POST', '/api/auth/register', { email, password, name }),

    login: (email, password) =>
      this.request('POST', '/api/auth/login', { email, password }),

    getMe: () => this.request('GET', '/api/auth/me'),

    logout: () => {
      this.clearAuth();
      return Promise.resolve();
    },

    googleLogin: (code) =>
      this.request('POST', '/api/auth/google', { code }),

    zaloLogin: (code) =>
      this.request('POST', '/api/auth/zalo', { code }),
  };

  // Accounts APIs
  accounts = {
    list: () => this.request('GET', '/api/accounts'),

    get: (id) => this.request('GET', `/api/accounts/${id}`),

    create: (data) => this.request('POST', '/api/accounts', data),

    update: (id, data) => this.request('PUT', `/api/accounts/${id}`, data),
  };

  // Transactions APIs
  transactions = {
    list: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return this.request('GET', `/api/transactions${query ? '?' + query : ''}`);
    },

    get: (id) => this.request('GET', `/api/transactions/${id}`),
  };

  // Transfer API
  transfer = {
    execute: (data) => this.request('POST', '/api/transfer', data),
  };

  // Topup APIs
  topup = {
    list: () => this.request('GET', '/api/payment/topups'),
    
    create: (data) => this.request('POST', '/api/payment/topups', data),
  };

  // E-wallet APIs
  ewallet = {
    list: () => this.request('GET', '/api/payment/ewallet'),
    
    create: (data) => this.request('POST', '/api/payment/ewallet', data),
  };

  // QR Pay APIs
  qrpay = {
    list: () => this.request('GET', '/api/payment/qrpay'),
    
    create: (data) => this.request('POST', '/api/payment/qrpay', data),
  };

  // Scheduled Payments APIs
  scheduled = {
    list: () => this.request('GET', '/api/payment/scheduled'),
    
    get: (id) => this.request('GET', `/api/payment/scheduled/${id}`),
    
    create: (data) => this.request('POST', '/api/payment/scheduled', data),
    
    update: (id, data) => this.request('PUT', `/api/payment/scheduled/${id}`, data),
    
    delete: (id) => this.request('DELETE', `/api/payment/scheduled/${id}`),
    
    toggle: (id) => this.request('PATCH', `/api/payment/scheduled/${id}/toggle`),
  };

  // Budgets APIs
  budgets = {
    list: () => this.request('GET', '/api/budgets'),

    get: (id) => this.request('GET', `/api/budgets/${id}`),

    create: (data) => this.request('POST', '/api/budgets', data),

    update: (id, data) => this.request('PUT', `/api/budgets/${id}`, data),

    delete: (id) => this.request('DELETE', `/api/budgets/${id}`),
  };

  // Savings Goals APIs
  savings = {
    list: () => this.request('GET', '/api/savings'),

    get: (id) => this.request('GET', `/api/savings/${id}`),

    create: (data) => this.request('POST', '/api/savings', data),

    update: (id, data) => this.request('PUT', `/api/savings/${id}`, data),

    delete: (id) => this.request('DELETE', `/api/savings/${id}`),
  };

  // Loans APIs
  loans = {
    list: () => this.request('GET', '/api/loans'),

    get: (id) => this.request('GET', `/api/loans/${id}`),

    create: (data) => this.request('POST', '/api/loans', data),

    update: (id, data) => this.request('PUT', `/api/loans/${id}`, data),

    delete: (id) => this.request('DELETE', `/api/loans/${id}`),
  };

  // Cards APIs
  cards = {
    list: () => this.request('GET', '/api/cards'),

    get: (id) => this.request('GET', `/api/cards/${id}`),

    create: (data) => this.request('POST', '/api/cards', data),

    update: (id, data) => this.request('PUT', `/api/cards/${id}`, data),

    freeze: (id) => this.request('PATCH', `/api/cards/${id}/freeze`),

    unfreeze: (id) => this.request('PATCH', `/api/cards/${id}/unfreeze`),
  };

  // Bills APIs
  bills = {
    list: () => this.request('GET', '/api/bills'),

    get: (id) => this.request('GET', `/api/bills/${id}`),

    create: (data) => this.request('POST', '/api/bills', data),

    update: (id, data) => this.request('PUT', `/api/bills/${id}`, data),

    pay: (id, data) => this.request('POST', `/api/bills/${id}/pay`, data),
  };

  // Split Bills APIs
  splitBills = {
    list: () => this.request('GET', '/api/split-bills'),

    get: (id) => this.request('GET', `/api/split-bills/${id}`),

    create: (data) => this.request('POST', '/api/split-bills', data),

    settle: (id, data) => this.request('POST', `/api/split-bills/${id}/settle`, data),
  };

  // Rewards APIs
  rewards = {
    list: () => this.request('GET', '/api/rewards'),

    getBalance: () => this.request('GET', '/api/rewards/balance'),
  };

  // Notifications APIs
  notifications = {
    list: () => this.request('GET', '/api/notifications'),

    markAsRead: (id) => this.request('PATCH', `/api/notifications/${id}/read`),

    markAllAsRead: () => this.request('POST', '/api/notifications/read-all'),
  };

  // External APIs
  external = {
    getFxRates: () => this.request('GET', '/api/fx-rates'),

    getCryptoPrices: () => this.request('GET', '/api/crypto'),

    chat: (message) => this.request('POST', '/api/chat', { message }),

    getCarbonTracks: () => this.request('GET', '/api/carbon'),

    addCarbonTrack: (data) => this.request('POST', '/api/carbon', data),
  };
}

const api = new APIAdapter();

// Export cho dùng trong các file khác
if (typeof window !== 'undefined') {
  window.api = api;
}

// Export cho dùng với modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}