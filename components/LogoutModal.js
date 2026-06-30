// neoviet360/components/LogoutModal.js
const LogoutModal = {
  render: () => {
    // Chỉ tạo HTML nếu chưa tồn tại trong DOM
    if (!document.getElementById('logout-modal')) {
      const modalHtml = `
        <div id="logout-modal" class="fixed inset-0 z-[200] hidden items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onclick="LogoutModal.close()"></div>
          
          <div id="logout-modal-content" class="relative bg-[#0A1428]/95 backdrop-blur-[20px] border border-[#00FFFF]/10 rounded-2xl p-6 sm:p-8 w-[90%] max-w-sm shadow-[0_0_40px_rgba(0,255,255,0.05)] transform scale-95 opacity-0 transition-all duration-300">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-status-alert/10 border border-status-alert/30 flex items-center justify-center shrink-0">
                <i data-lucide="log-out" class="w-6 h-6 text-status-alert"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Đăng xuất khỏi NeoViet AI?</h3>
            </div>
            
            <p class="text-ai-muted text-[13px] leading-relaxed mb-8">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?</p>
            
            <div class="flex items-center gap-4">
              <button onclick="LogoutModal.close()" class="flex-1 py-3 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                Huỷ
              </button>
              <button id="btn-confirm-logout" onclick="LogoutModal.confirm()" class="flex-1 py-3 rounded-xl font-semibold text-status-alert bg-status-alert/10 hover:bg-status-alert/20 border border-status-alert/30 shadow-[0_0_15px_rgba(255,95,86,0.15)] hover:shadow-[0_0_25px_rgba(255,95,86,0.3)] transition-all flex items-center justify-center gap-2">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      lucide.createIcons();
    }
  },

  open: () => {
    LogoutModal.render(); // Đảm bảo modal đã được nhúng
    const modal = document.getElementById('logout-modal');
    const content = document.getElementById('logout-modal-content');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Kích hoạt animation bằng cách ép trình duyệt render lại (reflow)
    void modal.offsetWidth; 
    
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  },

  close: () => {
    const modal = document.getElementById('logout-modal');
    const content = document.getElementById('logout-modal-content');
    
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300); // Đợi animation chạy xong
  },

  confirm: () => {
    const btn = document.getElementById('btn-confirm-logout');
    btn.disabled = true;
    btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> Signing out...`;
    lucide.createIcons();

    // Giả lập hiệu ứng đóng phiên kết nối (600ms)
    setTimeout(() => {
      auth.logout(); // Xóa sạch currentUser và sessionStorage
      
      // Đóng modal trước khi chuyển trang
      LogoutModal.close();
      
      // Định tuyến SPA nội bộ về màn hình Login cũ, không reload trang vật lý
      router.navigate('login');
    }, 600);
  }
};