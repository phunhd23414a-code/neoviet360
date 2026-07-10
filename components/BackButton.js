// neoviet360/components/BackButton.js
// Nút Back dùng chung cho mọi trang — quay lại trang trước đó trong lịch sử

const BackButton = {
  /**
   * Render nút back chuẩn
   * @param {string} fallback - Trang sẽ về nếu không có lịch sử (mặc định dashboard)
   * @param {object} opts - Tùy chỉnh
   *   - label: text bên cạnh (mặc định rỗng)
   *   - class: class bổ sung
   */
  render(fallback = 'dashboard', opts = {}) {
    return `
      <button onclick="if(!router.back()) router.navigate('${fallback}')"
        class="back-btn p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center shrink-0 ${opts.class || ''}"
        aria-label="Quay lại">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        ${opts.label ? `<span class="ml-1.5 text-sm font-medium hidden sm:inline">${opts.label}</span>` : ''}
      </button>
    `;
  },

  /**
   * Render nút back + title đồng bộ — pattern dùng nhiều nhất
   */
  renderWithTitle(title, fallback = 'dashboard') {
    return `
      <div class="flex items-center gap-3">
        ${this.render(fallback)}
        <h2 class="text-xl font-bold text-white tracking-wide">${title}</h2>
      </div>
    `;
  }
};

window.BackButton = BackButton;
