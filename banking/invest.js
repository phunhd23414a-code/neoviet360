// neoviet360/banking/invest.js
const InvestPage = {
  render: (container) => {
    // Dữ liệu chứng khoán Mock tĩnh
    const stocks = [
      { sym: 'VCB', name: 'Vietcombank', price: 92500, change: '+1.2%', up: true },
      { sym: 'FPT', name: 'FPT Corp', price: 115000, change: '+2.8%', up: true },
      { sym: 'HPG', name: 'Hoa Phat Group', price: 28400, change: '-0.5%', up: false },
      { sym: 'VHM', name: 'Vinhomes', price: 42100, change: '-1.1%', up: false }
    ];

    const stockHtml = stocks.map(st => `
      <div class="layer-tertiary p-4 rounded-2xl flex justify-between items-center cursor-pointer">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-[12px]">${st.sym}</div>
          <div><div class="text-white font-bold text-[14px]">${st.sym}</div><div class="text-ai-muted text-[11px]">${st.name}</div></div>
        </div>
        <div class="text-right">
          <div class="text-white font-bold text-[14px]">${formatUtils.currency(st.price, 'VND').replace('VND','₫')}</div>
          <div class="text-[12px] font-bold ${st.up ? 'text-status-success' : 'text-status-alert'}">${st.change}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            ${BackButton.render()}
            <h2 class="text-xl font-bold text-white tracking-wide">AI_Invest (Đầu tư)</h2>
          </div>
          <div class="px-3 py-1 bg-status-premium/20 border border-status-premium/40 rounded-full text-[11px] font-bold text-status-premium flex items-center gap-2">
            <div class="w-2 h-2 bg-status-premium rounded-full animate-pulse"></div> AI SIGNAL: BUY
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div class="lg:col-span-8 layer-primary rounded-3xl p-6 md:p-8 flex flex-col">
            <h3 class="text-ai-muted text-[13px] font-medium uppercase tracking-widest mb-1">Danh mục Đầu tư</h3>
            <div class="text-[36px] font-extrabold text-white mb-6">452.150.000 ₫</div>
            
            <div class="flex-1 w-full rounded-2xl border border-white/5 relative overflow-hidden chart-grid p-2 min-h-[250px] mb-6">
               <canvas id="investCanvas" class="w-full h-full relative z-10"></canvas>
            </div>
            
            <div class="grid grid-cols-3 gap-4">
               <div class="bg-white/5 rounded-xl p-4 text-center border border-white/5"><div class="text-ai-muted text-[11px] uppercase mb-1">Lợi nhuận</div><div class="text-status-success font-bold text-[16px]">+12.4%</div></div>
               <div class="bg-white/5 rounded-xl p-4 text-center border border-white/5"><div class="text-ai-muted text-[11px] uppercase mb-1">Rủi ro (AI)</div><div class="text-status-warning font-bold text-[16px]">Low</div></div>
               <div class="bg-white/5 rounded-xl p-4 text-center border border-white/5"><div class="text-ai-muted text-[11px] uppercase mb-1">Tự động</div><div class="text-status-highlight font-bold text-[16px]">BẬT</div></div>
            </div>
          </div>

          <div class="lg:col-span-4 layer-secondary rounded-3xl p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-bold text-white text-[16px]">Thị trường</h3>
              <i data-lucide="search" class="w-4 h-4 text-ai-muted"></i>
            </div>
            <div class="space-y-3">
              ${stockHtml}
            </div>
            <button class="w-full mt-6 layer-tertiary p-3 rounded-xl text-center text-[13px] font-bold text-white hover:text-status-highlight transition-colors">
              Khám phá thêm mã
            </button>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();

    // Render Biểu đồ màu Tím (Premium) đặc trưng cho Đầu tư
    setTimeout(() => {
      const canvas = document.getElementById('investCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
          datasets: [{
            data: [300, 320, 310, 360, 390, 452],
            borderColor: '#A855F7', borderWidth: 3, backgroundColor: gradient, fill: true, tension: 0.4,
            pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: '#fff', pointBorderColor: '#A855F7'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
          interaction: { mode: 'index', intersect: false }
        }
      });
    }, 150);
  }
};