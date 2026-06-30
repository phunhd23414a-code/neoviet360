// neoviet360/pages/DashboardPage.js
const DashboardPage = {
  render: async (container) => {
    container.innerHTML = `
      <div class="animate__animated animate__fadeIn space-y-8 pb-12 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div class="lg:col-span-5">
            ${SkeletonLoader.card(1)}
          </div>
          <div class="lg:col-span-7 layer-secondary rounded-3xl p-6 md:p-8 flex flex-col justify-center border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div class="grid grid-cols-4 md:grid-cols-5 gap-y-8 gap-x-2">
              ${Array(9).fill(0).map(() => `
                <div class="flex flex-col items-center animate-pulse">
                  <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 mb-3"></div>
                  <div class="w-16 h-3 bg-white/5 rounded-md"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div class="lg:col-span-7 layer-secondary rounded-3xl p-8 min-h-[360px] animate-pulse">
            <div class="w-48 h-6 bg-white/5 rounded-lg mb-8"></div>
            <div class="w-full h-48 bg-white/5 rounded-2xl"></div>
          </div>
          <div class="lg:col-span-5 layer-primary rounded-3xl p-6">
            <div class="w-48 h-6 bg-white/5 rounded-lg mb-6 ml-2"></div>
            ${SkeletonLoader.transactionRow(5)}
          </div>
        </div>
      </div>
    `;

    // Dùng trực tiếp data đã load sẵn trong state.initData(), không fetch lại
    const accounts = state.accounts || [];
    const transactions = state.transactions || [];
    const totalVND = accounts.filter(acc => acc.currency === 'VND').reduce((sum, acc) => sum + acc.balance, 0);

    // Logic chuyển đổi tài khoản trên Hero Card
    window.switchDashboardAccount = (type, element) => {
      const balanceDisplay = document.querySelector('.hero-balance');
      const tabs = document.querySelectorAll('.account-tab');
      
      // Cập nhật UI tabs
      tabs.forEach(tab => {
        tab.classList.remove('bg-white/20', 'border-status-highlight', 'text-status-highlight');
        tab.classList.add('bg-white/5', 'border-white/5', 'text-ai-muted');
      });
      element.classList.remove('bg-white/5', 'border-white/5', 'text-ai-muted');
      element.classList.add('bg-white/20', 'border-status-highlight', 'text-status-highlight');

      // Cập nhật số dư
      let balance = 0;
      if (type === 'total') {
        balance = accounts.filter(acc => acc.currency === 'VND').reduce((sum, acc) => sum + acc.balance, 0);
      } else {
        const acc = accounts.find(a => a.type === type);
        balance = acc ? acc.balance : 0;
      }
      balanceDisplay.innerHTML = formatUtils.currency(balance, 'VND');
    };

    // Xây dựng logic UI popup cho Chi Tiết Giao Dịch
    window.openTxnDetail = (encodedTx) => {
        const tx = JSON.parse(decodeURIComponent(encodedTx));
        let statusColor = tx.status === 'success' ? 'text-status-success' : (tx.status === 'pending' ? 'text-status-warning' : 'text-status-alert');
        let statusText = tx.status === 'success' ? 'Thành công' : (tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại');
        let sign = tx.type === 'credit' ? '+' : '-';
        let amountColor = tx.type === 'credit' ? 'text-status-success' : 'text-white';
        
        const html = `
            <div class="p-6 text-center border-b border-white/5 relative">
                <button onclick="Modal.close()" class="absolute top-6 left-6 text-ai-muted hover:text-white transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="receipt" class="w-8 h-8 text-status-highlight"></i>
                </div>
                <h3 class="text-white text-lg font-bold mb-1">${tx.merchant}</h3>
                <p class="text-[24px] font-extrabold ${amountColor} mb-2">${sign}${formatUtils.currency(tx.amount, tx.currency)}</p>
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium ${statusColor}">
                    <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                    ${statusText}
                </div>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex justify-between items-center text-[13px]">
                    <span class="text-ai-muted">Mã giao dịch</span>
                    <span class="text-white font-mono">${tx.id || 'TXN-' + Math.floor(Math.random()*1000000)}</span>
                </div>
                <div class="flex justify-between items-center text-[13px]">
                    <span class="text-ai-muted">Thời gian</span>
                    <span class="text-white">${new Date(tx.timestamp).toLocaleString('vi-VN')}</span>
                </div>
                <div class="flex justify-between items-center text-[13px]">
                    <span class="text-ai-muted">Danh mục</span>
                    <span class="text-white capitalize">${tx.category}</span>
                </div>
                <div class="flex justify-between items-center text-[13px]">
                    <span class="text-ai-muted">Nội dung</span>
                    <span class="text-white text-right max-w-[60%] truncate">${tx.note || 'Giao dịch qua NeoViet 360'}</span>
                </div>
            </div>
            <div class="p-6 bg-white/5 flex gap-3">
                <button class="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="help-circle" class="w-4 h-4"></i> Hỗ trợ
                </button>
                <button class="flex-1 bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight py-3 rounded-xl font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="download" class="w-4 h-4"></i> Biên lai
                </button>
            </div>
        `;
        Modal.open(html);
    };

    const txnHtml = transactions.slice(0, 6).map(tx => {
        let bgGlow, textColor, iconName, sign;
        if (tx.type === 'credit') { 
            bgGlow = 'bg-status-success/10 border-status-success/20 text-status-success shadow-[0_0_15px_rgba(0,230,118,0.15)]'; textColor = 'text-status-success'; iconName = 'arrow-down-left'; sign = '+';
        } else if (tx.category === 'transfer') { 
            bgGlow = 'bg-status-highlight/10 border-status-highlight/20 text-status-highlight shadow-[0_0_15px_rgba(0,245,255,0.15)]'; textColor = 'text-white'; iconName = 'send'; sign = '-';
        } else if (tx.category === 'investment' || tx.category === 'crypto') { 
            bgGlow = 'bg-status-premium/10 border-status-premium/20 text-status-premium shadow-[0_0_15px_rgba(168,85,247,0.15)]'; textColor = 'text-white'; iconName = 'trending-up'; sign = '-';
        } else { 
            bgGlow = 'bg-status-alert/10 border-status-alert/20 text-status-alert shadow-[0_0_15px_rgba(255,95,86,0.15)]'; textColor = 'text-white'; iconName = 'shopping-bag'; sign = '-';
        }
        
        // Đóng gói data của 1 dòng để truyền sang hàm open modal
        const encodedTx = encodeURIComponent(JSON.stringify(tx));

        return `
          <div onclick="openTxnDetail('${encodedTx}')" class="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-300 cursor-pointer group" role="button" tabindex="0" aria-label="Xem chi tiết giao dịch ${tx.merchant}">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl ${bgGlow} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105" aria-hidden="true">
                <i data-lucide="${iconName}" class="w-4 h-4"></i>
              </div>
              <div>
                <div class="font-semibold text-white text-[15px]">${tx.merchant}</div>
                <div class="text-[13px] text-ai-muted font-medium mt-0.5">${formatUtils.relativeTime(tx.timestamp)}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-[15px] ${textColor} tracking-wide">
                ${sign}${formatUtils.currency(tx.amount, tx.currency)}
              </div>
              <div class="text-[12px] text-ai-muted font-medium mt-0.5 capitalize">${tx.category}</div>
            </div>
          </div>
        `;
    }).join('');

    container.innerHTML = `
      <div class="animate__animated animate__fadeIn space-y-8 pb-12 w-full">
        
        <!-- Bento Grid Layout -->
        <div class="bento-grid">
          
          <!-- Hero Card (Bento Item 1) -->
          <div class="col-span-12 lg:col-span-5 bento-item hero-core p-6 md:p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            <div class="energy-wave"></div>
            <div class="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#00E676] opacity-20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <!-- Neon Sprout SVG -->
            <div class="absolute top-4 right-4 opacity-80 pointer-events-none">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 90 C50 90 50 60 50 50 C50 40 30 30 30 20 C30 10 40 10 50 20 C60 10 70 10 70 20 C70 30 50 40 50 50" stroke="#00E676" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse-slow" style="filter: drop-shadow(0 0 8px #00E676);"/>
                    <circle cx="30" cy="20" r="4" fill="#00F5FF" style="filter: drop-shadow(0 0 5px #00F5FF);"/>
                    <circle cx="70" cy="20" r="4" fill="#00F5FF" style="filter: drop-shadow(0 0 5px #00F5FF);"/>
                    <path d="M50 50 C50 50 70 60 80 50" stroke="#00E676" stroke-width="2" stroke-linecap="round" class="animate-pulse-slow" style="animation-delay: 1s; filter: drop-shadow(0 0 5px #00E676);"/>
                    <circle cx="80" cy="50" r="3" fill="#00F5FF" style="filter: drop-shadow(0 0 5px #00F5FF);"/>
                </svg>
            </div>

            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span class="text-white/80 font-medium text-[12px] uppercase tracking-wider">Số dư khả dụng</span>
                  <div id="hero-balance-display" class="text-[36px] sm:text-[42px] font-display font-extrabold hero-balance leading-none text-white text-glow-emerald mt-1 transition-all duration-300" data-value="${totalVND}">
                    0 ₫
                  </div>
                </div>
              </div>

              <!-- Mini Account Switcher -->
              <div class="flex gap-2 mb-6">
                <button onclick="switchDashboardAccount('total', this)" class="account-tab flex-1 bg-status-success/20 border border-status-success text-status-success rounded-xl px-3 py-2 text-center transition-all duration-300">
                  <div class="text-[10px] uppercase tracking-tighter font-bold opacity-90">Tổng hợp</div>
                </button>
                <button onclick="switchDashboardAccount('checking', this)" class="account-tab flex-1 bg-black/20 border border-white/10 text-ai-muted rounded-xl px-3 py-2 text-center hover:bg-white/10 transition-all duration-300">
                  <div class="text-[10px] uppercase tracking-tighter font-bold opacity-80">Thanh toán</div>
                </button>
                <button onclick="switchDashboardAccount('savings', this)" class="account-tab flex-1 bg-black/20 border border-white/10 text-ai-muted rounded-xl px-3 py-2 text-center hover:bg-white/10 transition-all duration-300">
                  <div class="text-[10px] uppercase tracking-tighter font-bold opacity-80">Tiết kiệm</div>
                </button>
                <button onclick="switchDashboardAccount('investment', this)" class="account-tab flex-1 bg-black/20 border border-white/10 text-ai-muted rounded-xl px-3 py-2 text-center hover:bg-white/10 transition-all duration-300">
                  <div class="text-[10px] uppercase tracking-tighter font-bold opacity-80">Đầu tư</div>
                </button>
              </div>
              
              <!-- Chi tiêu hôm nay -->
              <div class="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl p-3 backdrop-blur-md">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-status-alert/20 flex items-center justify-center text-status-alert">
                    <i data-lucide="trending-down" class="w-4 h-4"></i>
                  </div>
                  <span class="text-[13px] text-white font-medium">Chi tiêu hôm nay</span>
                </div>
                <span class="text-[14px] font-bold text-white">-175.000 ₫</span>
              </div>
              
              <!-- AI Daily Insight -->
              <div id="dashboard-ai-insight" class="mt-3"></div>
            </div>
            
            <!-- Hai nút Call-to-Action -->
            <div class="relative z-10 flex gap-3 mt-6">
              <button class="flex-1 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 py-3 rounded-xl text-[14px] font-semibold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2" aria-label="Nạp tiền vào tài khoản">
                <i data-lucide="plus" class="w-4 h-4" aria-hidden="true"></i> Nạp tiền
              </button>
              <button onclick="router.navigate('transfer')" class="flex-1 bg-status-success text-black py-3 rounded-xl text-[14px] font-bold transition-all shadow-[0_0_15px_rgba(0,230,118,0.4)] hover:shadow-[0_0_25px_rgba(0,230,118,0.6)] flex items-center justify-center gap-2" aria-label="Chuyển tiền sang tài khoản khác">
                <i data-lucide="send" class="w-4 h-4" aria-hidden="true"></i> Chuyển tiền
              </button>
            </div>
          </div>

          <!-- Quick Actions (Bento Item 2) -->
          <div class="col-span-12 lg:col-span-7 bento-item layer-secondary p-6 md:p-8 flex flex-col justify-center">
            <h3 class="font-bold text-white text-[16px] mb-6 hidden md:block">Thao tác nhanh</h3>
            
            <div class="grid grid-cols-4 md:grid-cols-5 gap-y-8 gap-x-2">
            ${[
              { id: 'transfer', svg: '<circle cx="50" cy="50" r="40" fill="rgba(0,230,118,0.1)" stroke="#00E676" stroke-width="2"/><path d="M30 50 L70 50 M50 30 L70 50 L50 70" stroke="#00E676" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>', label: 'Chuyển tiền', glow: 'rgba(0,230,118,0.5)' },
              { id: 'accounts', svg: '<rect x="20" y="30" width="60" height="40" rx="5" fill="rgba(0,245,255,0.1)" stroke="#00F5FF" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="#00F5FF"/>', label: 'Tài khoản', glow: 'rgba(0,245,255,0.5)' },
              { id: 'cards', svg: '<rect x="15" y="25" width="70" height="50" rx="8" fill="rgba(255,184,0,0.1)" stroke="#FFB800" stroke-width="2"/><path d="M15 45 L85 45" stroke="#FFB800" stroke-width="4"/>', label: 'Thẻ', glow: 'rgba(255,184,0,0.5)' },
              { id: 'invest', svg: '<polygon points="50,15 85,35 85,75 50,95 15,75 15,35" fill="rgba(168,85,247,0.1)" stroke="#A855F7" stroke-width="2"/><circle cx="50" cy="55" r="15" fill="#A855F7"/>', label: 'Đầu tư', glow: 'rgba(168,85,247,0.5)' },
              { id: 'savings', svg: '<path d="M50 20 C70 20 80 40 80 60 C80 80 60 90 50 90 C40 90 20 80 20 60 C20 40 30 20 50 20 Z" fill="rgba(0,230,118,0.1)" stroke="#00E676" stroke-width="2"/><path d="M40 40 L60 40" stroke="#00E676" stroke-width="4" stroke-linecap="round"/>', label: 'Tiết kiệm', glow: 'rgba(0,230,118,0.5)' },
              { id: 'loan', svg: '<path d="M20 80 L50 20 L80 80 Z" fill="rgba(0,245,255,0.1)" stroke="#00F5FF" stroke-width="2"/><rect x="45" y="40" width="10" height="30" fill="#00F5FF"/>', label: 'Khoản vay', glow: 'rgba(0,245,255,0.5)' },
              { id: 'qr-pay', svg: '<rect x="20" y="20" width="25" height="25" fill="none" stroke="#00E676" stroke-width="4"/><rect x="55" y="20" width="25" height="25" fill="none" stroke="#00E676" stroke-width="4"/><rect x="20" y="55" width="25" height="25" fill="none" stroke="#00E676" stroke-width="4"/><rect x="55" y="55" width="25" height="25" fill="#00E676"/>', label: 'Quét mã QR', glow: 'rgba(0,230,118,0.5)' },
              { id: 'bill-pay', svg: '<rect x="30" y="15" width="40" height="70" rx="2" fill="rgba(255,184,0,0.1)" stroke="#FFB800" stroke-width="2"/><path d="M40 35 L60 35 M40 50 L60 50 M40 65 L50 65" stroke="#FFB800" stroke-width="3" stroke-linecap="round"/>', label: 'Thanh toán', glow: 'rgba(255,184,0,0.5)' },
              { id: 'split-bill', svg: '<circle cx="50" cy="50" r="35" fill="rgba(168,85,247,0.1)" stroke="#A855F7" stroke-width="2"/><path d="M50 15 L50 50 L80 70" stroke="#A855F7" stroke-width="3" stroke-linecap="round"/>', label: 'Chia hóa đơn', glow: 'rgba(168,85,247,0.5)' },
              { id: 'marketplace', svg: '<rect x="25" y="25" width="20" height="20" fill="#00F5FF"/><rect x="55" y="25" width="20" height="20" fill="rgba(0,245,255,0.3)" stroke="#00F5FF" stroke-width="2"/><rect x="25" y="55" width="20" height="20" fill="rgba(0,245,255,0.3)" stroke="#00F5FF" stroke-width="2"/><rect x="55" y="55" width="20" height="20" fill="#00F5FF"/>', label: 'Hệ sinh thái', glow: 'rgba(0,245,255,0.5)' }
            ].map(action => `
              <div onclick="router.navigate('${action.id}')" class="flex flex-col items-center justify-start cursor-pointer group" role="button" tabindex="0" aria-label="${action.label}">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110" style="transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);" onmouseover="this.style.boxShadow='0 0 20px ${action.glow}'" onmouseout="this.style.boxShadow='none'">
                  <svg viewBox="0 0 100 100" class="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12">
                    ${action.svg}
                  </svg>
                </div>
                <span class="text-[12px] font-medium text-ai-muted group-hover:text-white transition-colors text-center leading-tight w-full truncate px-1">${action.label}</span>
              </div>
            `).join('')}
            </div>
          </div>

          <!-- AI Financial Coach Widget (Code-generated SVG Entity) -->
          <div onclick="AICoachModal.open()" class="col-span-12 bento-item layer-primary p-6 md:p-8 relative overflow-hidden cursor-pointer group min-h-[220px]" role="button" tabindex="0" aria-label="Mở AI Financial Coach">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_82%_38%,rgba(0,230,118,0.18),transparent_36%)] pointer-events-none"></div>
            <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-status-premium to-transparent opacity-70"></div>
            
            <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div class="lg:col-span-3 flex justify-center lg:justify-start">
                <div class="ai-coach-core w-36 h-36 flex items-center justify-center">
                  <svg class="ai-breathing w-32 h-32 overflow-visible" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                      <radialGradient id="coachCoreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#F0FDFA"/>
                        <stop offset="34%" stop-color="#00F5FF"/>
                        <stop offset="68%" stop-color="#A855F7"/>
                        <stop offset="100%" stop-color="#020B08" stop-opacity="0"/>
                      </radialGradient>
                      <linearGradient id="coachLinkGradient" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#A855F7"/>
                        <stop offset="1" stop-color="#00E676"/>
                      </linearGradient>
                      <filter id="coachGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="80" cy="80" r="60" stroke="rgba(0,245,255,0.22)" stroke-width="1" stroke-dasharray="5 9" class="ai-neural-ring"/>
                    <circle cx="80" cy="80" r="46" stroke="rgba(168,85,247,0.32)" stroke-width="1.5" stroke-dasharray="10 7" class="ai-neural-ring" style="animation-direction: reverse; animation-duration: 12s;"/>
                    <path d="M42 55 L80 80 L118 50 M80 80 L46 110 M80 80 L116 112 M42 55 L46 110 M118 50 L116 112" stroke="url(#coachLinkGradient)" stroke-width="2" stroke-linecap="round" opacity="0.75" filter="url(#coachGlow)"/>
                    <circle cx="80" cy="80" r="22" fill="url(#coachCoreGradient)" filter="url(#coachGlow)"/>
                    <circle cx="42" cy="55" r="7" fill="#A855F7" filter="url(#coachGlow)"/>
                    <circle cx="118" cy="50" r="6" fill="#00F5FF" filter="url(#coachGlow)"/>
                    <circle cx="46" cy="110" r="6" fill="#00E676" filter="url(#coachGlow)"/>
                    <circle cx="116" cy="112" r="7" fill="#A855F7" filter="url(#coachGlow)"/>
                    <path d="M70 80 C74 71 86 71 90 80 C86 89 74 89 70 80Z" fill="#020B08" opacity="0.65"/>
                    <circle cx="80" cy="80" r="4" fill="#F8FAFC"/>
                  </svg>
                </div>
              </div>

              <div class="lg:col-span-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-status-premium/10 border border-status-premium/20 text-status-premium text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                  <span class="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
                  AI Coach đang tư duy
                </div>
                <h3 class="font-display text-[26px] md:text-[34px] font-extrabold text-white leading-tight mb-3">
                  Neural Finance Grove
                </h3>
                <p class="text-ai-muted text-[14px] md:text-[15px] leading-relaxed max-w-2xl">
                  Thực thể AI phân tích dòng tiền như một hệ rễ sống: phát hiện rò rỉ chi tiêu, tối ưu tiết kiệm và gợi ý nhịp tăng trưởng bền vững theo thời gian thực.
                </p>
              </div>

              <div class="lg:col-span-3 flex flex-col gap-3">
                <div class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl group-hover:border-status-highlight/30 transition-colors">
                  <div class="text-[11px] text-ai-muted uppercase tracking-widest mb-1">Tín hiệu hôm nay</div>
                  <div class="text-white font-bold text-[15px]">Chi tiêu thấp hơn 12%</div>
                </div>
                <button class="w-full rounded-2xl bg-status-highlight/10 border border-status-highlight/30 text-status-highlight py-3 font-bold text-[13px] tracking-wide shadow-[0_0_20px_rgba(0,245,255,0.12)] group-hover:shadow-[0_0_30px_rgba(0,245,255,0.35)] group-hover:bg-status-highlight/20 transition-all">
                  MỞ COACH AI
                </button>
              </div>
            </div>
          </div>

          <!-- Chart (Bento Item 3) -->
          <div class="col-span-12 lg:col-span-7 bento-item layer-secondary p-8 flex flex-col min-h-[360px]">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h3 class="font-bold text-white text-[18px]">Phân tích dòng tiền</h3>
                <p class="text-[13px] text-ai-muted font-medium mt-1">Thu chi 7 ngày qua</p>
              </div>
              <button onclick="router.navigate('spending')" class="text-[13px] font-medium text-white glass-layer hover:bg-white/10 px-4 py-2 rounded-xl transition-colors">
               Deep View
              </button>
            </div>
            <div class="flex-1 w-full rounded-2xl border border-white/5 relative overflow-hidden chart-grid p-2">
               <canvas id="cashFlowCanvas" class="w-full h-full relative z-10"></canvas>
            </div>
          </div>

          <!-- Recent Transactions (Bento Item 4) -->
          <div class="col-span-12 lg:col-span-5 bento-item layer-primary p-6">
            <div class="flex justify-between items-center mb-4 px-2">
              <h3 class="font-bold text-white text-[18px]">Giao dịch gần đây</h3>
              <a href="#" class="text-[13px] font-medium text-status-success hover:text-white transition-colors">Expand</a>
            </div>
            <div class="space-y-1">
              ${txnHtml}
            </div>
          </div>

        </div>
      </div>
    `;
    // Kích hoạt biểu đồ sau khi HTML đã render xong
    requestAnimationFrame(() => {
      try {
        // Count-up Animation cho Hero Balance
        const balanceEl = document.getElementById('hero-balance-display');
        if (balanceEl) {
            const targetValue = parseFloat(balanceEl.getAttribute('data-value'));
            const duration = 900;
            const startTime = performance.now();

            const updateCounter = (now) => {
                if (state.currentPage !== 'dashboard') return;
                const progress = Math.min((now - startTime) / duration, 1);
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                balanceEl.innerHTML = formatUtils.currency(targetValue * easeProgress, 'VND');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    balanceEl.innerHTML = formatUtils.currency(targetValue, 'VND');
                }
            };

            requestAnimationFrame(updateCounter);
        }

        // Render AI Insight
        const insightContainer = document.getElementById('dashboard-ai-insight');
        if (insightContainer && window.aiAnalytics) {
          const summary = aiAnalytics.getSummary(state.transactions || [], state.budgets || {});
          const dailyInsight = summary.insights?.find(i => i.type === 'daily_status');
          
          if (dailyInsight) {
            const isOver = dailyInsight.status === 'over_average';
            const icon = isOver ? 'alert-circle' : 'check-circle';
            const colorClass = isOver ? 'text-status-warning' : 'text-status-success';
            const bgClass = isOver ? 'bg-status-warning/10 border-status-warning/20' : 'bg-status-success/10 border-status-success/20';
            
            insightContainer.innerHTML = `
              <div class="flex items-center gap-2 p-2.5 rounded-lg ${bgClass} border backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors" onclick="AICoachModal.open()">
                <i data-lucide="${icon}" class="w-4 h-4 ${colorClass} shrink-0"></i>
                <span class="text-[12px] text-white/90 flex-1 truncate">${dailyInsight.comparison}</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-ai-muted"></i>
              </div>
            `;
          }
        }

        if (state.currentPage === 'dashboard' && window.ChartUI && typeof ChartUI.renderCashFlow === 'function') {
            const datasets = {
              income: [15000000, 22000000, 18000000, 35000000, 28000000, 42000000, 38000000],
              expense: [12000000, 18000000, 25000000, 20000000, 31000000, 22000000, 19000000],
              savings: [3000000, 4000000, 0, 15000000, 0, 20000000, 19000000]
            };
            ChartUI.renderCashFlow('cashFlowCanvas', 
              ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'], 
              datasets
            );
        }
        
        // Khởi tạo lại icons cho các phần tử mới render
        if (window.lucide) lucide.createIcons();
      } catch (err) {
        console.error('Lỗi khi khởi tạo Dashboard components:', err);
      }
    });
  }
};

window.DashboardPage = DashboardPage;
