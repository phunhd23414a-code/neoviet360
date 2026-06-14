// neoviet360/pages/ActivityPage.js
const ActivityPage = {
  render: async (container) => {
    container.innerHTML = `<div class="flex justify-center py-40"><svg class="animate-spin h-6 w-6 text-ai-muted" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`;
    
    await mockDelay(400);
    const transactions = await api.fetchJSON('./data/transactions.json') || [];

    const renderLogs = (filterType = 'all') => {
      const filtered = transactions.filter(tx => {
        if (filterType === 'all') return true;
        if (filterType === 'income') return tx.type === 'credit';
        if (filterType === 'expense') return tx.type === 'debit' && tx.category !== 'transfer' && tx.category !== 'investment';
        return tx.category === filterType;
      });

      return filtered.map(tx => {
        let bgGlow, textColor, iconName, sign;
        if (tx.type === 'credit') {
          bgGlow = 'bg-status-success/10 border-status-success/20 text-status-success'; textColor = 'text-status-success'; iconName = 'arrow-down-left'; sign = '+';
        } else if (tx.category === 'transfer') {
          bgGlow = 'bg-status-highlight/10 border-status-highlight/20 text-status-highlight'; textColor = 'text-white'; iconName = 'send'; sign = '-';
        } else if (tx.category === 'investment' || tx.category === 'crypto') {
          bgGlow = 'bg-status-premium/10 border-status-premium/20 text-status-premium'; textColor = 'text-white'; iconName = 'trending-up'; sign = '-';
        } else {
          bgGlow = 'bg-status-alert/10 border-status-alert/20 text-status-alert'; textColor = 'text-white'; iconName = 'shopping-bag'; sign = '-';
        }

        return `
          <div class="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl ${bgGlow} border flex items-center justify-center shrink-0">
                <i data-lucide="${iconName}" class="w-4 h-4"></i>
              </div>
              <div>
                <div class="font-semibold text-white text-[15px]">${tx.merchant}</div>
                <div class="text-[13px] text-ai-muted font-medium mt-0.5">${formatUtils.relativeTime(tx.timestamp)}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-[15px] ${textColor} tracking-wide">${sign}${formatUtils.currency(tx.amount, tx.currency)}</div>
              <div class="text-[12px] text-ai-muted font-medium mt-0.5 capitalize">${tx.category}</div>
            </div>
          </div>
        `;
      }).join('');
    };

    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">Data_Stream (Nhật ký giao dịch)</h2>
            <p class="text-[13px] text-ai-muted mt-1">Toàn bộ lịch sử luồng tiền trong hệ sinh thái</p>
          </div>
          
          <div class="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            ${[
              { id: 'all', label: 'Tất cả' },
              { id: 'income', label: 'Thu nhập' },
              { id: 'expense', label: 'Chi tiêu' },
              { id: 'transfer', label: 'Chuyển khoản' },
              { id: 'investment', label: 'Đầu tư' }
            ].map((tab, idx) => `
              <button data-filter="${tab.id}" class="filter-tab px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all ${idx === 0 ? 'bg-white/10 text-white border border-white/10 shadow-sm' : 'text-ai-muted hover:text-white'}">
                ${tab.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="layer-primary rounded-3xl p-4 sm:p-6">
          <div id="log-container" class="space-y-1">
            ${renderLogs('all')}
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();

    // Xử lý chuyển đổi tab bộ lọc mượt mà
    document.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('bg-white/10', 'text-white', 'border', 'border-white/10', 'shadow-sm'), b.classList.add('text-ai-muted'));
        const target = e.currentTarget;
        target.classList.add('bg-white/10', 'text-white', 'border', 'border-white/10', 'shadow-sm');
        
        const logBox = document.getElementById('log-container');
        logBox.innerHTML = renderLogs(target.dataset.filter);
        lucide.createIcons();
      });
    });
  }
};