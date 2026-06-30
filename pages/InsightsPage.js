// neoviet360/pages/InsightsPage.js
const InsightsPage = {
  render: async (container) => {
    container.innerHTML = `<div class="flex justify-center py-40"><svg class="animate-spin h-6 w-6 text-ai-muted" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`;
    
    await mockDelay(500);
    const fxData = await api.fetchJSON('./data/fx-rates.json') || { rates: { USD: 0.0000393, EUR: 0.0000361 } };
    const cryptoData = await api.fetchJSON('./data/crypto.json') || [];

    const fxHtml = Object.keys(fxData.rates).slice(0, 3).map(cur => `
      <div class="flex items-center justify-between p-3 layer-tertiary rounded-xl">
        <span class="font-mono font-bold text-white text-[13px]">${cur}/VND</span>
        <span class="font-mono text-status-success font-semibold text-[13px]">${formatUtils.currency(1 / fxData.rates[cur], 'VND').replace('VND','₫')}</span>
      </div>
    `).join('');

    const cryptoHtml = cryptoData.slice(0, 3).map(coin => `
      <div class="flex items-center justify-between p-3 layer-tertiary rounded-xl">
        <span class="font-bold text-white text-[13px]">${coin.name} (${coin.symbol})</span>
        <span class="font-mono text-status-highlight font-bold text-[13px]">$${coin.price_usd.toLocaleString()}</span>
      </div>
    `).join('');

    // Net Worth Calculation
    const netWorthData = await advancedAnalytics.calculateNetWorth(state.accounts, state.transactions);

    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-8">
        <div class="flex justify-between items-start border-b border-white/5 pb-6">
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">Phân tích & Toàn cầu</h2>
            <p class="text-[13px] text-ai-muted mt-1">Dữ liệu thị trường quốc tế kết hợp mô hình phân tích định lượng AI</p>
          </div>
          <div class="flex gap-3">
            <button onclick="InsightsPage.exportData()" class="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2">
              <i data-lucide="download" class="w-4 h-4"></i> Xuất báo cáo
            </button>
            <button onclick="router.navigate('spending')" class="bg-status-highlight/10 hover:bg-status-highlight/20 text-status-highlight border border-status-highlight/30 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2" aria-label="Xem phân tích chi tiêu chi tiết">
              <i data-lucide="pie-chart" class="w-4 h-4" aria-hidden="true"></i> Phân tích chi tiêu
            </button>
          </div>
        </div>

        <!-- Net Worth Card -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Risk Score Card -->
          <div id="risk-score-container" class="layer-primary rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
            <!-- Risk Score will be injected here -->
          </div>

          <div class="md:col-span-2 layer-primary rounded-3xl p-8 relative overflow-hidden border border-white/5">
            <div class="absolute top-0 right-0 w-64 h-64 bg-status-insight/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div class="relative z-10">
              <div class="text-ai-muted text-[12px] font-mono uppercase tracking-widest mb-2">Tổng tài sản ròng (Net Worth)</div>
              <div class="text-white text-4xl font-extrabold mb-6">${formatUtils.currency(netWorthData.netWorth, 'VND')}</div>
              
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <div class="text-ai-muted text-[11px] uppercase mb-1">Tổng tài sản</div>
                  <div class="text-status-success font-bold text-lg">${formatUtils.currency(netWorthData.totalAssets, 'VND')}</div>
                </div>
                <div>
                  <div class="text-ai-muted text-[11px] uppercase mb-1">Tổng nợ</div>
                  <div class="text-status-alert font-bold text-lg">${formatUtils.currency(netWorthData.totalLiabilities, 'VND')}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-white/5 cursor-pointer hover:border-status-success/40 transition-all group" onclick="router.navigate('carbon')" role="button" tabindex="0">
            <div class="w-16 h-16 rounded-full bg-status-success/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="leaf" class="w-8 h-8 text-status-success"></i>
            </div>
            <div class="text-white font-bold mb-1">Carbon Footprint</div>
            <div id="carbon-summary-value" class="text-status-success text-sm font-bold">Đang tính...</div>
            <p class="text-ai-muted text-[11px] mt-2">Theo dõi và bù đắp lượng phát thải từ chi tiêu của bạn.</p>
          </div>
        </div>

        <!-- AI Financial Coach Section -->
        <div class="layer-primary rounded-3xl p-6 flex flex-col justify-between cursor-pointer group hover:border-status-highlight/40 transition-all border border-status-highlight/10" onclick="AICoachModal.open()" role="button" tabindex="0" aria-label="Mở AI Financial Coach">
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-white text-[16px] group-hover:text-status-highlight transition-colors">NeoViet AI Coach</h3>
              <i data-lucide="brain" class="w-5 h-5 text-status-highlight" aria-hidden="true"></i>
            </div>
            <p class="text-ai-muted text-[13px] mb-4">Tư vấn tài chính cá nhân hóa. Phân tích chi tiêu, dự đoán ngân sách và cảnh báo bất thường.</p>
            
            <div id="ai-insights-container" class="space-y-2">
              <!-- AI Insights will be injected here -->
            </div>
          </div>
          <span class="text-[12px] font-semibold text-status-highlight mt-6 flex items-center gap-1">Xem gợi ý <i data-lucide="arrow-right" class="w-3.5 h-3.5" aria-hidden="true"></i></span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-between cursor-pointer group" onclick="router.navigate('fx-exchange')" role="button" tabindex="0" aria-label="Chuyển đổi ngoại tệ">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-white text-[16px] group-hover:text-status-highlight transition-colors">Tỷ giá ngoại tệ</h3>
                <i data-lucide="globe" class="w-5 h-5 text-status-highlight" aria-hidden="true"></i>
              </div>
              <p class="text-ai-muted text-[13px] mb-4">Tỷ giá liên ngân hàng thời gian thực, miễn phí chuyển đổi quy mô quốc tế.</p>
              <div class="space-y-2">${fxHtml}</div>
            </div>
            <span class="text-[12px] font-semibold text-status-highlight mt-6 flex items-center gap-1">Kích hoạt chuyển đổi <i data-lucide="arrow-right" class="w-3.5 h-3.5" aria-hidden="true"></i></span>
          </div>

          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-between cursor-pointer group" onclick="router.navigate('crypto')" role="button" tabindex="0" aria-label="Thị trường tiền điện tử">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-white text-[16px] group-hover:text-status-premium transition-colors">Tài sản tiền điện tử</h3>
                <i data-lucide="coins" class="w-5 h-5 text-status-premium" aria-hidden="true"></i>
              </div>
              <p class="text-ai-muted text-[13px] mb-4">Theo dõi biến động và quản lý ví lưu trữ tài sản số mã hóa đa chuỗi.</p>
              <div class="space-y-2">${cryptoHtml}</div>
            </div>
            <span class="text-[12px] font-semibold text-status-premium mt-6 flex items-center gap-1">Vào thị trường <i data-lucide="arrow-right" class="w-3.5 h-3.5" aria-hidden="true"></i></span>
          </div>

         <div class="layer-secondary rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-white text-[16px]">Phân tích & Báo cáo</h3>
                <i data-lucide="bar-chart-3" class="w-5 h-5 text-status-insight" aria-hidden="true"></i>
              </div>
              <p class="text-ai-muted text-[13px] mb-6">Báo cáo tài chính nâng cao, phân tích xu hướng và xuất dữ liệu sẵn sàng thuế.</p>
              
              <div class="space-y-3">
                <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:border-status-insight/40 transition-colors" onclick="ReportsModal.open()" role="button" tabindex="0" aria-label="Xem báo cáo tài chính">
                  <div class="text-[13px] font-semibold text-white">Báo cáo tài chính</div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i>
                </div>
                <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:border-status-insight/40 transition-colors" onclick="router.navigate('invest')" role="button" tabindex="0" aria-label="Phân tích tài chính HNX30">
                  <div class="text-[13px] font-semibold text-white">Phân tích tài chính HNX30</div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i>
                </div>
                <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:border-status-insight/40 transition-colors" onclick="router.navigate('marketplace')" role="button" tabindex="0" aria-label="Chiến lược cổ phiếu toàn cầu">
                  <div class="text-[13px] font-semibold text-white">Chiến lược cổ phiếu toàn cầu</div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     `;
     lucide.createIcons();

     // Load AI Insights
     InsightsPage.loadAIInsights();
     InsightsPage.renderRiskScore();
     InsightsPage.renderCarbonSummary();
   },

   renderCarbonSummary: () => {
     const el = document.getElementById('carbon-summary-value');
     if (!el) return;

     const transactions = state.transactions || [];
     const now = new Date();
     const currentMonth = now.getMonth();
     const currentYear = now.getFullYear();

     const thisMonthTx = transactions.filter(tx => {
       const d = new Date(tx.timestamp);
       return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
     });

     const carbon = thisMonthTx.reduce((acc, tx) => {
       let factor = 0.05;
       const cat = tx.category.toLowerCase();
       if (cat.includes('transport')) factor = 0.21;
       else if (cat.includes('food')) factor = 0.15;
       else if (cat.includes('shopping')) factor = 0.12;
       return acc + (tx.amount / 1000) * factor;
     }, 0);

     el.innerText = `${carbon.toFixed(1)} kg CO₂e`;
   },

   renderRiskScore: () => {
     const container = document.getElementById('risk-score-container');
     if (!container) return;

     const summary = aiAnalytics.getSummary(state.transactions || [], state.budgets || {});
     const anomalies = summary.anomalies || [];
     const score = Math.min(100, anomalies.length * 25);

     let status = "An toàn";
     let colorClass = "text-status-success";
     let bgClass = "bg-status-success";
     
     if (score > 60) {
       status = "Rủi ro cao";
       colorClass = "text-status-alert";
       bgClass = "bg-status-alert";
     } else if (score > 30) {
       status = "Cần chú ý";
       colorClass = "text-yellow-400";
       bgClass = "bg-yellow-400";
     }

     const anomaliesHtml = anomalies.length > 0 
       ? anomalies.map(a => `
         <div class="flex items-center gap-2 text-[11px] text-ai-muted">
           <i data-lucide="alert-circle" class="w-3 h-3 text-status-alert"></i>
           <span class="truncate">${a.merchant}: ${formatUtils.currency(a.amount, 'VND')}</span>
         </div>
       `).join('')
       : '<div class="text-[11px] text-ai-muted italic">Không phát hiện giao dịch bất thường</div>';

     container.innerHTML = `
       <div>
         <div class="flex justify-between items-center mb-4">
           <h3 class="font-bold text-white text-[15px]">Chỉ số rủi ro AI</h3>
           <i data-lucide="shield-check" class="w-5 h-5 ${colorClass}"></i>
         </div>
         
         <div class="flex items-end gap-2 mb-2">
           <span class="text-3xl font-bold text-white">${score}</span>
           <span class="text-[13px] font-bold ${colorClass} mb-1">${status}</span>
         </div>

         <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
           <div class="h-full ${bgClass} transition-all duration-1000" style="width: ${score}%"></div>
         </div>

         <div class="space-y-2">
           <div class="text-[10px] font-mono text-ai-muted uppercase tracking-wider mb-1">Phát hiện bất thường</div>
           ${anomaliesHtml}
         </div>
       </div>
       
       <div class="mt-6 pt-4 border-t border-white/5">
         <p class="text-[11px] text-ai-muted leading-relaxed">Mô hình AI quét các giao dịch có số tiền lớn bất thường hoặc merchant lạ.</p>
       </div>
     `;
     lucide.createIcons();
   },

   loadAIInsights: () => {
     const container = document.getElementById('ai-insights-container');
     if (!container) return;

     const summary = aiAnalytics.getSummary(state.transactions || [], state.budgets || {});
     const insights = summary.insights || [];

     if (insights.length === 0) {
       container.innerHTML = `
         <div class="p-3 bg-white/5 rounded-xl border border-white/10">
           <div class="text-[12px] text-ai-muted">Chưa có dữ liệu giao dịch để phân tích</div>
         </div>
       `;
       return;
     }

     // Display top 2 insights
     container.innerHTML = insights.slice(0, 2).map(insight => {
       let icon = 'lightbulb';
       let iconColor = 'text-blue-400';

       if (insight.severity === 'warning') {
         icon = 'alert-circle';
         iconColor = 'text-yellow-400';
       } else if (insight.severity === 'alert') {
         icon = 'alert-triangle';
         iconColor = 'text-red-400';
       }

       return `
         <div class="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
           <div class="flex gap-2">
             <i data-lucide="${icon}" class="w-4 h-4 ${iconColor} shrink-0 mt-0.5" aria-hidden="true"></i>
             <div class="flex-1 text-[12px] text-white">${insight.message}</div>
           </div>
         </div>
       `;
     }).join('');

      lucide.createIcons();
    },

    exportData: () => {
      const { headers, rows } = advancedAnalytics.generateTaxExport(state.transactions || []);
      advancedAnalytics.exportToCSV(headers, rows, `NeoViet360_Report_${new Date().toISOString().split('T')[0]}.csv`);
      
      Modal.open(`
        <div class="p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-status-success/20 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="check" class="w-8 h-8 text-status-success"></i>
          </div>
          <h3 class="text-white font-bold text-lg mb-2">Xuất dữ liệu thành công</h3>
          <p class="text-ai-muted text-sm">Báo cáo tài chính đã được tải xuống máy tính của bạn.</p>
          <button onclick="Modal.close()" class="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold mt-6 transition-all">ĐÓNG</button>
        </div>
      `);
      lucide.createIcons();
    }
  };
