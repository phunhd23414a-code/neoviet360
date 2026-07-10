// neoviet360/profile/security.js
const SecurityPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render('profile')}
          <h2 class="text-xl font-bold text-white tracking-wide">Bảo mật & Đăng nhập</h2>
        </div>

        <div class="space-y-6">
          <div class="layer-primary rounded-3xl p-6">
            <h3 class="text-white font-bold mb-4 text-[16px]">Bảo vệ tài khoản</h3>
            <div class="space-y-2">
              <div id="btn-change-password" class="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-ai-muted group-hover:text-status-highlight transition-colors"><i data-lucide="key" class="w-5 h-5"></i></div>
                  <div>
                    <div class="text-[14px] text-white font-medium">Đổi mật khẩu đăng nhập</div>
                    <div class="text-[12px] text-ai-muted mt-0.5">Cập nhật lần cuối 3 tháng trước</div>
                  </div>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-ai-muted"></i>
              </div>
              <div id="btn-change-pin" class="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-ai-muted group-hover:text-status-highlight transition-colors"><i data-lucide="grid" class="w-5 h-5"></i></div>
                  <div>
                    <div class="text-[14px] text-white font-medium">Đổi mã Smart OTP / PIN</div>
                    <div class="text-[12px] text-ai-muted mt-0.5">Dùng để xác thực giao dịch</div>
                  </div>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-ai-muted"></i>
              </div>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-6">
            <h3 class="text-white font-bold mb-4 text-[16px]">Thiết bị tin cậy</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-start p-4 bg-status-success/10 border border-status-success/20 rounded-2xl">
                <div class="flex gap-4">
                  <i data-lucide="monitor" class="w-6 h-6 text-status-success mt-1"></i>
                  <div>
                    <div class="text-[14px] text-white font-bold">Windows PC - Chrome</div>
                    <div class="text-[12px] text-status-success font-medium mt-1">Đang hoạt động (Thiết bị hiện tại)</div>
                    <div class="text-[11px] text-ai-muted mt-1">IP: 192.168.1.45 • TP.HCM, Việt Nam</div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-start p-4 bg-ai-surface border border-white/5 rounded-2xl">
                <div class="flex gap-4">
                  <i data-lucide="smartphone" class="w-6 h-6 text-ai-muted mt-1"></i>
                  <div>
                    <div class="text-[14px] text-white font-medium">iPhone 14 Pro Max</div>
                    <div class="text-[12px] text-ai-muted mt-1">Đăng nhập lần cuối: Hôm qua, 14:20</div>
                  </div>
                </div>
                 <button id="btn-logout-device" class="text-[12px] text-status-alert font-medium px-3 py-1.5 rounded-lg border border-status-alert/30 hover:bg-status-alert/10 transition-colors">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    SecurityPage.bindEvents();
  },

  bindEvents: () => {
    document.getElementById('btn-change-password').addEventListener('click', () => {
      Modal.open(`
        <div class="p-6 border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <h3 class="text-white text-lg font-bold mb-2">Đổi mật khẩu đăng nhập</h3>
          <p class="text-[14px] text-ai-muted mb-5">Thiết lập mật khẩu mạnh để bảo vệ tài khoản NeoViet 360.</p>
          <form id="change-password-form" class="space-y-4">
            <input type="password" required minlength="6" placeholder="Mật khẩu hiện tại" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50">
            <input type="password" required minlength="6" placeholder="Mật khẩu mới" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50">
            <button type="submit" class="w-full bg-status-highlight text-black py-3 rounded-xl font-bold transition-all">CẬP NHẬT MẬT KHẨU</button>
          </form>
        </div>
      `);
      lucide.createIcons();

      document.getElementById('change-password-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        await mockDelay(500);
        Modal.open(`
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="shield-check" class="w-8 h-8 text-status-success"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Mật khẩu đã được cập nhật</h3>
            <p class="text-[14px] text-ai-muted mb-5">Các phiên đăng nhập khác sẽ cần xác thực lại.</p>
            <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-bold transition-all">ĐÓNG</button>
          </div>
        `);
        lucide.createIcons();
      });
    });

    document.getElementById('btn-change-pin').addEventListener('click', () => {
      Modal.open(`
        <div class="p-6 border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <h3 class="text-white text-lg font-bold mb-2">Đổi Smart OTP / PIN</h3>
          <p class="text-[14px] text-ai-muted mb-5">Nhập mã PIN mới gồm 6 chữ số để xác thực giao dịch.</p>
          <form id="change-pin-form" class="space-y-4">
            <input type="password" required minlength="6" maxlength="6" inputmode="numeric" placeholder="PIN mới (6 số)" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50">
            <button type="submit" class="w-full bg-status-premium text-white py-3 rounded-xl font-bold transition-all">CẬP NHẬT PIN</button>
          </form>
        </div>
      `);
      lucide.createIcons();

      document.getElementById('change-pin-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        await mockDelay(500);
        Modal.open(`
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="check-circle" class="w-8 h-8 text-status-success"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">PIN đã được cập nhật</h3>
            <p class="text-[14px] text-ai-muted mb-5">Smart OTP/PIN mới sẽ được dùng cho các giao dịch tiếp theo.</p>
            <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-bold transition-all">ĐÓNG</button>
          </div>
        `);
        lucide.createIcons();
      });
    });

    document.getElementById('btn-logout-device').addEventListener('click', async (event) => {
      const btn = event.currentTarget;
      btn.disabled = true;
      btn.innerHTML = 'Đang xử lý...';

      await mockDelay(600);

      const deviceCard = btn.closest('.flex.justify-between.items-start');
      deviceCard.classList.add('opacity-50');
      btn.innerHTML = 'Đã đăng xuất';
      btn.classList.remove('text-status-alert', 'border-status-alert/30', 'hover:bg-status-alert/10');
      btn.classList.add('text-status-success', 'border-status-success/30');

      Modal.open(`
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="log-out" class="w-8 h-8 text-status-success"></i>
          </div>
          <h3 class="text-white text-lg font-bold mb-1">Đã đăng xuất thiết bị</h3>
          <p class="text-[14px] text-ai-muted mb-5">Phiên đăng nhập trên iPhone 14 Pro Max đã bị thu hồi.</p>
          <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-bold transition-all">ĐÓNG</button>
        </div>
      `);
      lucide.createIcons();
    });
  }
};

window.SecurityPage = SecurityPage;