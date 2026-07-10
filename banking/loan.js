// neoviet360/banking/loan.js
const LoanPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render()}
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">Vay Tiêu Dùng & Trả Góp (BNPL)</h2>
            <p class="text-[12px] text-ai-muted mt-1">Duyệt hạn mức siêu tốc - Mua trước trả sau</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div class="md:col-span-7 layer-primary rounded-3xl p-6 md:p-8">
            <form id="loan-form" class="space-y-6">
              <div>
                <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Khoản vay yêu cầu (VND)</label>
                <input type="number" id="loan-amount" placeholder="Ví dụ: 50000000" required min="3000000" max="500000000"
                       class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-status-highlight placeholder-ai-muted/30 outline-none focus:border-status-highlight/50 transition-colors">
              </div>

              <div>
                <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Thời hạn vay</label>
                <div class="relative">
                    <select id="loan-term" class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-white font-semibold outline-none focus:border-status-highlight/50 transition-colors appearance-none cursor-pointer">
                      <!-- ĐÃ SỬA: Thêm tùy chọn 3 tháng 0% -->
                      <option value="3">3 Tháng (Trả góp 0% - BNPL)</option>
                      <option value="6">6 Tháng</option>
                      <option value="12" selected>12 Tháng</option>
                      <option value="24">24 Tháng</option>
                      <option value="36">36 Tháng</option>
                    </select>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-ai-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                </div>
              </div>

              <!-- ĐÃ SỬA: Đổi chữ nút bấm cho chuyên nghiệp -->
              <button type="submit" id="btn-loan" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] flex justify-center items-center gap-2">
                <i data-lucide="check-square" class="w-5 h-5"></i> XÁC NHẬN & XÉT DUYỆT
              </button>
            </form>
          </div>

          <div class="md:col-span-5 layer-secondary rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-status-premium/20 blur-3xl rounded-full"></div>
            <div class="w-12 h-12 rounded-2xl bg-status-premium/10 border border-status-premium/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] relative z-10">
              <i data-lucide="calculator" class="w-6 h-6 text-status-premium"></i>
            </div>
            
            <h3 class="font-bold text-white mb-6 text-[18px] relative z-10">Dự toán Trả nợ (EMI)</h3>
            
            <div class="space-y-4 relative z-10">
              <div class="flex justify-between items-center border-b border-white/5 pb-4">
                <span class="text-[13px] text-ai-muted font-medium">Lãi suất (Cố định):</span>
                <span id="rate-result" class="text-[14px] font-bold text-white">9.9% / năm</span>
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
    const standardRatePerYear = 9.9; 

    const calculateEMI = () => {
      const P = parseFloat(amountInput.value) || 0;
      const n = parseInt(termInput.value);
      let ratePerYear = standardRatePerYear;

      // Logic BNPL 0% lãi suất cho kỳ hạn 3 tháng
      if (n === 3) {
        ratePerYear = 0;
        document.getElementById('rate-result').innerHTML = '<span class="text-status-success font-bold">0% (Ưu đãi BNPL)</span>';
      } else {
        document.getElementById('rate-result').innerText = '9.9% / năm';
      }

      if (P === 0) {
        document.getElementById('emi-result').innerText = '0 ₫';
        document.getElementById('total-result').innerText = '0 ₫';
        return;
      }

      let EMI = 0;
      let totalPayment = 0;

      if (ratePerYear === 0) {
        EMI = P / n; // Chia đều không lãi
        totalPayment = P;
      } else {
        const r = (ratePerYear / 12) / 100;
        EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        totalPayment = EMI * n;
      }

      document.getElementById('emi-result').innerText = formatUtils.currency(Math.round(EMI), 'VND');
      document.getElementById('total-result').innerText = formatUtils.currency(Math.round(totalPayment), 'VND');
    };

    amountInput.addEventListener('input', calculateEMI);
    termInput.addEventListener('change', calculateEMI);

    document.getElementById('loan-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-loan');
      btn.disabled = true;
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG XÉT DUYỆT...`;
      lucide.createIcons();
      
      await mockDelay(2000);
      
      // Dùng Modal hiển thị kết quả thay vì đổi text trên nút bấm
      const html = `
        <div class="p-8 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 left-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-20 h-20 rounded-full bg-status-success/20 border-2 border-status-success/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,230,118,0.2)]">
              <i data-lucide="check-circle" class="w-10 h-10 text-status-success"></i>
          </div>
          <h3 class="text-white text-xl font-bold mb-2">Giải ngân thành công!</h3>
          <p class="text-[14px] text-ai-muted leading-relaxed">Khoản vay của bạn đã được phê duyệt và tiền đã được chuyển vào tài khoản thanh toán.</p>
        </div>
        <div class="p-6">
          <button onclick="Modal.close(); router.navigate('dashboard');" class="w-full bg-status-highlight hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] text-black py-4 rounded-xl font-bold transition-all">
            VỀ TRANG CHỦ
          </button>
        </div>
      `;
      Modal.open(html);
      lucide.createIcons();
      
      setTimeout(() => {
          btn.innerHTML = `<i data-lucide="check-square" class="w-5 h-5"></i> XÁC NHẬN & XÉT DUYỆT`;
          btn.disabled = false;
          lucide.createIcons();
      }, 500);
    });
  }
};