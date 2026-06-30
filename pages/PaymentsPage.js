// neoviet360/pages/PaymentsPage.js
const PaymentsPage = {
  render: (container) => {
    const methods = [
      { id: 'transfer', icon: 'send', label: 'Chuyển khoản liên ngân hàng', desc: 'Kết nối mạng lưới VCB Digibank toàn quốc', theme: 'text-status-highlight', glow: 'shadow-[0_0_20px_rgba(0,245,255,0.15)]' },
      { id: 'qr-pay', icon: 'qr-code', label: 'Quét mã VNPAY QR', desc: 'Thanh toán tức thời qua cổng quang học AI', theme: 'text-status-success', glow: 'shadow-[0_0_20px_rgba(0,230,118,0.15)]' },
      { id: 'bill-pay', icon: 'receipt', label: 'Thanh toán hóa đơn', desc: 'Tự động quét cước EVN, Nước, Internet', theme: 'text-status-warning', glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15)]' },
      { id: 'scheduled', icon: 'calendar-clock', label: 'Thanh toán định kỳ', desc: 'Quản lý các hóa đơn tự động hàng tháng', theme: 'text-status-warning', glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15)]' },
      { id: 'split-bill', icon: 'pie-chart', label: 'Chia tiền nhóm', desc: 'Tạo yêu cầu thanh toán và chia hóa đơn với bạn bè', theme: 'text-status-premium', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
      { id: 'topup', icon: 'smartphone', label: 'Nạp tiền điện thoại', desc: 'Chiết khấu cao, nạp viễn thông siêu tốc', theme: 'text-status-insight', glow: 'shadow-[0_0_20px_rgba(124,77,255,0.15)]' }
    ];

    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-8 pb-12">
        <div class="bento-item hero-core p-8 rounded-3xl relative overflow-hidden">
          <div class="energy-wave"></div>
          <div class="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-[#00F5FF] opacity-20 rounded-full blur-[80px] pointer-events-none"></div>
          <div class="relative z-10">
            <h2 class="text-2xl md:text-3xl font-display font-bold text-white tracking-wide mb-2">Trung tâm thanh toán</h2>
            <p class="text-[14px] text-white/80 font-medium max-w-md">Hạ tầng giao dịch đa phương thức được bảo mật tuyệt đối. Nhanh chóng, an toàn và tiện lợi.</p>
          </div>
        </div>

        <div class="bento-grid">
          ${methods.map((m, index) => `
            <div onclick="router.navigate('${m.id}')" class="col-span-12 md:col-span-6 bento-item layer-secondary p-6 flex items-center justify-between cursor-pointer group hover:bg-white/10 transition-all duration-300" role="button" tabindex="0" aria-label="${m.label}: ${m.desc}" style="animation-delay: ${index * 0.1}s">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center ${m.theme} group-hover:${m.glow} group-hover:-translate-y-1 transition-all duration-300 shrink-0" aria-hidden="true">
                  <i data-lucide="${m.icon}" class="w-6 h-6"></i>
                </div>
                <div>
                  <h3 class="font-bold text-white text-[16px] group-hover:text-status-highlight transition-colors">${m.label}</h3>
                  <p class="text-ai-muted text-[13px] font-medium mt-1 line-clamp-2">${m.desc}</p>
                </div>
              </div>
              <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-ai-muted group-hover:text-white group-hover:bg-white/20 transition-colors shrink-0">
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};