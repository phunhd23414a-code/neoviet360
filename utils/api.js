// neoviet360/utils/api.js
const api = {
  // Hàm fetch nội bộ đọc file JSON
  fetchJSON: async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi tải dữ liệu từ ${path}:`, error);
      return null;
    }
  }
};