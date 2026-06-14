// neoviet360/global/fx-exchange.js
const FxExchangePage = {
  render: async (container) => {
    const fxData = await api.fetchJSON('./data/fx-rates.json');
    const rates = fxData?.rates || { USD: 0.0000393, EUR: 0.0000361 };
    
    const rateHtml = Object.keys(rates).map(currency => `
      <div class="layer-tertiary p-4 rounded-2xl flex justify-between items-center group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-[12px]">${currency}</div>
          <div class="text-white font-bold text-[15px]">${currency}/VND</div>
        </div>
        <div class="text-right">
          <div class="text-white font-bold text-[15px]">${formatUtils.currency(1 / rates[currency], 'VND').replace('VND','₫')}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <h2 class="text-xl font-bold text-white tracking-wide mb-8">Tỷ Giá Ngoại Tệ (Real-time FX)</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="layer-primary rounded-3xl p-6">
            <h3 class="text-white font-bold mb-4 text-[16px]">Quy Đổi Nhanh (0% Phí)</h3>
            <div class="space-y-4">
              <div class="bg-ai-surface border border-white/10 rounded-xl p-4">
                <div class="text-ai-muted text-[11px] mb-1 uppercase tracking-widest">Từ (VND)</div>
                <input type="number" value="1000000" class="w-full bg-transparent text-2xl font-bold text-white outline-none">
              </div>
              <div class="flex justify-center -my-2 relative z-10"><div class="w-8 h-8 rounded-full bg-status-highlight text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.5)]"><i data-lucide="arrow-down" class="w-4 h-4"></i></div></div>
              <div class="bg-ai-surface border border-white/10 rounded-xl p-4">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-ai-muted text-[11px] uppercase tracking-widest">Nhận (USD)</div>
                  <div class="text-status-success text-[11px] font-bold">Tỷ giá: 1 USD = 25,445 ₫</div>
                </div>
                <input type="text" value="$ 39.30" readonly class="w-full bg-transparent text-2xl font-bold text-status-success outline-none">
              </div>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-6">
            <h3 class="text-white font-bold mb-4 text-[16px]">Bảng Giá Liên Ngân Hàng</h3>
            <div class="space-y-3">
              ${rateHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};