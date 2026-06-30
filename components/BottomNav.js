// neoviet360/components/BottomNav.js
const BottomNav = {
  render: (container, currentRoute) => {
    if (!container) return;
    
    const navItems = [
      { id: 'dashboard', icon: 'home', label: 'Trang chủ' },
      { id: 'activity', icon: 'clock', label: 'Lịch sử' },
      { id: 'qr-pay', icon: 'qr-code', label: 'Quét QR', isCenter: true },
      { id: 'insights', icon: 'pie-chart', label: 'Phân tích' },
      { id: 'profile', icon: 'user', label: 'Cá nhân' } // Trang profile tương lai
    ];

    // Chỉ hiển thị trên thiết bị di động (md:hidden)
    container.innerHTML = `
      <div class="md:hidden fixed bottom-0 left-0 right-0 bg-ai-surface backdrop-blur-[24px] border-t border-ai-border z-[100] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div class="flex justify-between items-center px-4 h-[72px]">
          ${navItems.map(item => {
            const isActive = currentRoute === item.id;
            const colorClass = isActive ? 'text-status-highlight' : 'text-ai-muted';
            
            // Xử lý nút quét QR lồi lên ở giữa (Floating Action Button)
            if (item.isCenter) {
              return `
                <div class="flex-1 flex justify-center -mt-8 relative z-10">
                  <button onclick="router.navigate('${item.id}')" class="w-14 h-14 rounded-full bg-status-highlight flex items-center justify-center shadow-[0_0_20px_rgba(0,230,118,0.4)] border-[4px] border-ai-bg transition-transform active:scale-95">
                    <i data-lucide="${item.icon}" class="w-6 h-6 text-black"></i>
                  </button>
                </div>
              `;
            }

            // Các nút điều hướng thông thường
            return `
              <button onclick="router.navigate('${item.id}')" class="flex-1 flex flex-col items-center justify-center gap-1.5 ${colorClass} hover:text-status-highlight transition-colors">
                <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? 'fill-status-highlight/20' : ''}"></i>
                <span class="text-[10px] font-medium tracking-wide">${item.label}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    if (window.lucide) lucide.createIcons();
  }
};

window.BottomNav = BottomNav;