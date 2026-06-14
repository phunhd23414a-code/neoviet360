// neoviet360/analytics/spending.js
const SpendingPage = {
  render: async (container) => {
    // Đọc lịch sử giao dịch
    if (!state.transactions || state.transactions.length === 0) {
      state.transactions = await api.fetchJSON('./data/transactions.json') || [];
    }
    
    // Lọc các giao dịch chi tiêu (debit)
    const expenses = state.transactions.filter(t => t.type === 'debit');
    
    // Gom nhóm theo danh mục
    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryTotals).map(c => c.toUpperCase());
    const data = Object.values(categoryTotals);
    const totalSpent = data.reduce((a, b) => a + b, 0);

    container.innerHTML = `
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Data_Analytics (Phân Tích Chi Tiêu)</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div class="layer-primary rounded-3xl p-8 flex flex-col items-center justify-center relative min-h-[400px]">
            <div class="absolute inset-0 bg-[#7C4DFF] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
            <h3 class="text-white font-bold mb-6 text-[16px] w-full text-left">Cơ Cấu Dòng Tiền (30 Ngày)</h3>
            
            <div class="relative w-64 h-64">
              <canvas id="spendingChart"></canvas>
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-ai-muted text-[11px] font-mono tracking-widest uppercase">Tổng Chi</span>
                <span class="text-white font-bold text-[18px]">${formatUtils.currency(totalSpent, 'VND').replace('VND','₫')}</span>
              </div>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-8">
            <h3 class="text-white font-bold mb-6 text-[16px]">Chi Tiết Theo Danh Mục</h3>
            <div class="space-y-4">
              ${labels.map((label, idx) => {
                const amount = data[idx];
                const percent = Math.round((amount / totalSpent) * 100);
                const colors = ['#00F5FF', '#A855F7', '#FFB800', '#FF5F56', '#00E676', '#3B82F6'];
                const color = colors[idx % colors.length];
                
                return `
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${color}; box-shadow: 0 0 10px ${color}80"></div>
                        <span class="text-[13px] font-semibold text-white">${label}</span>
                      </div>
                      <span class="text-[13px] font-bold text-white">${formatUtils.currency(amount, 'VND')}</span>
                    </div>
                    <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full rounded-full" style="width: ${percent}%; background-color: ${color}; box-shadow: 0 0 10px ${color}"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();

    // Render Biểu đồ Doughnut
    setTimeout(() => {
      const ctx = document.getElementById('spendingChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#00F5FF', '#A855F7', '#FFB800', '#FF5F56', '#00E676', '#3B82F6'],
            borderWidth: 2,
            borderColor: '#07111F' // Trùng màu nền để tạo khoảng cách
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%', // Độ rỗng ở giữa
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(12, 23, 40, 0.9)', titleColor: '#8B9BB4', bodyColor: '#FFFFFF',
              borderColor: 'rgba(0, 245, 255, 0.2)', borderWidth: 1, padding: 12,
              callbacks: { label: (ctx) => formatUtils.currency(ctx.raw, 'VND') }
            }
          }
        }
      });
    }, 150);
  }
};