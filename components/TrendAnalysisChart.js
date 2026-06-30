// neoviet360/components/TrendAnalysisChart.js
// Redesigned Modern Fintech UI for Spending Trends

const TrendAnalysisChart = {
  open: async function() {
    // Force clear cache for transactions to ensure latest data from JSON is loaded
    api.clearPersistedJSON('./data/transactions.json');
    const transactions = await api.fetchJSON('./data/transactions.json') || [];
    
    if (transactions.length === 0) {
      Modal.open('<div class="p-10 text-center text-ai-muted">Không có dữ liệu giao dịch.</div>');
      return;
    }

    const trends = advancedAnalytics.calculateCategoryTrends(transactions);
    const monthlyReport = advancedAnalytics.generateReport(transactions, 'month');
    const dailyTrend = advancedAnalytics.getDailyTrend(transactions, 30);
    
    const months = Object.keys(monthlyReport);
    const latestMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    const html = `
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-ai-card z-10 rounded-t-3xl shrink-0">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">Xu hướng chi tiêu</h2>
            <p class="text-[13px] text-ai-muted mt-0.5">Phân tích biến động danh mục theo thời gian</p>
          </div>
          <button onclick="Modal.close()" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <i data-lucide="x" class="w-5 h-5 text-ai-muted"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <!-- Main Visualization: Overall Trend -->
          <div class="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6">
            <div class="flex justify-between items-start">
              <div>
                <div class="text-[12px] font-bold text-ai-muted uppercase tracking-widest mb-1">Tổng chi tiêu tháng này</div>
                <div class="text-3xl font-black text-white">${formatUtils.currency(monthlyReport[latestMonth]?.totalExpense || 0)}</div>
              </div>
              <div class="text-right">
                <div class="text-[12px] font-bold text-ai-muted uppercase tracking-widest mb-1">Biến động (MoM)</div>
                <div class="flex items-center gap-1 justify-end ${this.getTrendColor(this.calculateMoM(monthlyReport, latestMonth, prevMonth))}">
                  <i data-lucide="${this.calculateMoM(monthlyReport, latestMonth, prevMonth) >= 0 ? 'trending-up' : 'trending-down'}" class="w-4 h-4"></i>
                  <span class="font-bold">${Math.abs(this.calculateMoM(monthlyReport, latestMonth, prevMonth))}%</span>
                </div>
              </div>
            </div>
            
            <div class="h-[250px] w-full relative">
              <canvas id="main-trend-chart"></canvas>
            </div>
          </div>

          <!-- Category Breakdown List -->
          <div class="space-y-4">
            <h3 class="text-[14px] font-bold text-white uppercase tracking-wider flex items-center gap-2 px-2">
              <i data-lucide="list" class="w-4 h-4 text-status-insight"></i> Chi tiết theo danh mục
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${Object.entries(trends).map(([cat, data]) => {
                const mom = data.changePercent;
                const trendColor = mom > 0 ? 'text-status-alert' : 'text-status-success';
                const trendIcon = mom > 0 ? 'trending-up' : 'trending-down';
                
                return `
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                    <div class="flex items-center gap-4 min-w-0">
                      <!-- Category Icon -->
                      <div class="w-12 h-12 rounded-xl bg-ai-surface border border-white/5 flex items-center justify-center shrink-0 group-hover:border-status-highlight/30 transition-colors">
                        <i data-lucide="${this.getCategoryIcon(cat)}" class="w-6 h-6 text-ai-muted group-hover:text-status-highlight transition-colors"></i>
                      </div>
                      
                      <!-- Info -->
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-1">
                          <h4 class="text-[15px] font-bold text-white capitalize truncate">${cat}</h4>
                          <div class="text-right shrink-0 ml-2">
                            <div class="text-[14px] font-bold text-white">${formatUtils.currency(data.currentMonth)}</div>
                            <div class="flex items-center gap-1 justify-end text-[11px] font-bold ${trendColor}">
                              <i data-lucide="${trendIcon}" class="w-3 h-3"></i>
                              ${Math.abs(mom)}%
                            </div>
                          </div>
                        </div>
                        
                        <div class="flex items-center justify-between gap-4">
                          <div class="text-[11px] text-ai-muted font-medium truncate">
                            TB: <span class="text-white">${formatUtils.currency(data.average)}</span>
                          </div>
                          <!-- Mini Sparkline Placeholder -->
                          <div class="w-20 h-6 opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                            <canvas id="sparkline-${cat.replace(/\s+/g, '-')}" class="w-full h-full"></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    Modal.open(html, '4xl');
    lucide.createIcons();

    // Initialize Charts
    setTimeout(() => {
      this.initMainChart(dailyTrend);
      Object.entries(trends).forEach(([cat, data]) => {
        this.initSparkline(cat, data.history);
      });
    }, 300);
  },

  calculateMoM: function(report, current, prev) {
    if (!prev || !report[prev]) return 0;
    const currVal = report[current].totalExpense;
    const prevVal = report[prev].totalExpense;
    if (prevVal === 0) return 0;
    return (((currVal - prevVal) / prevVal) * 100).toFixed(1);
  },

  getTrendColor: function(val) {
    return val > 0 ? 'text-status-alert' : 'text-status-success';
  },

  getCategoryIcon: function(cat) {
    const icons = {
      'food': 'utensils',
      'shopping': 'shopping-cart',
      'transport': 'car',
      'travel': 'plane',
      'entertainment': 'film',
      'health': 'heart-pulse',
      'bill': 'file-text',
      'salary': 'banknote',
      'transfer': 'send',
      'investment': 'trending-up'
    };
    return icons[cat.toLowerCase()] || 'tag';
  },

  initMainChart: function(dailyData) {
    const canvas = document.getElementById('main-trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const labels = Object.keys(dailyData).map(key => {
      const parts = key.split('-');
      return `${parts[2]}/${parts[1]}`;
    });
    const data = Object.values(dailyData);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(124, 77, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(124, 77, 255, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Chi tiêu hàng ngày',
          data: data,
          borderColor: '#7C4DFF',
          borderWidth: 3,
          fill: true,
          backgroundColor: gradient,
          tension: 0.5,
          pointRadius: 4,
          pointBackgroundColor: '#7C4DFF',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F1A2E',
            padding: 12,
            cornerRadius: 12,
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#8B9BB4', font: { size: 10, weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { 
              color: '#8B9BB4', 
              font: { size: 10 },
              callback: (val) => formatUtils.currency(val).split(' ')[0]
            }
          }
        }
      }
    });
  },

  initSparkline: function(cat, history) {
    const canvasId = `sparkline-${cat.replace(/\s+/g, '-')}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = history.map(h => h.amount);
    if (data.length < 2) data.unshift(data[0] || 0); // Ensure at least 2 points

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data: data,
          borderColor: '#00F5FF',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }
};

window.TrendAnalysisChart = TrendAnalysisChart;