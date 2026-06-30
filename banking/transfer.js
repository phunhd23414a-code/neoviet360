// neoviet360/banking/transfer.js
const TransferPage = {
  render: async (container) => {
    // Load accounts from backend
    if (state.accounts.length === 0) {
      try {
        state.accounts = await api.accounts.list();
      } catch (e) {
        console.error('Failed to load accounts:', e);
        state.accounts = [];
      }
    }
    const accounts = state.accounts.filter(a => a.currency === 'VND');
    const accOptions = accounts.map(a => `<option value="${a.id}">${a.name} - ${formatUtils.currency(a.balance, a.currency)}</option>`).join('');

    // Mock dữ liệu danh bạ người thụ hưởng
    const savedContacts = [
      { id: 'c1', name: 'Mẹ', account: '0011002233445', bank: 'Vietcombank', avatar: 'https://ui-avatars.com/api/?name=Me&background=FF5F56&color=fff' },
      { id: 'c2', name: 'Tech Co.', account: '1903123456789', bank: 'Techcombank', avatar: 'https://ui-avatars.com/api/?name=TC&background=00BCD4&color=fff' },
      { id: 'c3', name: 'Chủ nhà trọ', account: '1012345678', bank: 'SHB', avatar: 'https://ui-avatars.com/api/?name=CN&background=A855F7&color=fff' },
      { id: 'c4', name: 'Em gái', account: '987654321', bank: 'MBBank', avatar: 'https://ui-avatars.com/api/?name=EG&background=00E676&color=fff' },
      { id: 'c5', name: 'Đóng học phí', account: '0909090909', bank: 'BIDV', avatar: 'https://ui-avatars.com/api/?name=HP&background=FFB800&color=fff' }
    ];

    const contactsHtml = savedContacts.map(c => `
      <div onclick="document.getElementById('tf-target').value = '${c.account}'; document.getElementById('tf-target-name').textContent = 'Người nhận: ${c.name} - ${c.bank}'; document.getElementById('tf-target-name').classList.remove('hidden');" 
           class="flex flex-col items-center gap-2 cursor-pointer min-w-[72px] group">
        <img src="${c.avatar}" class="w-12 h-12 rounded-full border border-white/10 group-hover:border-status-highlight group-hover:scale-105 transition-all shadow-md">
        <span class="text-[11px] text-ai-muted group-hover:text-white text-center whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">${c.name}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-2xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Chuyển tiền</h2>
        </div>

        <div id="step-form" class="layer-primary rounded-3xl p-6 md:p-8 block">
          
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <label class="block text-[12px] font-mono text-ai-muted uppercase tracking-widest">Danh bạ thụ hưởng</label>
              <button class="text-status-highlight text-[12px] font-medium flex items-center gap-1 hover:underline">
                <i data-lucide="users" class="w-3 h-3"></i> Quản lý
              </button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-2 native-scrollbar">
               <div class="flex flex-col items-center gap-2 cursor-pointer min-w-[72px] group">
                  <div class="w-12 h-12 rounded-full border border-dashed border-white/30 flex items-center justify-center text-white/50 group-hover:border-status-highlight group-hover:text-status-highlight transition-colors">
                    <i data-lucide="search" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[11px] text-ai-muted group-hover:text-white">Tìm kiếm</span>
               </div>
               ${contactsHtml}
            </div>
          </div>

          <form id="transfer-form" class="space-y-6">
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Từ tài khoản</label>
              <select id="tf-source" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-status-highlight/50 transition-colors appearance-none">
                ${accOptions}
              </select>
            </div>
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Số tài khoản / Thẻ người nhận</label>
              <input type="text" id="tf-target" placeholder="Nhập số tài khoản hoặc tên người dùng" required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ai-muted/50 outline-none focus:border-status-highlight/50 transition-colors">
              <div id="tf-target-name" class="hidden mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-status-success/10 border border-status-success/20 text-[12px] text-status-success font-medium ml-1"></div>
            </div>
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Số tiền (VND)</label>
              <div class="relative">
                <input type="number" id="tf-amount" placeholder="0" required min="1000"
                       class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-status-highlight placeholder-ai-muted/30 outline-none focus:border-status-highlight/50 transition-colors">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-ai-muted font-bold">VND</div>
              </div>
            </div>
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Nội dung chuyển khoản</label>
              <input type="text" id="tf-note" value="${window.auth?.getUser()?.fullName || 'Khach hang'} chuyen tien" required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50 transition-colors">
            </div>
            <button type="submit" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold tracking-wide transition-all mt-4">
              TIẾP TỤC
            </button>
          </form>
        </div>

        <div id="step-confirm" class="layer-primary rounded-3xl p-6 md:p-8 hidden">
          <h3 class="text-white text-lg font-bold mb-6 text-center">Xác nhận giao dịch</h3>
          <div class="space-y-4 mb-8 bg-ai-surface p-6 rounded-2xl border border-white/5">
            <div class="flex justify-between border-b border-white/10 pb-3">
              <span class="text-ai-muted text-sm">Tài khoản nhận</span>
              <span id="conf-target" class="text-white font-semibold"></span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-3">
              <span class="text-ai-muted text-sm">Người nhận</span>
              <span id="conf-target-name" class="text-status-success font-semibold"></span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-3">
              <span class="text-ai-muted text-sm">Số tiền</span>
              <span id="conf-amount" class="text-status-highlight font-bold text-lg"></span>
            </div>
            <div class="flex justify-between border-b border-white/10 pb-3">
              <span class="text-ai-muted text-sm">Phí giao dịch</span>
              <span class="text-status-success font-semibold">Miễn phí</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-ai-muted text-sm">Nội dung</span>
              <span id="conf-note" class="text-white font-medium text-right max-w-[60%] truncate"></span>
            </div>
          </div>
          <div class="flex gap-4">
            <button id="btn-back-confirm" class="w-1/3 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-semibold transition-colors">Hủy</button>
            <button id="btn-submit-confirm" class="w-2/3 bg-status-highlight text-black py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)]">Xác nhận</button>
          </div>
        </div>

        <div id="step-otp" class="layer-primary rounded-3xl p-6 md:p-8 hidden text-center">
          <div class="w-16 h-16 bg-status-highlight/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-status-highlight/50">
            <i data-lucide="shield-check" class="w-8 h-8 text-status-highlight"></i>
          </div>
          <h3 class="text-white text-xl font-bold mb-2">Xác thực bảo mật</h3>
          <p class="text-ai-muted text-sm mb-8">Vui lòng nhập mã Smart OTP để hoàn tất giao dịch. <br/>(Mã thử nghiệm: <b class="text-white">123456</b>)</p>
          
          <input type="text" id="tf-otp" maxlength="6" autocomplete="off"
                 class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-center text-3xl tracking-[0.5em] text-white outline-none focus:border-status-highlight/50 transition-colors" placeholder="------">
          <p id="otp-error" class="text-status-alert text-sm font-medium mt-3 hidden">Mã OTP không hợp lệ, vui lòng thử lại!</p>
          
          <button id="btn-verify-otp" class="w-full bg-status-highlight text-black py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)] mt-8 flex justify-center items-center gap-2">
            XÁC THỰC & CHUYỂN TIỀN
          </button>
        </div>

      </div>
    `;
    lucide.createIcons();
    TransferPage.bindEvents(accounts);
  },

  bindEvents: (accounts) => {
    const stepForm = document.getElementById('step-form');
    const stepConfirm = document.getElementById('step-confirm');
    const stepOtp = document.getElementById('step-otp');

    let transferData = {};

    document.getElementById('transfer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const sourceId = document.getElementById('tf-source').value;
      const amount = parseFloat(document.getElementById('tf-amount').value);
      
      const sourceAcc = accounts.find(a => a.id === sourceId);
      if (sourceAcc.balance < amount) {
        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Số dư không đủ</h3>
            <p class="text-[14px] text-ai-muted">Tài khoản nguồn không đủ số dư để thực hiện giao dịch này.</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÃ HIỂU
            </button>
          </div>
        `);
        lucide.createIcons();
        return;
      }

      // Đẩy dữ liệu ra màn hình Confirm
      const targetStr = document.getElementById('tf-target').value;
      const targetNameEl = document.getElementById('tf-target-name');
      const targetDisplayName = targetNameEl.classList.contains('hidden') ? 'Người nhận chưa xác định' : targetNameEl.textContent.replace('Người nhận: ', '');

      transferData = {
        sourceId: sourceId,
        sourceAcc: sourceAcc,
        targetStr: targetStr,
        merchantName: targetDisplayName,
        amount: amount,
        note: document.getElementById('tf-note').value
      };

      document.getElementById('conf-target').textContent = transferData.targetStr;
      document.getElementById('conf-target-name').textContent = transferData.merchantName;
      document.getElementById('conf-amount').textContent = formatUtils.currency(transferData.amount, 'VND');
      document.getElementById('conf-note').textContent = transferData.note;

      stepForm.classList.add('hidden');
      stepConfirm.classList.remove('hidden');
    });

    document.getElementById('btn-back-confirm').addEventListener('click', () => {
      stepConfirm.classList.add('hidden');
      stepForm.classList.remove('hidden');
    });

    document.getElementById('btn-submit-confirm').addEventListener('click', () => {
      stepConfirm.classList.add('hidden');
      stepOtp.classList.remove('hidden');
      document.getElementById('tf-otp').focus();
    });

    document.getElementById('btn-verify-otp').addEventListener('click', async () => {
      const otpVal = document.getElementById('tf-otp').value;
      const errorMsg = document.getElementById('otp-error');
      const btnVerify = document.getElementById('btn-verify-otp');

      if (otpVal !== "123456") {
        errorMsg.classList.remove('hidden');
        return;
      }
      errorMsg.classList.add('hidden');

      btnVerify.disabled = true;
      btnVerify.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG XỬ LÝ GIAO DỊCH...`;
      lucide.createIcons();
      
      try {
        // Call backend API to execute transfer
        await api.transfer.execute({
          fromAccountId: transferData.sourceId,
          toAccountNumber: transferData.targetStr, // Backend will resolve accountNumber to UUID
          amount: transferData.amount,
          description: transferData.note || 'Transfer',
          category: 'TRANSFER'
        });
        
        // Update UI on success
        btnVerify.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> GIAO DỊCH THÀNH CÔNG`;
        btnVerify.classList.replace('bg-status-highlight', 'bg-status-success');
        btnVerify.classList.replace('shadow-[0_0_15px_rgba(0,245,255,0.4)]', 'shadow-[0_0_15px_rgba(0,230,118,0.4)]');
        lucide.createIcons();

        await mockDelay(1500);
        router.navigate('dashboard');
        
      } catch (error) {
        // Handle error
        btnVerify.disabled = false;
        btnVerify.innerHTML = `<i data-lucide="alert-circle" class="w-5 h-5"></i> THỬ LẠI`;
        lucide.createIcons();
        
        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Giao dịch thất bại</h3>
            <p class="text-[14px] text-ai-muted">${error.message || 'Không thể thực hiện chuyển tiền. Vui lòng thử lại.'}</p>
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