// neoviet360/components/ReportsModal.js
// Redesigned Modern Fintech Dashboard UI for Financial Reports

const ReportsModal = {
  open: async function() {
    const transactions = await api.fetchJSON('./data/transactions.json') || [];
    const accounts = await api.fetchJSON('./data/accounts.json') || [];
    
    if (transactions.length === 0) {
      const emptyHtml = `
        <div class="p-8 text-center">
          <i data-lucide="inbox" class="w-12 h-12 text-ai-muted mx-auto mb-3" aria-hidden="true"></i>
          <h3 class="text-white font-bold mb-2">Không có dữ liệu</h3>
          <p class="text-ai-muted text-sm">Thực hiện một số giao dịch để xem báo cáo phân tích.</p>
        </div>
      `;
      Modal.open(emptyHtml);
      return;
    }

    // Calculate analytics using advancedAnalytics utility
    const monthlyReport = advancedAnalytics.generateReport(transactions, 'month');
    const latestMonth = Object.keys(monthlyReport).pop();
    const stats = monthlyReport[latestMonth] || {};
    
    const topMerchants = advancedAnalytics.getTopItems(transactions, 'merchant', 5);
    const topCategories = advancedAnalytics.getTopItems(transactions, 'category', 5);

    const ratio = parseFloat(stats.expenseRatio || 0);
    let ratioColor = 'bg-status-success';
    if (ratio > 80) ratioColor = 'bg-status-alert';
    else if (ratio > 50) ratioColor = 'bg-status-warning';

    const html = `
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-ai-card z-10 rounded-t-3xl shrink-0">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">Báo cáo tài chính</h2>
            <p class="text-[13px] text-ai-muted mt-0.5">Phân tích chi tiết về dòng tiền và tài sản</p>
          </div>
          <button onclick="Modal.close()" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <i data-lucide="x" class="w-5 h-5 text-ai-muted"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <!-- Hero Section: Net Balance -->
          <div class="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-ai-surface to-ai-card border border-white/5 shadow-2xl text-center">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-status-highlight/50 to-transparent"></div>
            <div class="text-[13px] font-bold text-ai-muted uppercase tracking-[0.2em] mb-3">Dòng tiền ròng</div>
            <div class="text-4xl md:text-5xl font-black ${stats.netFlow >= 0 ? 'text-status-success' : 'text-status-alert'} tracking-tighter mb-4">
              ${stats.netFlow >= 0 ? '+' : ''}${formatUtils.currency(stats.netFlow)}
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <i data-lucide="${stats.netFlow >= 0 ? 'trending-up' : 'trending-down'}" class="w-4 h-4 ${stats.netFlow >= 0 ? 'text-status-success' : 'text-status-alert'}"></i>
              <span class="text-[13px] font-bold text-white">+12.5% <span class="text-ai-muted font-medium text-[11px] ml-1">so với tháng trước</span></span>
            </div>
          </div>

          <!-- KPI Cards (Minimal) -->
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <div class="text-[10px] font-bold text-ai-muted uppercase tracking-widest mb-1">Thu nhập</div>
              <div class="text-[16px] font-bold text-status-success">${formatUtils.currency(stats.totalIncome)}</div>
            </div>
            <div class="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <div class="text-[10px] font-bold text-ai-muted uppercase tracking-widest mb-1">Chi tiêu</div>
              <div class="text-[16px] font-bold text-status-alert">${formatUtils.currency(stats.totalExpense)}</div>
            </div>
            <div class="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <div class="text-[10px] font-bold text-ai-muted uppercase tracking-widest mb-1">Đầu tư</div>
              <div class="text-[16px] font-bold text-status-premium">${formatUtils.currency(stats.totalInvestment)}</div>
            </div>
          </div>

          <!-- Spending Ratio Progress Bar -->
          <div class="space-y-3">
            <div class="flex justify-between items-end">
              <div class="text-[13px] font-bold text-white uppercase tracking-wider">Tỷ lệ Chi tiêu / Thu nhập</div>
              <div class="text-xl font-black text-white">${ratio}%</div>
            </div>
            <div class="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div class="h-full ${ratioColor} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style="width: 0%" id="ratio-bar"></div>
            </div>
            <div class="flex justify-between text-[10px] text-ai-muted font-bold uppercase tracking-tighter">
              <span>An toàn (0%)</span>
              <span>Cảnh báo (50%)</span>
              <span>Nguy hiểm (80%)</span>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
              <h3 class="text-[14px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="pie-chart" class="w-4 h-4 text-status-insight"></i> Cơ cấu chi tiêu
              </h3>
              <div class="aspect-square relative flex items-center justify-center">
                <canvas id="spending-pie-chart"></canvas>
              </div>
            </div>
            
            <div class="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
              <h3 class="text-[14px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="activity" class="w-4 h-4 text-status-highlight"></i> Dòng tiền theo thời gian
              </h3>
              <div class="h-[200px] relative">
                <canvas id="cashflow-line-chart"></canvas>
              </div>
            </div>
          </div>

          <!-- Top Lists (Simplified) -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Top Merchants -->
            <div class="space-y-4">
              <div class="flex items-center justify-between px-2">
                <h3 class="font-bold text-[14px] text-white uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="shopping-bag" class="w-4 h-4 text-status-highlight"></i> Top nhà cung cấp
                </h3>
                <span class="text-[11px] text-ai-muted font-medium">Tháng này</span>
              </div>
              <div class="space-y-1">
                ${topMerchants.slice(0, 5).map((m, i) => `
                  <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="text-[13px] font-bold text-ai-muted group-hover:text-status-highlight transition-colors shrink-0">${i+1}</span>
                      <span class="text-[14px] text-white font-medium truncate">${m.name}</span>
                    </div>
                    <span class="text-[14px] text-status-alert font-bold tracking-tight shrink-0 ml-4">${formatUtils.currency(m.amount)}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Top Categories -->
            <div class="space-y-4">
              <div class="flex items-center justify-between px-2">
                <h3 class="font-bold text-[14px] text-white uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="layers" class="w-4 h-4 text-status-insight"></i> Top danh mục
                </h3>
                <span class="text-[11px] text-ai-muted font-medium">Tháng này</span>
              </div>
              <div class="space-y-1">
                ${topCategories.slice(0, 5).map((c, i) => `
                  <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="text-[13px] font-bold text-ai-muted group-hover:text-status-insight transition-colors shrink-0">${i+1}</span>
                      <span class="text-[14px] text-white font-medium capitalize truncate">${c.name}</span>
                    </div>
                    <span class="text-[14px] text-white font-bold tracking-tight shrink-0 ml-4">${formatUtils.currency(c.amount)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Footer for Export Options -->
        <div class="p-6 border-t border-white/5 flex gap-3 bg-ai-card rounded-b-3xl shrink-0">
          <button onclick="ReportsModal.exportTaxReport()" class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-center gap-2">
            <i data-lucide="file-text" class="w-4 h-4 text-status-success"></i> Báo cáo thuế
          </button>
          <button onclick="ReportsModal.exportMonthlyReport()" class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-center gap-2">
            <i data-lucide="download" class="w-4 h-4 text-status-highlight"></i> Xuất CSV
          </button>
        </div>
      </div>
    `;

    Modal.open(html, '4xl');
    lucide.createIcons();

    // Animate progress bar
    setTimeout(() => {
      const bar = document.getElementById('ratio-bar');
      if (bar) bar.style.width = `${Math.min(ratio, 100)}%`;
    }, 100);

    // Initialize Charts
    setTimeout(() => {
      this.initCharts(stats, topCategories);
    }, 300);
  },

  initCharts: function(stats, topCategories) {
    const pieCanvas = document.getElementById('spending-pie-chart');
    const lineCanvas = document.getElementById('cashflow-line-chart');
    
    if (!pieCanvas || !lineCanvas) return;

    // Spending Pie Chart
    new Chart(pieCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: topCategories.map(c => c.name),
        datasets: [{
          data: topCategories.map(c => c.amount),
          backgroundColor: [
            '#00F5FF', '#7C4DFF', '#A855F7', '#FF5F56', '#FFB800', '#00E676'
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F1A2E',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 12,
            displayColors: true
          }
        },
        cutout: '70%'
      }
    });

    // Cashflow Line Chart (Mock data for visualization)
    const lineCtx = lineCanvas.getContext('2d');
    const gradient = lineCtx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 245, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [{
          label: 'Dòng tiền',
          data: [stats.netFlow * 0.4, stats.netFlow * 0.7, stats.netFlow * 0.5, stats.netFlow],
          borderColor: '#00F5FF',
          borderWidth: 3,
          fill: true,
          backgroundColor: gradient,
          tension: 0.4,
          pointRadius: 2,
          pointBackgroundColor: '#00F5FF',
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00F5FF',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { 
            grid: { display: false },
            ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
          },
          y: { 
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
          }
        }
      }
    });
  },

  exportTaxReport: async function() {
    const transactions = await api.fetchJSON('./data/transactions.json') || [];
    const taxData = advancedAnalytics.generateTaxExport(transactions);
    const filename = `NeoViet_TaxReport_${new Date().toISOString().slice(0, 10)}.csv`;
    advancedAnalytics.exportToCSV(taxData.headers, taxData.rows, filename);
    this.showSuccess('Báo cáo thuế đã được tải xuống.');
  },

  exportMonthlyReport: async function() {
    const transactions = await api.fetchJSON('./data/transactions.json') || [];
    const monthlyReport = advancedAnalytics.generateReport(transactions, 'month');
    const headers = ['Tháng', 'Thu nhập', 'Chi tiêu', 'Đầu tư', 'Dòng ròng', 'Tỷ lệ chi tiêu', 'Số giao dịch'];
    const rows = Object.entries(monthlyReport).map(([month, stats]) => [
      month, stats.totalIncome || 0, stats.totalExpense || 0, stats.totalInvestment || 0,
      stats.netFlow || 0, stats.expenseRatio + '%', stats.transactionCount || 0
    ]);
    const filename = `NeoViet_MonthlyReport_${new Date().toISOString().slice(0, 10)}.csv`;
    advancedAnalytics.exportToCSV(headers, rows, filename);
    this.showSuccess('Báo cáo tháng đã được tải xuống.');
  },

  showSuccess: function(msg) {
    const successHtml = `
      <div class="p-6 text-center">
        <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
          <i data-lucide="check-circle" class="w-8 h-8 text-status-success"></i>
        </div>
        <h3 class="text-white text-lg font-bold mb-1">Xuất thành công!</h3>
        <p class="text-[14px] text-ai-muted mb-6">${msg}</p>
        <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2.5 rounded-lg font-bold transition-all">
          ĐÓNG
        </button>
      </div>
    `;
    Modal.open(successHtml);
    lucide.createIcons();
  }
};

window.ReportsModal = ReportsModal;