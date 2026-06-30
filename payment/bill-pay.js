// neoviet360/payment/bill-pay.js
const BillPayPage = {
  render: async (container) => {
    const bills = await api.fetchJSON('./data/bills.json') || [];

    const billHtml = bills.map(b => `
      <div class="layer-tertiary p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-status-warning/50 group transition-all">
        <div class="w-12 h-12 rounded-xl glass-layer flex items-center justify-center group-hover:bg-status-warning/20 group-hover:text-status-warning text-ai-muted transition-all">
          <i data-lucide="${b.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="text-white font-semibold text-[14px]">${b.name}</div>
          <div class="text-ai-muted text-[11px] uppercase tracking-widest mt-1">${b.category}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Node_Billing (Hóa Đơn)</h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div class="layer-secondary rounded-3xl p-6 md:p-8">
            <h3 class="text-white font-bold mb-6 text-[16px] uppercase tracking-widest">Cổng Dịch Vụ</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${billHtml}
            </div>
          </div>

          <div class="layer-primary rounded-3xl p-6 md:p-8">
            <h3 class="text-white font-bold mb-6 text-[16px] uppercase tracking-widest">Truy vấn AI</h3>
            
            <form id="bill-form" class="space-y-6">
              <div>
                <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Mã Khách Hàng / Hợp Đồng</label>
                <div class="relative">
                  <i data-lucide="terminal" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ai-muted"></i>
                  <input type="text" placeholder="Ví dụ: PE123456" required
                         class="w-full bg-ai-surface border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-mono placeholder-ai-muted/30 outline-none focus:border-status-warning/50 transition-colors uppercase">
                </div>
              </div>
              <button type="submit" id="btn-search-bill" class="w-full bg-status-warning/10 hover:bg-status-warning/20 text-status-warning border border-status-warning/30 py-4 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,184,0,0.1)]">
                <i data-lucide="search" class="w-5 h-5"></i> QUÉT HÓA ĐƠN
              </button>
            </form>
            
            <div id="bill-result" class="mt-8 hidden animate__animated animate__fadeInUp">
              <div class="p-6 border border-status-alert/30 bg-status-alert/10 rounded-2xl mb-4 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-status-alert/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <div class="text-status-alert text-[11px] font-mono uppercase tracking-widest mb-2 relative z-10 flex items-center gap-2"><div class="w-2 h-2 bg-status-alert rounded-full animate-ping"></div> NỢ CƯỚC CHƯA THANH TOÁN</div>
                <div class="text-white font-extrabold text-[32px] font-mono relative z-10">1.250.000 ₫</div>
                <div class="text-ai-muted text-[13px] mt-2 relative z-10">Kỳ cước: Tháng 6/2026</div>
              </div>

              <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-status-warning/10 flex items-center justify-center text-status-warning">
                    <i data-lucide="calendar-days" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <div class="text-white text-sm font-bold">Thanh toán định kỳ</div>
                    <div class="text-ai-muted text-[11px]">Tự động thanh toán hàng tháng</div>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="recurring-toggle" class="sr-only peer">
                  <div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-status-warning"></div>
                </label>
              </div>

              <button id="btn-pay-bill" class="w-full bg-status-success/20 hover:bg-status-success/30 text-status-success border border-status-success/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,230,118,0.1)] flex justify-center items-center gap-2">
                <i data-lucide="check-circle" class="w-5 h-5"></i> XÁC NHẬN THANH TOÁN
              </button>
            </div>
            
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    BillPayPage.bindEvents();
  },

  bindEvents: () => {
    document.getElementById('bill-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-search-bill');
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG TRUY XUẤT...`;
      lucide.createIcons();
      
      await mockDelay(1200);
      btn.innerHTML = `<i data-lucide="search" class="w-5 h-5"></i> QUÉT LẠI HÓA ĐƠN`;
      lucide.createIcons();
      document.getElementById('bill-result').classList.remove('hidden');
    });

    document.getElementById('btn-pay-bill')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG KHỚP LỆNH...`;
      lucide.createIcons();
      
      try {
        if (state.accounts.length === 0) {
          state.accounts = await api.accounts.list();
        }

        const sourceAccount = state.accounts.find((acc) => acc.currency === 'VND') || state.accounts[0];
        if (!sourceAccount?.id) {
          throw new Error('Không tìm thấy tài khoản thanh toán');
        }

        const isRecurring = document.getElementById('recurring-toggle')?.checked;

        await api.billpay.create({
          billerCode: 'EVN_HCMC',
          customerCode: 'PE123456',
          amount: 1250000,
          accountId: sourceAccount.id,
          recurring: !!isRecurring
        });

        btn.innerHTML = `ĐÃ THANH TOÁN THÀNH CÔNG`;
        setTimeout(() => router.navigate('dashboard'), 1000);
      } catch (error) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="alert-circle" class="w-5 h-5"></i> THỬ LẠI`;
        lucide.createIcons();

        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Thanh toán thất bại</h3>
            <p class="text-[14px] text-ai-muted">${error.message || 'Không thể thanh toán hóa đơn lúc này.'}</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÃ HIỂU
            </button>
          </div>
        `);
        lucide.createIcons();
      }
    });
  }
};