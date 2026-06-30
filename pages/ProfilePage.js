// neoviet360/pages/ProfilePage.js
const ProfilePage = {
  render: (container) => {
    // Lấy thông tin user hiện tại từ local storage
    const user = window.auth?.getUser() || {};
    const avatarUrl = (user.avatar && user.avatar.startsWith('http')) 
                      ? user.avatar 
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=00BCD4&color=fff&size=128&bold=true`;

    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center gap-3 mb-8">
          <h2 class="text-xl font-bold text-white tracking-wide">Hồ sơ cá nhân</h2>
        </div>

         <div class="layer-primary rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-6">
           <div class="relative">
             <img src="${avatarUrl}" alt="Avatar của ${user.fullName || 'User'}" class="w-24 h-24 rounded-full border-2 border-status-highlight object-cover shadow-[0_0_20px_rgba(0,245,255,0.2)]">
             <button class="absolute bottom-0 right-0 w-8 h-8 bg-ai-surface border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-lg" aria-label="Thay đổi ảnh đại diện">
               <i data-lucide="camera" class="w-4 h-4" aria-hidden="true"></i>
             </button>
           </div>
          <div class="text-center md:text-left flex-1">
            <h3 class="text-2xl font-bold text-white mb-1">${user.fullName || 'Khách hàng NeoViet'}</h3>
            <div class="text-ai-muted text-[14px] mb-3">${user.email || 'Chưa cập nhật email'} • ${user.phone || 'Chưa cập nhật SĐT'}</div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-premium/20 border border-status-premium/30 text-status-premium text-[12px] font-bold">
              <i data-lucide="crown" class="w-3.5 h-3.5"></i> ${user.tier || 'Thành viên'}
            </div>
          </div>
          <div onclick="router.navigate('rewards')" class="text-center bg-ai-surface border border-white/5 rounded-2xl p-4 min-w-[120px] mt-4 md:mt-0 shadow-inner cursor-pointer hover:bg-white/5 transition-colors group" role="button" tabindex="0" aria-label="Xem phần thưởng NeoPoints">
            <div class="text-[11px] text-ai-muted uppercase tracking-widest mb-1 group-hover:text-status-highlight transition-colors">NeoPoints</div>
            <div class="text-xl font-bold text-status-highlight">${user.neoPoints ? user.neoPoints.toLocaleString() : 0}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="layer-secondary rounded-3xl p-6">
            <h4 class="text-white font-semibold mb-4 text-[15px]">Cài đặt chung</h4>
            <div class="space-y-2">
               <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onclick="router.navigate('settings')" role="button" tabindex="0" aria-label="Chọn ngôn ngữ">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><i data-lucide="globe" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i></div>
                   <span class="text-[14px] text-white">Ngôn ngữ</span>
                 </div>
                 <span class="text-[13px] text-ai-muted">Tiếng Việt <i data-lucide="chevron-right" class="w-4 h-4 inline" aria-hidden="true"></i></span>
               </div>
               <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onclick="ProfilePage.toggleTheme(this)" role="switch" tabindex="0" aria-label="Thay đổi giao diện sáng tối">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><i data-lucide="moon-star" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i></div>
                   <span class="text-[14px] text-white">Giao diện sáng / tối</span>
                 </div>
                 <div class="w-10 h-6 bg-white/10 rounded-full relative transition-colors duration-300 theme-track" aria-hidden="true">
                   <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 transform theme-knob ${document.documentElement.classList.contains('light-mode') ? 'right-1' : 'left-1'}"></div>
                 </div>
               </div>
               <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onclick="router.navigate('settings')" role="button" tabindex="0" aria-label="Quản lý thông báo">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><i data-lucide="bell" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i></div>
                   <span class="text-[14px] text-white">Quản lý Thông báo</span>
                 </div>
                 <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i>
               </div>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-6">
            <h4 class="text-white font-semibold mb-4 text-[15px]">Bảo mật</h4>
            <div class="space-y-2">
               <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onclick="router.navigate('security')" role="button" tabindex="0" aria-label="Đổi mật khẩu hoặc mã PIN">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><i data-lucide="shield" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i></div>
                   <span class="text-[14px] text-white">Đổi mật khẩu / Mã PIN</span>
                 </div>
                 <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i>
               </div>
               
               <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onclick="ProfilePage.toggleSwitch(this)" role="switch" tabindex="0" aria-label="Bật tắt đăng nhập sinh trắc học">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><i data-lucide="fingerprint" class="w-4 h-4 text-status-success" aria-hidden="true"></i></div>
                   <span class="text-[14px] text-white">Đăng nhập sinh trắc học</span>
                 </div>
                 <div class="w-10 h-6 bg-status-success rounded-full relative transition-colors duration-300 track" aria-hidden="true">
                   <div class="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform duration-300 transform knob"></div>
                 </div>
               </div>

               <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onclick="router.navigate('security')" role="button" tabindex="0" aria-label="Quản lý thiết bị đăng nhập">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><i data-lucide="smartphone" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i></div>
                   <span class="text-[14px] text-white">Quản lý thiết bị</span>
                 </div>
                 <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i>
               </div>
            </div>
          </div>
          
        </div>

         <div class="mt-8 flex justify-center">
           <button onclick="window.auth.logout()" class="layer-tertiary border border-[#FF5F56]/20 px-8 py-3 rounded-xl text-[#FF5F56] font-semibold flex items-center gap-2 hover:bg-[#FF5F56]/10 transition-colors" aria-label="Đăng xuất khỏi tài khoản">
             <i data-lucide="log-out" class="w-4 h-4" aria-hidden="true"></i> Đăng xuất an toàn
           </button>
         </div>
      </div>
    `;
    lucide.createIcons();
  },

  // Logic tạo hiệu ứng bật/tắt cho nút gạt Sinh trắc học
  toggleSwitch: (el) => {
    const track = el.querySelector('.track');
    const knob = el.querySelector('.knob');
    const isOff = track.classList.contains('bg-white/10');
    
    if (isOff) {
      track.classList.replace('bg-white/10', 'bg-status-success');
      knob.classList.remove('left-1');
      knob.classList.add('right-1');
    } else {
      track.classList.replace('bg-status-success', 'bg-white/10');
      knob.classList.remove('right-1');
      knob.classList.add('left-1');
    }
  },

  // Logic chuyển đổi giao diện Sáng/Tối
  toggleTheme: (el) => {
    const track = el.querySelector('.theme-track');
    const knob = el.querySelector('.theme-knob');
    const isLight = document.documentElement.classList.toggle('light-mode');
    
    if (isLight) {
      localStorage.setItem('neoviet_theme', 'light');
      track.classList.replace('bg-white/10', 'bg-status-highlight');
      knob.classList.remove('left-1');
      knob.classList.add('right-1');
    } else {
      localStorage.setItem('neoviet_theme', 'dark');
      track.classList.replace('bg-status-highlight', 'bg-white/10');
      knob.classList.remove('right-1');
      knob.classList.add('left-1');
    }
  }
};

window.ProfilePage = ProfilePage;