// neoviet360/payment/ewallet.js
const EwalletPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <h2 class="text-xl font-bold text-white tracking-wide">Ví NeoViet (VNPAY-E)</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="layer-primary rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[250px]">
            <div class="absolute top-[-50%] right-[-20%] w-[300px] h-[300px] bg-[#FFB800] opacity-20 rounded-full blur-[80px] pointer-events-none"></div>
            <div class="relative z-10">
              <div class="text-ai-muted font-medium text-[13px] uppercase tracking-widest mb-2">Số dư Ví điện tử</div>
              <div class="text-[40px] font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,184,0,0.3)]">2.500.000 ₫</div>
            </div>
            <div class="relative z-10 flex gap-4 mt-8">
              <button class="flex-1 bg-status-warning/20 hover:bg-status-warning/30 text-status-warning border border-status-warning/40 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,184,0,0.1)]">Nạp Tiền</button>
              <button class="flex-1 layer-tertiary text-white py-3 rounded-xl font-bold transition-all hover:border-white/20">Rút Tiền</button>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-6">
            <h3 class="font-bold text-white mb-4 text-[16px]">Liên kết Ngân hàng</h3>
            <div class="layer-tertiary p-4 rounded-xl flex items-center justify-between mb-4 border-status-highlight/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1"><img src="./public/logo.svg" class="w-full h-full object-contain filter brightness-0"></div>
                <div><div class="text-white font-bold text-[14px]">VCB Digibank</div><div class="text-status-highlight text-[11px] font-mono mt-0.5">Đã liên kết</div></div>
              </div>
              <i data-lucide="check-circle" class="w-5 h-5 text-status-highlight"></i>
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};