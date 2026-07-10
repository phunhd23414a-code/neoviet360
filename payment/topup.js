// neoviet360/payment/topup.js
const TopupPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render()}
          <h2 class="text-xl font-bold text-white tracking-wide">Nạp Tiền Điện Thoại</h2>
        </div>
        
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
              <div class="grid grid-cols-3 gap-4" id="topup-options">
                ${[50, 100, 200, 300, 500].map((val, idx) => `
                  <div class="topup-item layer-tertiary p-4 rounded-xl text-center cursor-pointer hover:border-status-highlight/50 transition-colors border ${idx === 1 ? 'border-status-highlight bg-status-highlight/10 active' : 'border-transparent'}" data-amount="${val}">
                    <div class="text-white font-bold">${val}.000 ₫</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <button id="btn-submit-topup" type="button" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] flex justify-center items-center gap-2 mt-4">
              XÁC NHẬN NẠP TIỀN
            </button>
          </form>
        </div>
      </div>
    `;
    lucide.createIcons();
    TopupPage.bindEvents();
  },

  bindEvents: () => {
    const options = document.querySelectorAll('.topup-item');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        options.forEach(o => {
          o.classList.remove('border-status-highlight', 'bg-status-highlight/10', 'active');
          o.classList.add('border-transparent');
        });
        const current = e.currentTarget;
        current.classList.remove('border-transparent');
        current.classList.add('border-status-highlight', 'bg-status-highlight/10', 'active');
      });
    });

    const btnSubmit = document.getElementById('btn-submit-topup');
    btnSubmit.addEventListener('click', async () => {
      const activeOpt = document.querySelector('.topup-item.active');
      const amount = activeOpt ? activeOpt.getAttribute('data-amount') : '100';

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> ĐANG XỬ LÝ...';
      lucide.createIcons();

      try {
        if (state.accounts.length === 0) {
          state.accounts = await api.accounts.list();
        }

        const sourceAccount = state.accounts.find((acc) => acc.currency === 'VND') || state.accounts[0];
        if (!sourceAccount?.id) {
          throw new Error('Không tìm thấy tài khoản nguồn để nạp tiền');
        }

        await api.topup.create({
          phoneNumber: auth.getUser()?.phone || '',
          amount: parseInt(amount, 10) * 1000,
          accountId: sourceAccount.id,
          provider: 'mobile'
        });

        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="check" class="w-8 h-8 text-status-success"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Nạp Tiền Thành Công</h3>
            <p class="text-[14px] text-ai-muted">Bạn đã nạp thành công ${amount}.000 ₫ vào số điện thoại.</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close(); router.navigate('dashboard');" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              VỀ TRANG CHỦ
            </button>
          </div>
        `);
        lucide.createIcons();
      } catch (error) {
        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Nạp Tiền Thất Bại</h3>
            <p class="text-[14px] text-ai-muted">${error.message || 'Không thể thực hiện nạp tiền lúc này.'}</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÃ HIỂU
            </button>
          </div>
        `);
        lucide.createIcons();
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'XÁC NHẬN NẠP TIỀN';
      }
    });
  }
};