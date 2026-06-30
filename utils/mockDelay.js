// Hàm helper sử dụng Promise để mô phỏng loading ngắn.
// Giới hạn độ trễ để các thao tác demo không tạo cảm giác web bị lag/chậm phản hồi.
const mockDelay = (ms = CONFIG.MOCK_DELAY_MS) => {
  const fastMode = localStorage.getItem('neoviet_perf_mode') !== 'slow';

  // Performance mode mặc định: không tạo độ trễ giả lập.
  // Các await mockDelay(800/1200/1500/2000) trước đây chính là nguyên nhân làm bấm chức năng bị chậm ~1s.
  const delay = fastMode ? 0 : ms;

  return new Promise(resolve => setTimeout(resolve, delay));
};

window.mockDelay = mockDelay;
