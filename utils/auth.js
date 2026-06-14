// neoviet360/utils/auth.js
const auth = {
  isLoggedIn: () => {
    return localStorage.getItem('nv360_session') !== null;
  },
  
  login: async (email, password) => {
    // Demo: Chấp nhận email có '@' và pass >= 6 ký tự
    if (!email.includes('@') || password.length < 6) {
      throw new Error("Email không hợp lệ hoặc mật khẩu chưa đủ 6 ký tự");
    }
    
    await mockDelay(1200); // Giả lập độ trễ kết nối mạng
    
    // Đọc thông tin từ file mock
    const user = await api.fetchJSON('./data/user.json');
    if (!user) throw new Error("Không thể tải hệ thống dữ liệu mock");
    
    // Lưu phiên đăng nhập
    localStorage.setItem('nv360_session', JSON.stringify(user));
    state.user = user;
    return user;
  },
  
  logout: () => {
    localStorage.removeItem('nv360_session');
    state.user = null;
    router.navigate('login');
  },
  
  getUser: () => {
    if (state.user) return state.user;
    const session = localStorage.getItem('nv360_session');
    if (session) {
      state.user = JSON.parse(session);
      return state.user;
    }
    return null;
  }
};