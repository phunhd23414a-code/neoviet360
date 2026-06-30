// neoviet360/components/Header.js
const Header = {
  render: (container, currentRoute) => {
    // 1. Menu điều hướng
    const menuItems = [
      { id: 'dashboard', label: 'Trang chủ' },
      { id: 'activity', label: 'Lịch sử' },
      { id: 'payments', label: 'Thanh toán' },
      { id: 'marketplace', label: 'Hệ sinh thái' },
      { id: 'insights', label: 'Phân tích' }
    ];

    const menuHtml = menuItems.map(item => `
      <a href="#" onclick="router.navigate('${item.id}'); return false;"
         class="px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-300 ${
           currentRoute === item.id 
           ? 'text-white bg-white/10 shadow-sm border border-white/5' 
           : 'text-ai-muted hover:text-white hover:bg-white/5'
         }"
         aria-label="Điều hướng đến ${item.label}">
        ${item.label}
      </a>
    `).join('');

    // 2. Giao diện Dropdown Thông báo
    const notiHtml = `
      <div id="noti-dropdown" class="absolute right-0 top-[calc(100%+16px)] w-80 bg-ai-surface backdrop-blur-[24px] border border-ai-border rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] transform opacity-0 scale-95 pointer-events-none transition-all duration-200 z-[100] overflow-hidden">
        <div class="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 class="font-bold text-white text-[14px]">Thông báo <span id="noti-count" class="text-status-alert text-[12px]">(0)</span></h3>
          <button onclick="Header.markAllRead()" class="text-[12px] text-status-highlight hover:text-white transition-colors" aria-label="Đánh dấu tất cả thông báo là đã đọc">Đã đọc tất cả</button>
        </div>
        <div id="noti-list" class="max-h-[300px] overflow-y-auto">
          <!-- Notifications will be populated dynamically here -->
        </div>
        <div class="p-2 border-t border-white/5">
          <button class="w-full py-2 text-[13px] text-ai-muted hover:text-white transition-colors text-center font-medium">Xem tất cả</button>
        </div>
      </div>
    `;

    // 3. Giao diện Dropdown Tìm kiếm (Tính năng mới)
    const searchHtml = `
      <div id="search-dropdown" class="absolute right-0 top-[calc(100%+16px)] w-[320px] sm:w-[400px] bg-ai-surface backdrop-blur-[24px] border border-ai-border rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] transform opacity-0 scale-95 pointer-events-none transition-all duration-200 z-[100] overflow-hidden p-4">
        <div class="relative mb-4">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ai-muted"></i>
          <input type="text" id="global-search-input" placeholder="Tìm kiếm giao dịch, tính năng..." class="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder-ai-muted outline-none focus:border-status-highlight/50 transition-colors" aria-label="Tìm kiếm giao dịch hoặc tính năng">
        </div>
        
        <div class="mb-2">
          <div class="text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2 px-1">Gợi ý tính năng</div>
          <div class="flex flex-wrap gap-2">
            <button onclick="router.navigate('transfer'); Header.closeSearch();" class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[12px] transition-colors border border-white/5" aria-label="Chuyển khoản">Chuyển khoản</button>
            <button onclick="router.navigate('qr-pay'); Header.closeSearch();" class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[12px] transition-colors border border-white/5" aria-label="Quét mã QR">Quét mã QR</button>
            <button onclick="router.navigate('spending'); Header.closeSearch();" class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[12px] transition-colors border border-white/5" aria-label="Xem ngân sách">Ngân sách</button>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2 px-1">Giao dịch gần đây</div>
          <div class="space-y-1">
            <div class="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors" onclick="router.navigate('activity'); Header.closeSearch();" role="button" tabindex="0" aria-label="Xem giao dịch chuyển tiền">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-status-highlight/10 flex items-center justify-center text-status-highlight"><i data-lucide="send" class="w-4 h-4" aria-hidden="true"></i></div>
                <div>
                  <div class="text-[13px] text-white font-medium">Chuyển tiền tiết kiệm</div>
                  <div class="text-[11px] text-ai-muted">5/6/2026</div>
                </div>
              </div>
              <div class="text-[13px] text-white font-bold">-15.000.000 ₫</div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="w-full px-4 sm:px-8 xl:px-12">
        <div class="flex justify-between items-center h-[68px]">
          
          <div class="flex items-center gap-8">
            <div class="flex-shrink-0 cursor-pointer flex items-center gap-2.5 transition-transform hover:scale-105" onclick="router.navigate('dashboard')" role="button" tabindex="0" aria-label="Trang chủ">
              <div class="w-8 h-8 rounded-lg bg-status-highlight/20 border border-status-highlight/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.4)]" aria-hidden="true">
                <i data-lucide="leaf" class="w-4 h-4 text-status-highlight"></i>
              </div>
              <span class="text-white font-display font-bold text-[18px] tracking-tight text-glow-emerald">NeoViet 360</span>
            </div>
            
            <nav class="hidden md:flex space-x-1">
              ${menuHtml}
            </nav>
          </div>

          <div class="flex items-center gap-4 sm:gap-6">
            
            <div class="relative" id="search-wrapper">
              <button onclick="Header.toggleSearch(event)" class="text-ai-muted hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5" aria-label="Mở tìm kiếm">
                <i data-lucide="search" class="w-5 h-5 stroke-[1.5]" aria-hidden="true"></i>
              </button>
              ${searchHtml}
            </div>

            <div class="relative" id="noti-wrapper">
              <button onclick="Header.toggleNoti(event)" class="text-ai-muted hover:text-white transition-colors relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5" aria-label="Mở thông báo">
                <i data-lucide="bell" class="w-5 h-5 stroke-[1.5]" aria-hidden="true"></i>
                <span id="noti-badge" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-status-alert rounded-full shadow-[0_0_8px_#FF5F56]" aria-hidden="true"></span>
              </button>
              ${notiHtml}
            </div>
            
            ${UserMenu.render()}
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
    UserMenu.initGlobalListener();
    Header.initGlobalListener();
  },

  // Logic Đóng/Mở Thông Báo
  toggleNoti: (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('noti-dropdown');
    if (!dropdown) return;
    
    const isClosed = dropdown.classList.contains('opacity-0');
    if (isClosed) {
      Header.closeAllDropdowns(); // Tự động đóng các menu khác
      dropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
      
      // Ẩn badge đỏ khi mở thông báo
      const badge = document.getElementById('noti-badge');
      if (badge) badge.classList.add('hidden');
    } else {
      Header.closeNoti();
    }
  },

  // Logic Đóng/Mở Tìm Kiếm
  toggleSearch: (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('search-dropdown');
    if (!dropdown) return;
    
    const isClosed = dropdown.classList.contains('opacity-0');
    if (isClosed) {
      Header.closeAllDropdowns(); // Tự động đóng các menu khác
      dropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
      // Tự động focus vào ô nhập liệu
      setTimeout(() => document.getElementById('global-search-input').focus(), 100);
    } else {
      Header.closeSearch();
    }
  },

  closeSearch: () => {
    const dropdown = document.getElementById('search-dropdown');
    if (dropdown && !dropdown.classList.contains('opacity-0')) {
      dropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    }
  },

  closeNoti: () => {
    const dropdown = document.getElementById('noti-dropdown');
    if (dropdown && !dropdown.classList.contains('opacity-0')) {
      dropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    }
  },
  
  // Hàm trợ giúp đóng sạch mọi dropdown đang mở
  closeAllDropdowns: () => {
      Header.closeNoti();
      Header.closeSearch();
      if (window.UserMenu) UserMenu.close();
  },

   initGlobalListener: () => {
     document.addEventListener('click', (e) => {
       const notiWrapper = document.getElementById('noti-wrapper');
       const searchWrapper = document.getElementById('search-wrapper');
       
       if (notiWrapper && !notiWrapper.contains(e.target)) {
         Header.closeNoti();
       }
       if (searchWrapper && !searchWrapper.contains(e.target)) {
         Header.closeSearch();
       }
     });
     // Render notifications on first load
     Header.renderNotifications();
   },

  renderNotifications: () => {
    const notiList = document.getElementById('noti-list');
    if (!notiList) return;

    // 1. Lấy 3 giao dịch gần nhất từ state
    const recentTransactions = state.transactions?.slice(0, 3) || [];
    
    // 2. Tạo 2 thông báo cứng (mock)
    const mockNotifications = [
      {
        id: 'm1',
        type: 'alert',
        icon: 'zap',
        color: 'status-alert',
        title: 'Hóa đơn điện sắp đến hạn',
        desc: 'Hóa đơn tháng 6 (1.250.000đ) sẽ hết hạn thanh toán trong 2 ngày tới.',
        time: '2 giờ trước'
      },
      {
        id: 'm2',
        type: 'info',
        icon: 'piggy-bank',
        color: 'status-success',
        title: 'Tiết kiệm đáo hạn ngày 30/6',
        desc: 'Khoản tiết kiệm "Mua xe" của bạn sắp hoàn thành mục tiêu.',
        time: '5 giờ trước'
      }
    ];

    // 3. Chuyển đổi transactions thành format thông báo
    const txnNotifications = recentTransactions.map(txn => ({
      id: txn.id,
      type: txn.type,
      icon: txn.type === 'credit' ? 'arrow-down-left' : 'send',
      color: txn.type === 'credit' ? 'status-success' : 'status-highlight',
      title: txn.type === 'credit' ? 'Nhận tiền thành công' : 'Chuyển tiền thành công',
      desc: txn.type === 'credit' 
        ? `Bạn vừa nhận được ${formatUtils.currency(txn.amount, txn.currency)} từ ${txn.merchant}`
        : `Bạn vừa chuyển ${formatUtils.currency(txn.amount, txn.currency)} đến ${txn.merchant}`,
      time: formatUtils.relativeTime(txn.timestamp || txn.date)
    }));

    const allNotifications = [...txnNotifications, ...mockNotifications];

    if (allNotifications.length === 0) {
      notiList.innerHTML = `
        <div class="p-8 text-center">
          <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <i data-lucide="bell-off" class="w-6 h-6 text-ai-muted"></i>
          </div>
          <p class="text-ai-muted text-[13px]">Không có thông báo mới</p>
        </div>
      `;
      document.getElementById('noti-count').textContent = '(0)';
      return;
    }

    const notiHtml = allNotifications.map(noti => `
      <div class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 group">
        <div class="w-9 h-9 rounded-xl bg-${noti.color}/10 flex items-center justify-center shrink-0 border border-${noti.color}/20 group-hover:scale-110 transition-transform">
          <i data-lucide="${noti.icon}" class="w-4 h-4 text-${noti.color}"></i>
        </div>
        <div class="flex-1">
          <div class="text-[13px] text-white font-semibold mb-0.5">${noti.title}</div>
          <div class="text-[12px] text-ai-muted leading-relaxed">${noti.desc}</div>
          <div class="text-[10px] text-ai-muted/60 mt-1.5 font-mono uppercase tracking-wider">${noti.time}</div>
        </div>
      </div>
    `).join('');

    notiList.innerHTML = notiHtml;
    document.getElementById('noti-count').textContent = `(${allNotifications.length})`;
    lucide.createIcons();
  },

  markAllRead: () => {
    const notiList = document.getElementById('noti-list');
    if (notiList) {
      notiList.innerHTML = `
        <div class="p-8 text-center animate__animated animate__fadeIn">
          <div class="w-12 h-12 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-status-success/20">
            <i data-lucide="check" class="w-6 h-6 text-status-success"></i>
          </div>
          <p class="text-ai-muted text-[13px]">Đã đánh dấu tất cả là đã đọc</p>
        </div>
      `;
      document.getElementById('noti-count').textContent = '(0)';
      
      const badge = document.getElementById('noti-badge');
      if (badge) badge.classList.add('hidden');
      
      lucide.createIcons();
    }
  }
};

window.Header = Header;