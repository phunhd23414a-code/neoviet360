// neoviet360/profile/settings.js
const SettingsPage = {
  render: (container) => {
    const user = window.auth?.getUser() || {};
    
    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render('profile')}
          <h2 class="text-xl font-bold text-white tracking-wide">Cài đặt tài khoản</h2>
        </div>

        <div class="space-y-6">
          <div class="layer-secondary rounded-3xl p-6 md:p-8">
            <h3 class="text-white font-bold mb-6 text-[16px]">Thông tin liên hệ</h3>
            <form id="settings-contact-form" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Họ và tên</label>
                  <input id="settings-fullname" type="text" value="${user.fullName || ''}" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50 transition-colors">
                </div>
                <div>
                  <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Số điện thoại</label>
                  <input id="settings-phone" type="text" value="${user.phone || ''}" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50 transition-colors">
                </div>
              </div>
              <div>
                <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Email (Nhận thông báo, biên lai)</label>
                <input id="settings-email" type="email" value="${user.email || ''}" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50 transition-colors">
              </div>
              <div class="pt-2">
                <button id="settings-save-btn" type="submit" class="bg-status-highlight text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)]">Lưu thay đổi</button>
              </div>
            </form>
          </div>

          <div class="layer-primary rounded-3xl p-6 md:p-8">
            <h3 class="text-white font-bold mb-6 text-[16px]">Tùy chỉnh ứng dụng</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-4 bg-ai-surface border border-white/5 rounded-2xl">
                <div>
                  <div class="text-white font-medium text-[14px]">Ngôn ngữ / Language</div>
                  <div class="text-ai-muted text-[12px] mt-0.5">Tiếng Việt (Mặc định)</div>
                </div>
                <button id="btn-language" class="text-status-highlight text-[13px] font-medium hover:underline">Thay đổi</button>
              </div>
              <div class="flex items-center justify-between p-4 bg-ai-surface border border-white/5 rounded-2xl">
                <div>
                  <div class="text-white font-medium text-[14px]">Hạn mức chuyển tiền ngày</div>
                  <div class="text-ai-muted text-[12px] mt-0.5">Hiện tại: 500.000.000 VND</div>
                </div>
                <button id="btn-limit" class="text-status-highlight text-[13px] font-medium hover:underline">Điều chỉnh</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    SettingsPage.bindEvents();
  },

  bindEvents: () => {
    const contactForm = document.getElementById('settings-contact-form');
    const saveBtn = document.getElementById('settings-save-btn');

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      saveBtn.disabled = true;
      saveBtn.innerHTML = 'Đang lưu...';

      await mockDelay(700);

      const currentUser = window.auth?.getUser() || {};
      const updatedUser = {
        ...currentUser,
        fullName: document.getElementById('settings-fullname').value.trim(),
        phone: document.getElementById('settings-phone').value.trim(),
        email: document.getElementById('settings-email').value.trim()
      };

      localStorage.setItem('neoviet_user', JSON.stringify(updatedUser));

      Modal.open(`
        <div class="p-6 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 left-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="check" class="w-8 h-8 text-status-success"></i>
          </div>
          <h3 class="text-white text-lg font-bold mb-1">Đã lưu thay đổi</h3>
          <p class="text-[14px] text-ai-muted">Thông tin liên hệ của bạn đã được cập nhật trên thiết bị này.</p>
        </div>
        <div class="p-6 bg-white/5">
          <button onclick="Modal.close(); router.navigate('profile');" class="w-full bg-status-highlight text-black py-3 rounded-xl font-bold transition-all">
            XEM HỒ SƠ
          </button>
        </div>
      `);
      lucide.createIcons();

      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Lưu thay đổi';
    });

    document.getElementById('btn-language').addEventListener('click', () => {
      Modal.open(`
        <div class="p-6 border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <h3 class="text-white text-lg font-bold mb-2">Ngôn ngữ</h3>
          <p class="text-[14px] text-ai-muted mb-5">NeoViet 360 hiện đang tối ưu mặc định cho Tiếng Việt.</p>
          <div class="p-4 rounded-2xl bg-status-highlight/10 border border-status-highlight/30 flex items-center justify-between">
            <span class="text-white font-semibold">Tiếng Việt</span>
            <i data-lucide="check-circle" class="w-5 h-5 text-status-highlight"></i>
          </div>
        </div>
      `);
      lucide.createIcons();
    });

    document.getElementById('btn-limit').addEventListener('click', () => {
      Modal.open(`
        <div class="p-6 border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <h3 class="text-white text-lg font-bold mb-2">Hạn mức chuyển tiền ngày</h3>
          <p class="text-[14px] text-ai-muted mb-5">Yêu cầu tăng hạn mức sẽ được xét duyệt bằng eKYC nâng cao.</p>
          <div class="space-y-3">
            <button onclick="Modal.close()" class="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-white hover:border-status-highlight/40 transition-colors">500.000.000 VND / ngày <span class="text-status-success text-[12px] ml-2">Đang áp dụng</span></button>
            <button onclick="Modal.close(); router.navigate('ekyc')" class="w-full p-4 rounded-2xl bg-status-highlight/10 border border-status-highlight/30 text-left text-status-highlight font-bold">Nâng lên 1.000.000.000 VND / ngày</button>
          </div>
        </div>
      `);
      lucide.createIcons();
    });
  }
};

window.SettingsPage = SettingsPage;