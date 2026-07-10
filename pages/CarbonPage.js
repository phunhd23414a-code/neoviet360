// neoviet360/pages/CarbonPage.js
const CarbonPage = {
  render: async (container) => {
    container.innerHTML = SkeletonLoader.card(1);
    await mockDelay(500);

    const transactions = state.transactions || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTx = transactions.filter(tx => {
      const d = new Date(tx.timestamp);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthTx = transactions.filter(tx => {
      const d = new Date(tx.timestamp);
      let lm = currentMonth - 1;
      let ly = currentYear;
      if (lm < 0) { lm = 11; ly--; }
      return d.getMonth() === lm && d.getFullYear() === ly;
    });

    const calculateCarbon = (txs) => {
      return txs.reduce((acc, tx) => {
        let factor = 0.05; // default
        const cat = tx.category.toLowerCase();
        if (cat.includes('transport') || cat.includes('di chuyển') || cat.includes('xe')) factor = 0.21;
        else if (cat.includes('food') || cat.includes('ăn uống') || cat.includes('nhà hàng')) factor = 0.15;
        else if (cat.includes('shopping') || cat.includes('mua sắm')) factor = 0.12;
        
        return acc + (tx.amount / 1000) * factor;
      }, 0);
    };

    const thisMonthCarbon = calculateCarbon(thisMonthTx);
    const lastMonthCarbon = calculateCarbon(lastMonthTx);
    const diff = lastMonthCarbon > 0 ? ((thisMonthCarbon - lastMonthCarbon) / lastMonthCarbon * 100).toFixed(1) : 0;
    const isIncrease = diff > 0;

    // Breakdown
    const categories = {};
    thisMonthTx.forEach(tx => {
      const cat = tx.category || 'Khác';
      let factor = 0.05;
      const c = cat.toLowerCase();
      if (c.includes('transport')) factor = 0.21;
      else if (c.includes('food')) factor = 0.15;
      else if (c.includes('shopping')) factor = 0.12;
      
      const carbon = (tx.amount / 1000) * factor;
      categories[cat] = (categories[cat] || 0) + carbon;
    });

    const breakdownHtml = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, val]) => `
        <div class="flex items-center justify-between p-4 layer-tertiary rounded-2xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ai-muted">
              <i data-lucide="leaf" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-white font-bold text-sm">${cat}</div>
              <div class="text-[11px] text-ai-muted">Dựa trên chi tiêu tháng này</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-white font-mono font-bold">${val.toFixed(2)} kg</div>
            <div class="text-[10px] text-status-success">CO₂e</div>
          </div>
        </div>
      `).join('');

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full animate__animated animate__fadeIn space-y-8">
        <div class="flex items-center gap-3 mb-2">
          ${BackButton.render('insights')}
          <h2 class="text-xl font-bold text-white tracking-wide">Carbon Footprint Tracker</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 layer-primary rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-status-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div class="relative z-10">
              <div class="text-ai-muted text-[12px] font-mono uppercase tracking-widest mb-2">Tổng phát thải tháng này</div>
              <div class="flex items-baseline gap-3 mb-6">
                <span class="text-white text-5xl font-extrabold">${thisMonthCarbon.toFixed(1)}</span>
                <span class="text-status-success font-bold text-xl">kg CO₂e</span>
              </div>
              
              <div class="flex items-center gap-2 ${isIncrease ? 'text-status-alert' : 'text-status-success'} font-bold text-sm">
                <i data-lucide="${isIncrease ? 'trending-up' : 'trending-down'}" class="w-4 h-4"></i>
                <span>${isIncrease ? '+' : ''}${diff}% so với tháng trước</span>
              </div>
            </div>
          </div>

          <div class="layer-primary rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-white/5">
            <div class="w-16 h-16 rounded-full bg-status-success/20 flex items-center justify-center mb-4">
              <i data-lucide="tree-pine" class="w-8 h-8 text-status-success"></i>
            </div>
            <div class="text-white font-bold mb-1">Tương đương</div>
            <div class="text-status-success text-lg font-bold">${Math.ceil(thisMonthCarbon / 20)} cây xanh</div>
            <p class="text-ai-muted text-[11px] mt-2">Số lượng cây cần thiết để hấp thụ lượng carbon này trong 1 năm.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 class="text-white font-bold mb-4 flex items-center gap-2">
              <i data-lucide="chart-column" class="w-5 h-5 text-status-success"></i>
              Phân bổ theo danh mục
            </h3>
            <div class="space-y-3">
              ${breakdownHtml || '<p class="text-ai-muted italic text-sm">Chưa có dữ liệu phát thải tháng này.</p>'}
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="text-white font-bold mb-4 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-status-highlight"></i>
              Gợi ý giảm phát thải
            </h3>
            <div class="space-y-4">
              <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div class="font-bold text-white text-sm mb-1">Sử dụng phương tiện công cộng</div>
                <p class="text-ai-muted text-xs">Giảm đến 80% lượng carbon so với việc tự lái xe cá nhân.</p>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div class="font-bold text-white text-sm mb-1">Ưu tiên thực phẩm địa phương</div>
                <p class="text-ai-muted text-xs">Giảm thiểu quãng đường vận chuyển thực phẩm giúp giảm CO₂.</p>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div class="font-bold text-white text-sm mb-1">Tắt thiết bị khi không sử dụng</div>
                <p class="text-ai-muted text-xs">Tiết kiệm điện năng là cách trực tiếp nhất để bảo vệ môi trường.</p>
              </div>
            </div>

            <button onclick="CarbonPage.offset()" class="w-full bg-status-success text-black py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2">
              <i data-lucide="heart" class="w-5 h-5"></i>
              BÙ ĐẮP CARBON NGAY
            </button>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  offset: () => {
    const toast = document.createElement('div');
    toast.className = 'animate__animated animate__fadeInUp glass-layer border-l-4 border-status-success p-4 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto';
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <p class="text-white text-sm font-bold">Cảm ơn bạn!</p>
        <p class="text-ai-muted text-xs">Yêu cầu bù đắp carbon đã được ghi nhận. Chúng tôi sẽ gửi chứng chỉ sớm.</p>
      </div>
    `;
    document.getElementById('toast-container').appendChild(toast);
    lucide.createIcons();
    setTimeout(() => {
      toast.classList.replace('animate__fadeInUp', 'animate__fadeOutDown');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
};

window.CarbonPage = CarbonPage;