// neoviet360/analytics/spending.js
const SpendingPage = {
  render: (container) => {
    // Mock dữ liệu ngân sách tháng
    const budgetData = {
      totalBudget: 20000000,
      totalSpent: 14500000,
      categories: [
        { id: 'food', name: 'Ăn uống', icon: 'coffee', color: 'text-status-warning', bg: 'bg-status-warning', spent: 6500000, budget: 8000000 },
        { id: 'shopping', name: 'Mua sắm', icon: 'shopping-bag', color: 'text-status-premium', bg: 'bg-status-premium', spent: 4200000, budget: 5000000 },
        { id: 'transport', name: 'Di chuyển', icon: 'car', color: 'text-status-highlight', bg: 'bg-status-highlight', spent: 1800000, budget: 3000000 },
        { id: 'bills', name: 'Hóa đơn', icon: 'receipt', color: 'text-status-alert', bg: 'bg-status-alert', spent: 2000000, budget: 2000000 }
      ]
    };

    const totalProgress = Math.min((budgetData.totalSpent / budgetData.totalBudget) * 100, 100);
    const isOverBudget = budgetData.totalSpent > budgetData.totalBudget;

    const catHtml = budgetData.categories.map(c => {
      const progress = Math.min((c.spent / c.budget) * 100, 100);
      const isDanger = progress >= 90; // Cảnh báo khi dùng quá 90%
      const barColor = isDanger ? 'bg-status-alert' : c.bg;
      
      return `
        <div class="mb-6 last:mb-0 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <i data-lucide="${c.icon}" class="w-5 h-5 ${c.color}"></i>
              </div>
              <div>
                <div class="text-white font-medium text-[14px]">${c.name}</div>
                <div class="text-ai-muted text-[12px]">${formatUtils.currency(c.spent, 'VND')} / ${formatUtils.currency(c.budget, 'VND')}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-[14px] ${isDanger ? 'text-status-alert' : 'text-white'}">${progress.toFixed(0)}%</div>
              <div class="text-ai-muted text-[12px]">Đã dùng</div>
            </div>
          </div>
          <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full ${barColor} rounded-full transition-all duration-1000" style="width: 0%; animation: slideIn 1s ease-out forwards; --target-width: ${progress}%"></div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <style>
        @keyframes slideIn { from { width: 0%; } to { width: var(--target-width); } }
      </style>
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            ${BackButton.render()}
            <h2 class="text-xl font-bold text-white tracking-wide">Quản lý Ngân sách</h2>
          </div>
          <button class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[13px] font-medium transition-colors flex items-center gap-2 border border-white/10">
            <i data-lucide="calendar" class="w-4 h-4"></i> Tháng hiện tại
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Box Tổng quan ngân sách -->
          <div class="lg:col-span-1 space-y-6">
            <div class="layer-primary rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 ${isOverBudget ? 'bg-status-alert' : 'bg-status-success'}"></div>
              <div class="w-16 h-16 rounded-full ${isOverBudget ? 'bg-status-alert/20 text-status-alert' : 'bg-status-success/20 text-status-success'} flex items-center justify-center mx-auto mb-4 border ${isOverBudget ? 'border-status-alert/30' : 'border-status-success/30'}">
                <i data-lucide="${isOverBudget ? 'alert-triangle' : 'check-circle'}" class="w-8 h-8"></i>
              </div>
              <h3 class="text-white font-bold text-[16px] mb-1">Ngân sách tháng</h3>
              <p class="text-ai-muted text-[13px] mb-6">Đã tiêu thụ ${totalProgress.toFixed(0)}% hạn mức</p>
              
              <div class="text-[32px] font-extrabold text-white leading-none mb-2">${formatUtils.currency(budgetData.totalSpent, 'VND')}</div>
              <div class="text-ai-muted text-[13px]">Tổng: ${formatUtils.currency(budgetData.totalBudget, 'VND')}</div>
              
              <button class="w-full mt-8 bg-status-highlight text-black py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:shadow-[0_0_25px_rgba(0,245,255,0.5)] flex justify-center items-center gap-2">
                <i data-lucide="sliders" class="w-4 h-4"></i> Điều chỉnh
              </button>
            </div>
            
            <!-- Box AI Insight -->
            <div class="layer-secondary rounded-3xl p-6 border border-status-insight/30 bg-status-insight/5 relative overflow-hidden">
              <div class="absolute -right-6 -top-6 w-24 h-24 bg-status-insight/20 blur-2xl rounded-full"></div>
              <div class="flex gap-3 relative z-10">
                <div class="w-8 h-8 rounded-full bg-status-insight/20 flex items-center justify-center shrink-0">
                  <i data-lucide="sparkles" class="w-4 h-4 text-status-insight"></i>
                </div>
                <div>
                  <h4 class="text-white font-bold text-[14px] mb-1">AI Financial Coach</h4>
                  <p class="text-ai-muted text-[13px] leading-relaxed">Hóa đơn tháng này đã chạm mức <span class="text-status-alert font-bold">100%</span> ngân sách. Bạn hãy chú ý cắt giảm bớt chi phí ăn uống tuần cuối tháng nhé!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Box Chi tiết danh mục -->
          <div class="lg:col-span-2 layer-secondary rounded-3xl p-6 md:p-8">
            <div class="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <h3 class="text-white font-bold text-[16px]">Chi tiết danh mục</h3>
              <button class="text-status-highlight text-[13px] font-medium hover:bg-status-highlight/10 px-3 py-1.5 rounded-lg transition-colors">Cấu hình</button>
            </div>
            <div>
              ${catHtml}
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
  }
};
window.SpendingPage = SpendingPage;