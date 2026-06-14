// Hàm helper sử dụng Promise để ép hệ thống "chờ" một khoảng thời gian
// Giúp UI hiển thị loading spinner giống app thật
const mockDelay = (ms = CONFIG.MOCK_DELAY_MS) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};