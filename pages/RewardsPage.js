// neoviet360/pages/RewardsPage.js
const RewardsPage = {
  render: (container) => {
    const user = state.user || { neoPoints: 0, tier: 'Silver' };
    const nextTier = user.tier === 'Silver' ? 'Gold' : 'Platinum';
    const targetPoints = user.tier === 'Silver' ? 5000 : 15000;
    const progress = Math.min(100, (user.neoPoints / targetPoints) * 100);

    const history = [
      { label: 'Chuyển tiền liên ngân hàng', points: '+150', date: 'Hôm nay, 10:30', type: 'earn' },
      { label: 'Thanh toán hóa đơn điện', points: '+200', date: 'Hôm qua, 15:45', type: 'earn' },
      { label: 'Đổi voucher Highlands Coffee', points: '-500', date: '15/06/2026', type: 'redeem' },
      { label: 'Nạp tiền điện thoại', points: '+50', date: '14/06/2026', type: 'earn' },
      { label: 'Thanh toán QR-Pay', points: '+120', date: '12/06/2026', type: 'earn' }
    ];

    const offers = [
      { id: 1, title: 'Voucher Highlands 50k', points: 500, icon: 'coffee', color: 'text-orange-400' },
      { id: 2, title: 'Hoàn tiền 20k hóa đơn', points: 1000, icon: 'banknote', color: 'text-green-400' },
      { id: 3, title: 'Vé xem phim CGV', points: 2500, icon: 'film', color: 'text-red-400' },
      { id: 4, title: 'Giảm 10% GrabFood', points: 300, icon: 'utensils', color: 'text-emerald-400' }
    ];

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full animate__animated animate__fadeIn space-y-8 pb-20">
        <!-- Header -->
        <div class="flex items-center gap-3">
          ${BackButton.render('profile')}
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">NeoPoints & Ưu đãi</h2>
            <p class="text-[13px] text-ai-muted mt-1">Tích lũy điểm thưởng từ mọi giao dịch</p>
          </div>
        </div>

        <!-- Points Hero Card -->
        <div class="layer-primary rounded-[2rem] p-8 relative overflow-hidden border border-status-highlight/20">
          <div class="absolute top-0 right-0 w-64 h-64 bg-status-highlight/10 blur-[100px] -mr-32 -mt-32"></div>
          
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <p class="text-ai-muted font-medium mb-2">Số dư điểm hiện tại</p>
              <div class="flex items-baseline gap-3">
                <span class="text-5xl font-black text-status-highlight tracking-tighter">${formatUtils.currency(user.neoPoints).replace('₫', '')}</span>
                <span class="text-xl font-bold text-status-highlight/60 uppercase tracking-widest">Points</span>
              </div>
            </div>

            <div class="flex-1 max-w-md">
              <div class="flex justify-between items-end mb-3">
                <div>
                  <span class="text-xs font-bold text-ai-muted uppercase tracking-widest">Hạng hiện tại:</span>
                  <span class="ml-2 text-sm font-bold text-white">${user.tier}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-ai-muted uppercase tracking-widest">Lên hạng ${nextTier}:</span>
                  <span class="ml-2 text-sm font-bold text-status-highlight">${formatUtils.currency(targetPoints - user.neoPoints).replace('₫', '')} pts</span>
                </div>
              </div>
              <div class="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <div class="h-full bg-gradient-to-r from-status-highlight/50 to-status-highlight rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]" style="width: ${progress}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Offers List -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i data-lucide="gift" class="w-5 h-5 text-status-highlight"></i>
              Đổi quà hấp dẫn
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${offers.map(offer => `
                <div class="layer-secondary p-5 rounded-3xl border border-white/5 hover:border-status-highlight/30 transition-all group cursor-pointer">
                  <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${offer.color} mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="${offer.icon}" class="w-6 h-6"></i>
                  </div>
                  <h4 class="text-white font-bold text-sm mb-1">${offer.title}</h4>
                  <p class="text-status-highlight font-mono text-xs mb-4">${offer.points} Points</p>
                  <button onclick="RewardsPage.redeem(${offer.id}, '${offer.title}')" class="w-full py-2 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-status-highlight hover:text-ai-bg transition-all">
                    Đổi ngay
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- History -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i data-lucide="history" class="w-5 h-5 text-status-highlight"></i>
              Lịch sử điểm
            </h3>
            <div class="layer-secondary rounded-3xl border border-white/5 divide-y divide-white/5 overflow-hidden">
              ${history.map(item => `
                <div class="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full ${item.type === 'earn' ? 'bg-status-success/10 text-status-success' : 'bg-status-alert/10 text-status-alert'} flex items-center justify-center">
                      <i data-lucide="${item.type === 'earn' ? 'trending-up' : 'shopping-bag'}" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-white">${item.label}</p>
                      <p class="text-[11px] text-ai-muted mt-0.5">${item.date}</p>
                    </div>
                  </div>
                  <span class="font-mono font-bold ${item.type === 'earn' ? 'text-status-success' : 'text-status-alert'}">
                    ${item.points}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  redeem: (id, title) => {
    const toast = document.createElement('div');
    toast.className = 'animate__animated animate__fadeInUp glass-layer border-l-4 border-status-success p-4 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto';
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <p class="text-white text-sm font-bold">Đổi quà thành công!</p>
        <p class="text-ai-muted text-xs">Voucher ${title} đã được gửi vào hòm thư của bạn.</p>
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

window.RewardsPage = RewardsPage;