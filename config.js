// neoviet360/config.js
const CONFIG = {
  // Backend API configuration
  API_BASE: 'http://localhost:3001', // Change to your backend URL when deploying
  
  // Environment variables exposed to frontend
  ENV: {
    API_URL: 'http://localhost:3001' // Used by utils/api-adapter.js
  },
  
  STORAGE_KEYS: {
    USER: 'neoviet_user',
    TRANSACTIONS: 'neoviet_transactions',
    BUDGETS: 'neoviet_budgets',
    NOTIFICATIONS: 'neoviet_notifications'
  },
  GEMINI_API_KEY: "", // Dán key từ aistudio.google.com vào đây
  GEMINI_MODEL: "gemini-2.0-flash",
  MOCK_DELAY_MS: 0, // Giảm độ trễ mạng để UI phản hồi nhanh và mượt mà hơn
  APP_NAME: "NeoViet 360",
  DEFAULT_CURRENCY: "VND"
};

// Set window.ENV for api-adapter.js compatibility
window.ENV = CONFIG.ENV;
window.CONFIG = CONFIG;
