// neoviet360/utils/api.js
// Legacy local JSON helpers. Keep these separate from the backend API adapter
// so this file cannot overwrite window.api.auth.login.
const mockApi = {
  storageKey: (path) => `neoviet360:${path.replace(/^\.?\//, '')}`,

  // Hàm fetch nội bộ đọc file JSON, ưu tiên dữ liệu đã được app cập nhật trong localStorage
  fetchJSON: async (path) => {
    try {
      const persisted = localStorage.getItem(mockApi.storageKey(path));
      if (persisted) return JSON.parse(persisted);

      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi tải dữ liệu từ ${path}:`, error);
      return null;
    }
  },

  // Lưu thay đổi mock data phía client để các giao dịch vẫn còn sau khi reload trang
  saveJSON: (path, data) => {
    try {
      localStorage.setItem(mockApi.storageKey(path), JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Lỗi khi lưu dữ liệu ${path}:`, error);
      return false;
    }
  },

  clearPersistedJSON: (path) => {
    localStorage.removeItem(mockApi.storageKey(path));
  },

  // Load budgets từ localStorage hoặc file
  loadBudgets: async () => {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.BUDGETS);
    if (stored) return JSON.parse(stored);
    
    const budgets = await mockApi.fetchJSON('./data/budgets.json') || {};
    if (Object.keys(budgets).length > 0) {
      mockApi.saveBudgets(budgets);
    }
    return budgets;
  },

  // Lưu budgets vào localStorage
  saveBudgets: (budgets) => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
      state.budgets = budgets;
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu budgets:', error);
      return false;
    }
  }
};

if (typeof window !== 'undefined') {
  window.mockApi = mockApi;

  if (window.api && window.api !== mockApi) {
    Object.assign(window.api, mockApi);
  } else if (!window.api) {
    window.api = mockApi;
  }
}
