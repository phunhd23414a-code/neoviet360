// Nơi lưu trữ data in-memory của toàn bộ app
const state = {
  user: null, // Thông tin user đang login
  accounts: [], // Dữ liệu tài khoản
  transactions: [], // Lịch sử giao dịch
  fxRates: {}, 
  cryptoPrices: [],
  notifications: [],
  chatHistory: [], // Lưu lịch sử chat Gemini
  savings: [],
  goals: [],
  currentPage: 'login',
  isLoading: false,
  theme: 'light'
};