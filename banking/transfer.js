// neoviet360/banking/transfer.js
const TransferPage = {
  render: async (container) => {
    // Đọc danh sách tài khoản từ state hoặc JSON
    if (state.accounts.length === 0) {
      state.accounts = await api.fetchJSON('./data/accounts.json') || [];
    }
    const accounts = state.accounts.filter(a => a.currency === 'VND');
    
    // Tạo options dropdown tài khoản nguồn
    const accOptions = accounts.map(a => `<option value="${a.id}">${a.name} - ${formatUtils.currency(a.balance, a.currency)}</option>`).join('');

    container.innerHTML = `
      <div class="max-w-2xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Data_Link (Chuyển tiền)</h2>
        </div>

        <div class="layer-primary rounded-3xl p-6 md:p-8">
          <form id="transfer-form" class="space-y-6">
            
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Source_Node (Từ tài khoản)</label>
              <select id="tf-source" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-status-highlight/50 transition-colors appearance-none">
                ${accOptions}
              </select>
            </div>

            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Target_Address (Số tài khoản/Thẻ)</label>
              <input type="text" id="tf-target" placeholder="Nhập số tài khoản hoặc tên người dùng" required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ai-muted/50 outline-none focus:border-status-highlight/50 transition-colors">
            </div>

            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Amount (Số tiền - VND)</label>
              <div class="relative">
                <input type="number" id="tf-amount" placeholder="0" required min="1000"
                       class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-status-highlight placeholder-ai-muted/30 outline-none focus:border-status-highlight/50 transition-colors">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-ai-muted font-bold">VND</div>
              </div>
            </div>

            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Message (Nội dung)</label>
              <input type="text" id="tf-note" value="${auth.getUser()?.fullName} chuyen tien" required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-highlight/50 transition-colors">
            </div>

            <button type="submit" id="btn-transfer" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] mt-4 flex justify-center items-center gap-2">
              <i data-lucide="send" class="w-5 h-5"></i> THỰC THI GIAO DỊCH
            </button>
          </form>
        </div>
      </div>
    `;
    lucide.createIcons();
    TransferPage.bindEvents(accounts);
  },

  bindEvents: (accounts) => {
    document.getElementById('transfer-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-transfer');
      const sourceId = document.getElementById('tf-source').value;
      const targetStr = document.getElementById('tf-target').value;
      const amount = parseFloat(document.getElementById('tf-amount').value);
      const note = document.getElementById('tf-note').value;

      // Tìm tài khoản nguồn để check số dư
      const sourceAcc = accounts.find(a => a.id === sourceId);
      if (sourceAcc.balance < amount) {
        alert("CẢNH BÁO: Số dư không đủ để thực thi.");
        return;
      }

      // UX Loading
      btn.disabled = true;
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG MÃ HÓA KÊNH TRUYỀN...`;
      lucide.createIcons();
      
      await mockDelay(1200);

      // Cập nhật State: Trừ tiền
      sourceAcc.balance -= amount;
      
      // Cập nhật State: Thêm giao dịch vào lịch sử
      const newTxn = {
        id: "TXN-" + Date.now(),
        accountId: sourceId,
        type: "debit",
        amount: amount,
        currency: "VND",
        category: "transfer",
        merchant: targetStr,
        status: "success",
        timestamp: new Date().toISOString(),
        note: note
      };
      
      // Nếu chưa có giao dịch trong state, fetch rồi mới push
      if (state.transactions.length === 0) {
        state.transactions = await api.fetchJSON('./data/transactions.json') || [];
      }
      state.transactions.unshift(newTxn); // Thêm lên đầu

      btn.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> GIAO DỊCH THÀNH CÔNG`;
      btn.classList.replace('text-status-highlight', 'text-status-success');
      btn.classList.replace('border-status-highlight/50', 'border-status-success/50');
      lucide.createIcons();

      await mockDelay(1000);
      router.navigate('dashboard');
    });
  }
};