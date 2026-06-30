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
              <button id="btn-ewallet-topup" class="flex-1 bg-status-warning/20 hover:bg-status-warning/30 text-status-warning border border-status-warning/40 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,184,0,0.1)]">Nạp Tiền</button>
              <button id="btn-ewallet-withdraw" class="flex-1 layer-tertiary text-white py-3 rounded-xl font-bold transition-all hover:border-white/20">Rút Tiền</button>
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
    EwalletPage.bindEvents();
  },

  bindEvents: () => {
    document.getElementById('btn-ewallet-topup')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-ewallet-topup');
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> ĐANG XỬ LÝ...';
      
      const topupAmount = Math.floor(Math.random() * 5000000) + 500000;

      try {
        await api.payments.ewallet({
          amount: topupAmount,
          action: "TOPUP",
          accountId: state.accounts?.[0]?.id
        });

        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="check-circle" class="w-8 h-8 text-status-success"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Nạp Tiền Ví Thành Công</h3>
            <p class="text-[14px] text-ai-muted">Bạn đã nạp thành công ${formatUtils.currency(topupAmount, 'VND')} vào ví điện tử.</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close();" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÓNG
            </button>
          </div>
        `);
      } catch (error) {
        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Nạp Tiền Ví Thất Bại</h3>
            <p class="text-[14px] text-ai-muted">${error.message || 'Không thể nạp tiền ví lúc này.'}</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close();" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÓNG
            </button>
          </div>
        `);
      }
      lucide.createIcons();

      btn.disabled = false;
      btn.innerHTML = 'Nạp Tiền';
    });

    document.getElementById('btn-ewallet-withdraw')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-ewallet-withdraw');
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> ĐANG XỬ LÝ...';
      
      const withdrawAmount = Math.floor(Math.random() * 3000000) + 300000;

      try {
        await api.payments.ewallet({
          amount: withdrawAmount,
          action: "WITHDRAW",
          accountId: state.accounts?.[0]?.id
        });

        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="check-circle" class="w-8 h-8 text-status-success"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Rút Tiền Ví Thành Công</h3>
            <p class="text-[14px] text-ai-muted">Bạn đã rút thành công ${formatUtils.currency(withdrawAmount, 'VND')} từ ví điện tử.</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close();" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÓNG
            </button>
          </div>
        `);
      } catch (error) {
        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Rút Tiền Ví Thất Bại</h3>
            <p class="text-[14px] text-ai-muted">${error.message || 'Không thể rút tiền ví lúc này.'}</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close();" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÓNG
            </button>
          </div>
        `);
      }
      lucide.createIcons();

      btn.disabled = false;
      btn.innerHTML = 'Rút Tiền';
    });
  }
};
