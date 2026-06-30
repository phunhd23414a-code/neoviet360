// Nơi lưu trữ data in-memory của toàn bộ app
const state = {
  user: null, // Thông tin user đang login
  accounts: [], // Dữ liệu tài khoản
  transactions: [], // Lịch sử giao dịch
  fxRates: {}, 
  cryptoPrices: [],
  notifications: [],
  budgets: {}, // Dữ liệu ngân sách theo danh mục
  chatHistory: [], // Lưu lịch sử chat Gemini
  savings: [],
  goals: [],
  currentPage: 'login',
  isLoading: false,
  theme: 'light',

  // Hàm khởi tạo dữ liệu từ các file JSON mock
  async initData() {
    try {
      const [transactions, accounts, budgets] = await Promise.all([
        api.fetchJSON('./data/transactions.json'),
        api.fetchJSON('./data/accounts.json'),
        api.fetchJSON('./data/budgets.json')
      ]);

      this.transactions = transactions || [];
      this.accounts = accounts || [];
      this.budgets = budgets || {};
      
      console.log('State initialized with transactions:', this.transactions.length);
      
      // Load thêm data từ localStorage nếu có để ghi đè/cập nhật
      this.load();

      // Sau khi load xong data, render lại Header để cập nhật thông báo
      if (window.Header && typeof window.Header.renderNotifications === 'function') {
        window.Header.renderNotifications();
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo dữ liệu state:', error);
    }
  },

  // 1. Lưu state vào localStorage
  save() {
    try {
      const dataToSave = {
        accounts: this.accounts,
        transactions: this.transactions
      };
      localStorage.setItem('neoviet_state', JSON.stringify(dataToSave));
      console.log('State saved to localStorage');
    } catch (error) {
      console.error('Lỗi khi save state:', error);
    }
  },

  // 2. Load state từ localStorage
  load() {
    try {
      const savedData = localStorage.getItem('neoviet_state');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.accounts) this.accounts = parsedData.accounts;
        if (parsedData.transactions) this.transactions = parsedData.transactions;
        console.log('State loaded from localStorage');
      }
    } catch (error) {
      console.error('Lỗi khi load state:', error);
    }
  },

  // 3. Cập nhật số dư tài khoản và tự động save
  updateAccountBalance(accountId, newBalance) {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      account.balance = newBalance;
      this.save();
      return true;
    }
    return false;
  },

  // 4. Thêm giao dịch mới vào đầu danh sách và tự động save
  addTransaction(txObject) {
    if (!txObject) return;
    // Thêm vào đầu mảng
    this.transactions.unshift({
      id: Date.now().toString(), // Tạo ID tạm thời nếu chưa có
      date: new Date().toISOString(),
      ...txObject
    });
    this.save();
  }
};

window.state = state;
