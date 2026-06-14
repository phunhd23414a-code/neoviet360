// neoviet360/payment/topup.js
const TopupPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <h2 class="text-xl font-bold text-white tracking-wide mb-8">Nạp Tiền Điện Thoại</h2>
        
        <div class="layer-primary rounded-3xl p-8">
          <form id="topup-form" class="space-y-6">
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Số điện thoại</label>
              <div class="relative">
                <i data-lucide="smartphone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ai-muted"></i>
                <input type="text" value="${auth.getUser()?.phone || ''}" required
                       class="w-full bg-ai-surface border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-mono placeholder-ai-muted/30 outline-none focus:border-status-highlight/50 transition-colors">
              </div>
            </div>

            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Mệnh giá</label>
              <div class="grid grid-cols-3 gap-4">
                ${[50, 100, 200, 300, 500].map((val, idx) => `
                  <div class="layer-tertiary p-4 rounded-xl text-center cursor-pointer hover:border-status-highlight/50 transition-colors ${idx === 1 ? 'border-status-highlight bg-status-highlight/10' : ''}">
                    <div class="text-white font-bold">${val}.000 ₫</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <button type="button" onclick="alert('Đã nạp thành công!')" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] flex justify-center items-center gap-2 mt-4">
              XÁC NHẬN NẠP TIỀN
            </button>
          </form>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};