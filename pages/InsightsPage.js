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

    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-8">
        <div class="flex justify-between items-start border-b border-white/5 pb-6">
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">Neural_Insights (Toàn cầu & Phân tích)</h2>
            <p class="text-[13px] text-ai-muted mt-1">Dữ liệu thị trường quốc tế kết hợp mô hình phân tích định lượng AI</p>
          </div>
          <button onclick="router.navigate('spending')" class="bg-status-highlight/10 hover:bg-status-highlight/20 text-status-highlight border border-status-highlight/30 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2">
            <i data-lucide="pie-chart" class="w-4 h-4"></i> Phân tích chi tiêu
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-between cursor-pointer group" onclick="router.navigate('fx-exchange')">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-white text-[16px] group-hover:text-status-highlight transition-colors">Revolut FX Engine</h3>
                <i data-lucide="globe" class="w-5 h-5 text-status-highlight"></i>
              </div>
              <p class="text-ai-muted text-[13px] mb-4">Tỷ giá liên ngân hàng thời gian thực, miễn phí chuyển đổi quy mô quốc tế.</p>
              <div class="space-y-2">${fxHtml}</div>
            </div>
            <span class="text-[12px] font-semibold text-status-highlight mt-6 flex items-center gap-1">Kích hoạt chuyển đổi <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
          </div>

          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-between cursor-pointer group" onclick="router.navigate('crypto')">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-white text-[16px] group-hover:text-status-premium transition-colors">Quantum Crypto Assets</h3>
                <i data-lucide="bitcoin" class="w-5 h-5 text-status-premium"></i>
              </div>
              <p class="text-ai-muted text-[13px] mb-4">Theo dõi biến động và quản lý ví lưu trữ tài sản số mã hóa đa chuỗi.</p>
              <div class="space-y-2">${cryptoHtml}</div>
            </div>
            <span class="text-[12px] font-semibold text-status-premium mt-6 flex items-center gap-1">Vào thị trường <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
          </div>

          <div class="layer-secondary rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-white text-[16px]">AI Analytical Engine</h3>
                <i data-lucide="cpu" class="w-5 h-5 text-status-insight"></i>
              </div>
              <p class="text-ai-muted text-[13px] mb-6">Mô hình phân tích nâng cao xử lý dòng chảy vốn và tối ưu hóa danh mục chiến lược.</p>
              
              <div class="space-y-3">
                <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:border-status-insight/40 transition-colors" onclick="router.navigate('invest')">
                  <div class="text-[13px] font-semibold text-white">HNX30 Financial Analytics Engine</div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted"></i>
                </div>
                <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:border-status-insight/40 transition-colors" onclick="router.navigate('marketplace')">
                  <div class="text-[13px] font-semibold text-white">Global Equity Strategy Matrix</div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted"></i>
                </div>
              </div>
            </div>
            <div class="text-[10px] font-mono text-ai-muted/50 tracking-wider text-right mt-4">SYS_MODEL: BETA_ACTIVE</div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};