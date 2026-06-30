// neoviet360/banking/accounts.js
const AccountsPage = {
  render: async (container) => {
    if (state.accounts.length === 0) {
      state.accounts = await api.fetchJSON('./data/accounts.json') || [];
    }
    const mainAcc = state.accounts.find(a => a.isDefault) || state.accounts[0];

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <h2 class="text-xl font-bold text-white tracking-wide">Data_Nodes (Quản lý Tài khoản)</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="card-3d-wrap h-[220px] w-full max-w-[380px] mx-auto cursor-pointer">
            <div class="card-3d-inner relative w-full h-full">
              <div class="card-front absolute w-full h-full rounded-2xl p-6 flex flex-col justify-between" 
                   style="background: linear-gradient(135deg, ${mainAcc.color} 0%, #0F1A2E 100%); border: 1px solid rgba(255,255,255,0.1);">
                <div class="flex justify-between items-start">
                  <i data-lucide="contact" class="w-8 h-8 text-white/80"></i>
                  <img src="./public/logo.svg" class="h-5 opacity-80 filter brightness-0 invert">
                </div>
                <div>
                  <div class="text-[22px] font-mono tracking-[0.15em] text-white/90 mb-2 drop-shadow-md">
                    ${formatUtils.maskAccount(mainAcc.accountNumber)}
                  </div>
                  <div class="flex justify-between items-end">
                    <div class="uppercase text-[12px] font-medium text-white/70 tracking-widest">${auth.getUser()?.fullName}</div>
                    <div class="uppercase text-[14px] font-bold text-white">DEBIT</div>
                  </div>
                </div>
              </div>
              <div class="card-back absolute w-full h-full rounded-2xl bg-[#0F1A2E] border border-white/10 flex flex-col">
                <div class="w-full h-10 bg-black mt-6"></div>
                <div class="px-6 py-4 flex justify-end">
                  <div class="bg-white text-black font-mono px-3 py-1 text-sm rounded">CVV: ***</div>
                </div>
              </div>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-6 flex flex-col justify-center">
            <div class="text-ai-muted text-sm font-medium mb-1">Số dư khả dụng</div>
            <div class="text-3xl font-bold text-status-highlight mb-6">${formatUtils.currency(mainAcc.balance, mainAcc.currency)}</div>
            
            <div class="space-y-3">
              <button onclick="router.navigate('transfer')" class="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                <div class="flex items-center gap-3"><i data-lucide="send" class="w-5 h-5 text-status-highlight"></i><span class="text-white font-medium">Chuyển tiền</span></div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted"></i>
              </button>
              <button onclick="router.navigate('savings')" class="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                <div class="flex items-center gap-3"><i data-lucide="piggy-bank" class="w-5 h-5 text-status-success"></i><span class="text-white font-medium">Gửi tiết kiệm</span></div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-ai-muted"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};