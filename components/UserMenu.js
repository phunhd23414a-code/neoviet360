// neoviet360/components/UserMenu.js
const UserMenu = {
  render: () => {
    // 1. Sửa object dự phòng thành 'tier' thay vì 'type'
    const user = window.auth?.getUser() || { fullName: 'Tài khoản khách', tier: 'Chưa xác thực' };
    
    // 2. Tự động tạo Avatar xịn xò từ tên người dùng nếu avatar lỗi hoặc trống
    let avatarUrl;
    if (user.avatar) {
      avatarUrl = user.avatar; // Hỗ trợ cả URL và đường dẫn local
    } else {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=00BCD4&color=fff&size=128&bold=true`;
    }

    return `
      <div class="relative" id="user-menu-wrapper">
        <div class="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group select-none" onclick="UserMenu.toggle(event)">
          <div class="hidden sm:block text-right">
            <div class="text-[13px] font-semibold text-white group-hover:text-status-highlight transition-colors">${user.fullName}</div>
            <div class="text-[11px] text-status-premium font-medium mt-0.5 flex items-center justify-end gap-1">
              <i data-lucide="crown" class="w-3 h-3"></i> ${user.tier}
            </div>
          </div>
          <div class="relative">
            <img src="${avatarUrl}" class="w-9 h-9 rounded-full border border-white/20 group-hover:border-status-highlight transition-colors object-cover shadow-[0_0_15px_rgba(0,255,255,0.1)]">
            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success border-2 border-[#0A1428] rounded-full"></div>
          </div>
        </div>

        <div id="user-dropdown" class="absolute right-0 top-[calc(100%+16px)] w-64 bg-[#0A1428]/95 backdrop-blur-[20px] border border-[#00FFFF]/10 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] transform opacity-0 scale-95 pointer-events-none transition-all duration-200 z-[100] overflow-hidden">
          
          <div class="p-4 border-b border-white/5 bg-white/5">
            <div class="font-bold text-white text-[14px] truncate">${user.fullName}</div>
            <div class="text-[12px] text-status-premium mt-1 flex items-center gap-1.5">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ${user.tier}
            </div>
          </div>

          <div class="p-2 border-b border-white/5">
            <a href="#" onclick="UserMenu.close(); router.navigate('profile'); return false;" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ai-muted hover:text-white hover:bg-[#00FFFF]/10 transition-colors group">
              <i data-lucide="user" class="w-4 h-4 group-hover:text-status-highlight transition-colors"></i>
              <span class="text-[13px] font-medium">Hồ sơ cá nhân</span>
            </a>
            <a href="#" onclick="UserMenu.close(); router.navigate('settings'); return false;" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ai-muted hover:text-white hover:bg-[#00FFFF]/10 transition-colors group">
              <i data-lucide="settings" class="w-4 h-4 group-hover:text-status-highlight transition-colors"></i>
              <span class="text-[13px] font-medium">Cài đặt tài khoản</span>
            </a>
            <a href="#" onclick="UserMenu.close(); router.navigate('security'); return false;" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ai-muted hover:text-white hover:bg-[#00FFFF]/10 transition-colors group">
              <i data-lucide="lock" class="w-4 h-4 group-hover:text-status-highlight transition-colors"></i>
              <span class="text-[13px] font-medium">Bảo mật</span>
            </a>
          </div>

          <div class="p-2">
            <button onclick="UserMenu.close(); window.auth.logout();" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#FF5F56] opacity-90 hover:opacity-100 hover:bg-[#FF5F56]/10 hover:text-[#FF7676] transition-all group">
              <i data-lucide="log-out" class="w-4 h-4 group-hover:scale-110 transition-transform"></i>
              <span class="text-[13px] font-semibold">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  toggle: (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;
    const isClosed = dropdown.classList.contains('opacity-0');
    
    if (isClosed) {
      dropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    } else {
      UserMenu.close();
    }
  },

  close: () => {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown && !dropdown.classList.contains('opacity-0')) {
      dropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    }
  },

  initGlobalListener: () => {
    document.addEventListener('click', (e) => {
      const container = document.getElementById('user-menu-wrapper');
      if (container && !container.contains(e.target)) {
        UserMenu.close();
      }
    });
  }
};

window.UserMenu = UserMenu;
