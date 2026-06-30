// neoviet360/global/fx-exchange.js
const FxExchangePage = {
  // 1. GẮN THÊM: Biến lưu tỷ giá để hàm tính toán bên dưới có thể dùng chung
  currentRates: null,

  render: async (container) => {
    const fxData = await api.fetchJSON('./data/fx-rates.json');
    const rates = fxData?.rates || { USD: 0.0000393, EUR: 0.0000361 };
    
    // Lưu tỷ giá vào biến dùng chung
    FxExchangePage.currentRates = rates;
    
    const rateHtml = Object.keys(rates).map(currency => `
      <div onclick="FxExchangePage.selectCurrency('${currency}')" class="layer-tertiary p-4 rounded-2xl flex justify-between items-center group cursor-pointer border border-transparent hover:border-status-highlight/50 transition-all">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-[12px] group-hover:bg-status-highlight/10 group-hover:text-status-highlight transition-colors">${currency}</div>
          <div class="text-white font-bold text-[15px]">${currency}/VND</div>
        </div>
        <div class="text-right">
          <div class="text-white font-bold text-[15px]">${formatUtils.currency(1 / rates[currency], 'VND').replace('VND','₫')}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <h2 class="text-xl font-bold text-white tracking-wide mb-8">Chuyển đổi ngoại tệ</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 class="text-white font-bold mb-4 text-[16px]">Quy Đổi Nhanh (0% Phí)</h3>
              <div class="space-y-4">
                <div class="bg-ai-surface border border-white/10 rounded-xl p-4">
                  <div class="text-ai-muted text-[11px] mb-1 uppercase tracking-widest">Từ (VND)</div>
                  <input type="number" id="fx-send-amount" value="1000000" oninput="FxExchangePage.calculate()" class="w-full bg-transparent text-2xl font-bold text-white outline-none">
                </div>
                <div class="flex justify-center -my-2 relative z-10"><div class="w-8 h-8 rounded-full bg-status-highlight text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.5)]"><i data-lucide="arrow-down" class="w-4 h-4"></i></div></div>
                <div class="bg-ai-surface border border-white/10 rounded-xl p-4">
                  <div class="flex justify-between items-center mb-1">
                    <select id="fx-target-currency" onchange="FxExchangePage.calculate()" class="bg-transparent text-ai-muted text-[11px] uppercase tracking-widest outline-none cursor-pointer">
                      ${Object.keys(rates).map(cur => `<option value="${cur}">Nhận (${cur})</option>`).join('')}
                    </select>
                    <div id="fx-live-rate" class="text-status-success text-[11px] font-bold">Tỷ giá: Đang tải...</div>
                  </div>
                  <input type="text" id="fx-receive-amount" readonly class="w-full bg-transparent text-2xl font-bold text-status-success outline-none pointer-events-none">
                </div>
              </div>
            </div>
            
            <button onclick="FxExchangePage.confirm()" id="btn-fx-confirm" class="w-full bg-status-highlight hover:bg-status-highlight/90 text-black py-4 rounded-xl font-bold text-[15px] transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)] mt-6 flex items-center justify-center gap-2">
              XÁC NHẬN CHUYỂN ĐỔI
            </button>
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
    
    // Gọi hàm tính toán lần đầu để tự động render số chuẩn thay vì fix cứng
    setTimeout(() => FxExchangePage.calculate(), 100);
  },

  // 2. GẮN THÊM: Hàm tính toán tự động dựa trên file JSON của bạn
  calculate: () => {
    const rates = FxExchangePage.currentRates;
    if (!rates) return;
    
    const sendInput = document.getElementById('fx-send-amount');
    const receiveInput = document.getElementById('fx-receive-amount');
    const targetSelect = document.getElementById('fx-target-currency');
    const ticker = document.getElementById('fx-live-rate');
    
    const currency = targetSelect.value;
    const rateMultiplier = rates[currency]; // Vd: 0.0000393
    const vndToCurrencyRate = 1 / rateMultiplier; // Vd: ~25445
    
    const sendVND = parseFloat(sendInput.value) || 0;
    const receiveAmt = sendVND * rateMultiplier;
    
    const symbol = currency === 'USD' ? '$' : (currency === 'EUR' ? '€' : currency);
    
    ticker.innerText = `Tỷ giá: 1 ${currency} = ${formatUtils.currency(vndToCurrencyRate, 'VND').replace('VND','₫')}`;
    receiveInput.value = `${symbol} ${receiveAmt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  },
  // Hàm xử lý khi người dùng bấm vào một đồng tiền bên cột phải
  selectCurrency: (currency) => {
    const targetSelect = document.getElementById('fx-target-currency');
    if (targetSelect) {
      targetSelect.value = currency; // Tự động đổi dropdown sang đồng tiền tương ứng
      FxExchangePage.calculate();    // Cập nhật lại số tiền tính toán
    }
  },
  // 3. GẮN THÊM: Hàm xử lý nút Xác nhận mở Modal xác nhận
  confirm: async () => {
    const sendInput = document.getElementById('fx-send-amount');
    const targetSelect = document.getElementById('fx-target-currency');
    const rates = FxExchangePage.currentRates;

    const amountVND = parseFloat(sendInput.value) || 0;
    if (amountVND <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    const currency = targetSelect.value;
    const rate = rates[currency];
    const receiveAmt = amountVND * rate;
    const fee = amountVND * 0.005; // 0.5% fee
    const totalVND = amountVND + fee;

    const account = state.accounts.find(a => a.type === 'payment') || state.accounts[0];
    if (account.balance < totalVND) {
      alert('Số dư không đủ để thực hiện giao dịch (bao gồm phí 0.5%)');
      return;
    }

    const html = `
      <div class="p-8 border-b border-white/5">
        <h3 class="text-white text-xl font-bold mb-6 text-center">Xác nhận quy đổi</h3>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-ai-muted text-sm">Số tiền gửi</span>
            <span class="text-white font-bold">${formatUtils.currency(amountVND)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-ai-muted text-sm">Số tiền nhận</span>
            <span class="text-status-success font-bold">${receiveAmt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${currency}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-ai-muted text-sm">Tỷ giá áp dụng</span>
            <span class="text-white font-mono text-xs">1 ${currency} = ${formatUtils.currency(1/rate)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-ai-muted text-sm">Phí dịch vụ (0.5%)</span>
            <span class="text-status-alert font-bold">${formatUtils.currency(fee)}</span>
          </div>
          <div class="pt-4 border-t border-white/5 flex justify-between items-center">
            <span class="text-white font-bold">Tổng thanh toán</span>
            <span class="text-status-highlight text-lg font-black">${formatUtils.currency(totalVND)}</span>
          </div>
        </div>
      </div>
      <div class="p-6 flex gap-4">
        <button onclick="Modal.close()" class="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
          HỦY
        </button>
        <button onclick="FxExchangePage.execute('${currency}', ${amountVND}, ${receiveAmt}, ${fee})" id="btn-fx-execute" class="flex-1 bg-status-highlight text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
          XÁC NHẬN
        </button>
      </div>
    `;
    Modal.open(html);
    lucide.createIcons();
  },

  execute: async (currency, amountVND, receiveAmt, fee) => {
    const btn = document.getElementById('btn-fx-execute');
    btn.disabled = true;
    btn.innerHTML = '<i class="animate-spin" data-lucide="loader"></i> ĐANG XỬ LÝ...';
    lucide.createIcons();

    await mockDelay(2000);

    const totalVND = amountVND + fee;
    const account = state.accounts.find(a => a.type === 'payment') || state.accounts[0];

    // Cập nhật số dư
    state.updateAccountBalance(account.id, account.balance - totalVND);

    // Thêm giao dịch
    state.addTransaction({
      id: `FX${Date.now()}`,
      accountId: account.id,
      type: 'debit',
      amount: totalVND,
      currency: 'VND',
      category: 'fx-exchange',
      merchant: `Đổi ngoại tệ ${currency}`,
      status: 'success',
      timestamp: new Date().toISOString(),
      note: `Đổi ${formatUtils.currency(amountVND)} sang ${receiveAmt.toFixed(2)} ${currency} (Phí: ${formatUtils.currency(fee)})`
    });

    Modal.close();
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'animate__animated animate__fadeInUp glass-layer border-l-4 border-status-success p-4 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto';
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <p class="text-white text-sm font-bold">Giao dịch thành công!</p>
        <p class="text-ai-muted text-xs">Đã đổi thành công sang ${receiveAmt.toFixed(2)} ${currency}</p>
      </div>
    `;
    document.getElementById('toast-container').appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
      toast.classList.replace('animate__fadeInUp', 'animate__fadeOutDown');
      setTimeout(() => toast.remove(), 500);
    }, 3000);

    router.navigate('dashboard');
  }
};

window.FxExchangePage = FxExchangePage;