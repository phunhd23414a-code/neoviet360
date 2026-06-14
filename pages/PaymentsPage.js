// neoviet360/pages/PaymentsPage.js
const PaymentsPage = {
  render: (container) => {
    const methods = [
      { id: 'transfer', icon: 'send', label: 'Chuyển khoản liên ngân hàng', desc: 'Kết nối mạng lưới VCB Digibank toàn quốc', theme: 'text-status-highlight', glow: 'shadow-[0_0_20px_rgba(0,245,255,0.15)]' },
      { id: 'qr-pay', icon: 'qr-code', label: 'Quét mã VNPAY QR', desc: 'Thanh toán tức thời qua cổng quang học AI', theme: 'text-status-success', glow: 'shadow-[0_0_20px_rgba(0,230,118,0.15)]' },
      { id: 'bill-pay', icon: 'receipt', label: 'Thanh toán hóa đơn', desc: 'Tự động quét cước EVN, Nước, Internet', theme: 'text-status-warning', glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15)]' },
      { id: 'topup', icon: 'smartphone', label: 'Nạp tiền điện thoại', desc: 'Chiết khấu cao, nạp viễn thông siêu tốc', theme: 'text-status-insight', glow: 'shadow-[0_0_20px_rgba(124,77,255,0.15)]' }
    ];

    container.innerHTML = `
      <div class="max-w-6xl mx-auto w-full animate__animated animate__fadeIn space-y-8">
        <div>
          <h2 class="text-xl font-bold text-white tracking-wide">Payment_Gateways (Trung tâm thanh toán)</h2>
          <p class="text-[13px] text-ai-muted mt-1">Hạ tầng giao dịch đa phương thức được bảo mật tuyệt đối</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${methods.map(m => `
            <div onclick="router.navigate('${m.id}')" class="layer-primary rounded-3xl p-6 flex items-center justify-between cursor-pointer group hover:border-white/20 transition-all">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl glass-layer flex items-center justify-center ${m.theme} group-hover:${m.glow} transition-all duration-300 shrink-0">
                  <i data-lucide="${m.icon}" class="w-6 h-6"></i>
                </div>
                <div>
                  <h3 class="font-bold text-white text-[16px] group-hover:text-status-highlight transition-colors">${m.label}</h3>
                  <p class="text-ai-muted text-[13px] font-medium mt-1">${m.desc}</p>
                </div>
              </div>
              <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-ai-muted group-hover:text-white group-hover:bg-white/10 transition-colors">
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