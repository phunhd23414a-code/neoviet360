// neoviet360/pages/ActivityPage.js
const ActivityPage = {
  render: async (container) => {
    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div class="animate-pulse">
            <div class="w-48 h-8 bg-white/5 rounded-lg mb-2"></div>
            <div class="w-64 h-4 bg-white/5 rounded-md"></div>
          </div>
          <div class="w-64 h-10 bg-white/5 rounded-xl animate-pulse"></div>
        </div>
        <div class="layer-primary rounded-3xl p-4 sm:p-6">
          ${SkeletonLoader.transactionRow(8)}
        </div>
      </div>
    `;
    
    // Dùng trực tiếp data từ state, không fetch lại và bỏ mockDelay
    const transactions = state.transactions || [];

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

        // AI Coaching for specific transactions
        let coachingHtml = '';
        if (tx.type === 'debit' && tx.amount > 500000) {
          coachingHtml = `
            <div class="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-highlight/5 border border-status-highlight/10 cursor-pointer hover:bg-status-highlight/10 transition-colors" onclick="event.stopPropagation(); AICoachModal.open()">
              <i data-lucide="sparkles" class="w-3 h-3 text-status-highlight"></i>
              <span class="text-[11px] text-status-highlight font-medium">AI: Giao dịch lớn, xem phân tích ngân sách</span>
            </div>
          `;
        }

        const encodedTx = encodeURIComponent(JSON.stringify(tx));
        return `
          <div onclick="TransactionDetailModal.open(JSON.parse(decodeURIComponent('${encodedTx}')))" class="flex flex-col p-4 hover:bg-white/5 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5 group" role="button" tabindex="0" aria-label="Giao dịch ${tx.merchant}, số tiền ${sign}${formatUtils.currency(tx.amount, tx.currency)}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl ${bgGlow} border flex items-center justify-center shrink-0" aria-hidden="true">
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
            ${coachingHtml}
          </div>
        `;
      }).join('');
    };

    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
           <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-white tracking-wide">Lịch sử giao dịch</h2>
              <button id="btn-export-statement" class="bg-status-highlight/10 hover:bg-status-highlight/20 border border-status-highlight/30 text-status-highlight px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-2" aria-label="Xuất lịch sử giao dịch ra tệp CSV">
                <i data-lucide="download" class="w-4 h-4" aria-hidden="true"></i> XUẤT CSV
              </button>
              <button id="btn-view-trends" class="bg-status-premium/10 hover:bg-status-premium/20 border border-status-premium/30 text-status-premium px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-2" aria-label="Xem xu hướng chi tiêu">
                <i data-lucide="trending-up" class="w-4 h-4" aria-hidden="true"></i> XU HƯỚNG
              </button>
            </div>
            <p class="text-[13px] text-ai-muted mt-1">Toàn bộ lịch sử luồng tiền của bạn trong hệ sinh thái</p>
          </div>
          
          <div class="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            ${[
              { id: 'all', label: 'Tất cả' },
              { id: 'income', label: 'Thu nhập' },
              { id: 'expense', label: 'Chi tiêu' },
              { id: 'transfer', label: 'Chuyển khoản' },
              { id: 'investment', label: 'Đầu tư' }
            ].map((tab, idx) => `
              <button data-filter="${tab.id}" class="filter-tab px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all ${idx === 0 ? 'bg-white/10 text-white border border-white/10 shadow-sm' : 'text-ai-muted hover:text-white'}" aria-label="Lọc theo ${tab.label}">
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
        document.querySelectorAll('.filter-tab').forEach(b => {
          b.classList.remove('bg-white/10', 'text-white', 'border', 'border-white/10', 'shadow-sm');
          b.classList.add('text-ai-muted');
        });
        const target = e.currentTarget;
        target.classList.add('bg-white/10', 'text-white', 'border', 'border-white/10', 'shadow-sm');
        target.classList.remove('text-ai-muted');
        
        const logBox = document.getElementById('log-container');
        logBox.innerHTML = renderLogs(target.dataset.filter);
        lucide.createIcons();
      });
    });

    // Tính năng xuất sao kê CSV thực tế
    document.getElementById('btn-export-statement').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalHTML = btn.innerHTML;
      
      btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> ĐANG TẠO CSV...`;
      btn.classList.add('opacity-50', 'pointer-events-none');
      lucide.createIcons();
      
      await mockDelay(600);

      const headers = ['Ma giao dich', 'Thoi gian', 'Nguoi nhan/Don vi', 'Danh muc', 'Loai', 'So tien', 'Tien te', 'Trang thai'];
      const rows = transactions.map(tx => [
        tx.id || '',
        new Date(tx.timestamp).toLocaleString('vi-VN'),
        tx.merchant || '',
        tx.category || '',
        tx.type || '',
        tx.amount || 0,
        tx.currency || 'VND',
        tx.status || ''
      ]);

      const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
      const csvContent = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `NeoViet_Statement_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> ĐÃ TẢI XUỐNG`;
      btn.classList.replace('text-status-highlight', 'text-status-success');
      btn.classList.replace('border-status-highlight/30', 'border-status-success/30');
      btn.classList.replace('bg-status-highlight/10', 'bg-status-success/10');
      lucide.createIcons();
      
      const modalHtml = `
        <div class="p-6 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 left-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="file-check" class="w-8 h-8 text-status-success"></i>
          </div>
          <h3 class="text-white text-lg font-bold mb-1">Xuất sao kê thành công!</h3>
          <p class="text-[14px] text-ai-muted">Tệp <b>NeoViet_Statement.csv</b> đã được tạo và tải xuống thiết bị của bạn.</p>
        </div>
        <div class="p-6 bg-white/5">
          <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-bold transition-all">
            ĐÓNG
          </button>
        </div>
      `;
      Modal.open(modalHtml);
      lucide.createIcons();
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.replace('text-status-success', 'text-status-highlight');
        btn.classList.replace('border-status-success/30', 'border-status-highlight/30');
        btn.classList.replace('bg-status-success/10', 'bg-status-highlight/10');
        btn.classList.remove('opacity-50', 'pointer-events-none');
        lucide.createIcons();
      }, 3000);
    });

    // View trends button
    document.getElementById('btn-view-trends').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalHTML = btn.innerHTML;
      
      btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> ĐANG TẢI...`;
      btn.classList.add('opacity-50', 'pointer-events-none');
      lucide.createIcons();
      
      try {
        await TrendAnalysisChart.open();
      } catch (error) {
        console.error('Error opening trends:', error);
      } finally {
        btn.innerHTML = originalHTML;
        btn.classList.remove('opacity-50', 'pointer-events-none');
        lucide.createIcons();
      }
    });
  }
};
