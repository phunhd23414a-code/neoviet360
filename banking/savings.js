// neoviet360/banking/savings.js
const SavingsPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('accounts')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Mở Sổ Tiết Kiệm</h2>
        </div>

        <div class="layer-primary rounded-3xl p-6 md:p-8">
          <form id="savings-form" class="space-y-6">
            
            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Số tiền gửi (VND)</label>
              <input type="number" id="sv-amount" placeholder="Nhập số tiền..." required min="1000000"
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-status-success placeholder-ai-muted/30 outline-none focus:border-status-success/50 transition-colors">
            </div>

            <div>
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Kỳ hạn gửi</label>
              <div class="grid grid-cols-4 gap-3">
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors active" data-months="1" data-rate="4.5">
                  <div class="text-white font-bold">1 Tháng</div><div class="text-status-success text-xs">4.5%/năm</div>
                </div>
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors" data-months="3" data-rate="5.0">
                  <div class="text-white font-bold">3 Tháng</div><div class="text-status-success text-xs">5.0%/năm</div>
                </div>
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors" data-months="6" data-rate="6.0">
                  <div class="text-white font-bold">6 Tháng</div><div class="text-status-success text-xs">6.0%/năm</div>
                </div>
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors" data-months="12" data-rate="7.0">
                  <div class="text-white font-bold">12 Tháng</div><div class="text-status-success text-xs">7.0%/năm</div>
                </div>
              </div>
            </div>

            <div class="layer-tertiary p-5 rounded-xl border border-status-success/20 bg-status-success/5">
              <div class="flex justify-between mb-2"><span class="text-ai-muted text-sm">Lãi suất:</span><span id="sv-rate-display" class="text-white font-bold">4.5% / năm</span></div>
              <div class="flex justify-between mb-2"><span class="text-ai-muted text-sm">Tiền lãi dự kiến:</span><span id="sv-interest" class="text-status-success font-bold">+0 VND</span></div>
              <div class="flex justify-between border-t border-white/10 pt-2 mt-2"><span class="text-ai-muted text-sm">Tổng gốc + lãi:</span><span id="sv-total" class="text-status-highlight font-bold">0 VND</span></div>
            </div>

            <button type="submit" id="btn-savings" class="w-full bg-status-success/20 hover:bg-status-success/30 text-status-success border border-status-success/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,230,118,0.1)] hover:shadow-[0_0_25px_rgba(0,230,118,0.3)] mt-4">
              XÁC NHẬN MỞ SỔ
            </button>
          </form>
        </div>
      </div>
    `;
    lucide.createIcons();
    SavingsPage.bindEvents();
  },

  bindEvents: () => {
    let currentRate = 4.5;
    let currentMonths = 1;
    const inputAmount = document.getElementById('sv-amount');
    
    // Logic tính lãi suất real-time
    const calculate = () => {
      const amount = parseFloat(inputAmount.value) || 0;
      const interest = (amount * (currentRate / 100) * (currentMonths * 30)) / 365;
      document.getElementById('sv-interest').innerText = `+${formatUtils.currency(Math.round(interest), 'VND')}`;
      document.getElementById('sv-total').innerText = formatUtils.currency(Math.round(amount + interest), 'VND');
    };

    // Bắt sự kiện chọn kỳ hạn
    document.querySelectorAll('.term-box').forEach(box => {
      box.addEventListener('click', (e) => {
        document.querySelectorAll('.term-box').forEach(b => {
          b.classList.remove('border-status-success', 'bg-status-success/10');
          b.classList.add('border-white/10');
        });
        const target = e.currentTarget;
        target.classList.remove('border-white/10');
        target.classList.add('border-status-success', 'bg-status-success/10');
        
        currentRate = parseFloat(target.dataset.rate);
        currentMonths = parseInt(target.dataset.months);
        document.getElementById('sv-rate-display').innerText = `${currentRate}% / năm`;
        calculate();
      });
    });

    inputAmount.addEventListener('input', calculate);
    
    // Logic Submit
    document.getElementById('savings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-savings');
      btn.disabled = true;
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG KHỞI TẠO HỢP ĐỒNG...`;
      lucide.createIcons();
      
      await mockDelay(1500);
      alert("Đã mở sổ tiết kiệm thành công (Mock)!");
      router.navigate('accounts');
    });
  }
};