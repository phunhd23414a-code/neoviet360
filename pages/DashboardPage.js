// neoviet360/pages/DashboardPage.js
const DashboardPage = {
  render: async (container) => {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-40 space-y-4 opacity-50">
        <svg class="animate-spin h-6 w-6 text-ai-muted" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    `;

    await mockDelay(600);
    const accounts = await api.fetchJSON('./data/accounts.json') || [];
    const transactions = await api.fetchJSON('./data/transactions.json') || [];
    const totalVND = accounts.filter(acc => acc.currency === 'VND').reduce((sum, acc) => sum + acc.balance, 0);

    // Xử lý Transaction (Bổ sung Glow Màu Phụ: Green, Red, Purple, Cyan)
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
        
        return `
          <div class="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-300 cursor-pointer group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl ${bgGlow} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
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
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          <div class="lg:col-span-5 hero-core rounded-3xl p-10 flex flex-col justify-between min-h-[300px]">
            <div class="energy-wave"></div>
            <div class="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#00F5FF] opacity-30 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div class="particle w-1.5 h-1.5 left-[80%] bottom-[20%] opacity-0" style="animation-duration: 3s; animation-delay: 0s;"></div>
            <div class="particle w-2 h-2 left-[50%] bottom-[10%] opacity-0" style="animation-duration: 4s; animation-delay: 1s;"></div>
            <div class="particle w-1 h-1 left-[20%] bottom-[30%] opacity-0" style="animation-duration: 5s; animation-delay: 2s;"></div>
            
            <div class="relative z-10">
              <div class="flex justify-between items-center mb-6">
                <span class="text-white/80 font-medium text-[14px]">Total AI Portfolio</span>
                <div class="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5 text-status-success"></i>
                  <span class="text-[11px] font-semibold text-white uppercase tracking-wider">Secured</span>
                </div>
              </div>
              
              <div class="text-[48px] sm:text-[56px] font-extrabold hero-balance leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                ${formatUtils.currency(totalVND, 'VND')}
              </div>
              
              <div class="mt-4 flex items-center gap-2 text-[14px] font-medium text-white/80">
                <span class="text-status-success font-bold drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]">+2.45%</span>
                <span>Insight generated</span>
              </div>
            </div>
            
            <div class="relative z-10 flex gap-4 mt-8">
              <button class="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i> Deposit
              </button>
            </div>
          </div>

          <div class="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-5">
            ${[
              { id: 'transfer', icon: 'send', label: 'Transfer', theme: 'text-status-highlight', glow: 'shadow-[0_0_20px_rgba(0,245,255,0.15)]' },
              { id: 'accounts', icon: 'wallet', label: 'Accounts', theme: 'text-status-success', glow: 'shadow-[0_0_20px_rgba(0,230,118,0.15)]' },
              { id: 'cards', icon: 'credit-card', label: 'Cards', theme: 'text-status-warning', glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15)]' },
              { id: 'invest', icon: 'hexagon', label: 'Invest', theme: 'text-status-premium', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
              { id: 'savings', icon: 'piggy-bank', label: 'Savings', theme: 'text-status-success', glow: 'shadow-[0_0_20px_rgba(0,230,118,0.15)]' },
              { id: 'loan', icon: 'landmark', label: 'Loan', theme: 'text-status-insight', glow: 'shadow-[0_0_20px_rgba(124,77,255,0.15)]' },
              { id: 'qr-pay', icon: 'qr-code', label: 'Scan QR', theme: 'text-status-highlight', glow: 'shadow-[0_0_20px_rgba(0,245,255,0.15)]' },
              { id: 'bill-pay', icon: 'receipt', label: 'Pay Bills', theme: 'text-status-warning', glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15)]' }
            ].map(action => `
              <div onclick="router.navigate('${action.id}')" class="layer-tertiary rounded-2xl p-6 flex flex-col items-start justify-between cursor-pointer group min-h-[160px]">
                <div class="w-12 h-12 rounded-2xl glass-layer flex items-center justify-center ${action.theme} mb-4 group-hover:${action.glow} transition-all duration-300">
                  <i data-lucide="${action.icon}" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-white text-[15px]">${action.label}</h3>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          <div class="lg:col-span-7 layer-secondary rounded-3xl p-8 flex flex-col min-h-[360px]">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h3 class="font-bold text-white text-[18px]">AI Analytics</h3>
                <p class="text-[13px] text-ai-muted font-medium mt-1">Multi-asset projection</p>
              </div>
              <button onclick="router.navigate('spending')" class="text-[13px] font-medium text-white glass-layer hover:bg-white/10 px-4 py-2 rounded-xl transition-colors">
               Deep View
              </button>
            </div>
          <div class="flex-1 w-full rounded-2xl border border-white/5 relative overflow-hidden chart-grid p-2">
               <canvas id="cashFlowCanvas" class="w-full h-full relative z-10"></canvas>
            </div>
          </div>

          <div class="lg:col-span-5 layer-primary rounded-3xl p-6">
            <div class="flex justify-between items-center mb-4 px-2">
              <h3 class="font-bold text-white text-[18px]">System Log</h3>
              <a href="#" class="text-[13px] font-medium text-status-insight hover:text-white transition-colors">Expand</a>
            </div>
            <div class="space-y-1">
              ${txnHtml}
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();

    // Kích hoạt biểu đồ sau khi HTML đã render xong
    setTimeout(() => {
      ChartUI.renderCashFlow('cashFlowCanvas', 
        ['1/6', '5/6', '10/6', '15/6', '20/6', '25/6', '30/6'], 
        [12000000, 18000000, 15000000, 25000000, 22000000, 31000000, 28000000]
      );
    }, 150);
  }
};