// neoviet360/banking/loan.js
const LoanPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">Credit_Node (Vay Tiêu Dùng)</h2>
            <p class="text-[12px] text-ai-muted mt-1">Duyệt hạn mức tự động bằng AI Scoring</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div class="md:col-span-7 layer-primary rounded-3xl p-6 md:p-8">
            <form id="loan-form" class="space-y-6">
              <div>
                <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Khoản vay yêu cầu (VND)</label>
                <input type="number" id="loan-amount" placeholder="Ví dụ: 50000000" required min="10000000" max="500000000"
                       class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-status-highlight placeholder-ai-muted/30 outline-none focus:border-status-highlight/50 transition-colors">
              </div>

              <div>
                <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Thời hạn vay (Tháng)</label>
                <select id="loan-term" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-white font-semibold outline-none focus:border-status-highlight/50 transition-colors appearance-none cursor-pointer">
                  <option value="6">6 Tháng</option>
                  <option value="12" selected>12 Tháng</option>
                  <option value="24">24 Tháng</option>
                  <option value="36">36 Tháng</option>
                </select>
              </div>

              <button type="submit" id="btn-loan" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] flex justify-center items-center gap-2">
                <i data-lucide="cpu" class="w-5 h-5"></i> CHẠY MÔ HÌNH DUYỆT VAY AI
              </button>
            </form>
          </div>

          <div class="md:col-span-5 layer-secondary rounded-3xl p-6 md:p-8 flex flex-col justify-center">
            <div class="w-12 h-12 rounded-2xl bg-status-premium/10 border border-status-premium/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <i data-lucide="calculator" class="w-6 h-6 text-status-premium"></i>
            </div>
            
            <h3 class="font-bold text-white mb-6 text-[18px]">Dự toán Trả nợ (EMI)</h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center border-b border-white/5 pb-4">
                <span class="text-[13px] text-ai-muted font-medium">Lãi suất (Cố định):</span>
                <span class="text-[14px] font-bold text-white">9.9% / năm</span>
              </div>
              <div class="flex justify-between items-center border-b border-white/5 pb-4">
                <span class="text-[13px] text-ai-muted font-medium">Trả góp mỗi tháng:</span>
                <span id="emi-result" class="text-[20px] font-extrabold text-status-premium drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">0 ₫</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-[13px] text-ai-muted font-medium">Tổng tiền phải trả:</span>
                <span id="total-result" class="text-[14px] font-bold text-white">0 ₫</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
    LoanPage.bindEvents();
  },

  bindEvents: () => {
    const amountInput = document.getElementById('loan-amount');
    const termInput = document.getElementById('loan-term');
    const ratePerYear = 9.9; // Lãi suất 9.9%/năm

    const calculateEMI = () => {
      const P = parseFloat(amountInput.value) || 0;
      const n = parseInt(termInput.value);
      const r = (ratePerYear / 12) / 100; // Lãi suất tháng

      if (P === 0) {
        document.getElementById('emi-result').innerText = '0 ₫';
        document.getElementById('total-result').innerText = '0 ₫';
        return;
      }

      // Công thức tính EMI
      const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = EMI * n;

      document.getElementById('emi-result').innerText = formatUtils.currency(Math.round(EMI), 'VND');
      document.getElementById('total-result').innerText = formatUtils.currency(Math.round(totalPayment), 'VND');
    };

    amountInput.addEventListener('input', calculateEMI);
    termInput.addEventListener('change', calculateEMI);

    document.getElementById('loan-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-loan');
      btn.disabled = true;
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> AI ĐANG PHÂN TÍCH RỦI RO...`;
      lucide.createIcons();
      
      await mockDelay(2000);
      btn.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> ĐÃ PHÊ DUYỆT HẠN MỨC`;
      btn.classList.replace('text-status-highlight', 'text-status-success');
      btn.classList.replace('border-status-highlight/50', 'border-status-success/50');
      btn.classList.replace('bg-status-highlight/20', 'bg-status-success/20');
      lucide.createIcons();
    });
  }
};