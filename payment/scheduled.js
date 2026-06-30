// neoviet360/payment/scheduled.js
const ScheduledPage = {
  render: async (container) => {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn space-y-8">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="router.navigate('bill-pay')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Thanh Toán Định Kỳ</h2>
        </div>

        <div id="scheduled-list" class="space-y-4">
          ${SkeletonLoader.transactionRow(3)}
        </div>
      </div>
    `;
    
    lucide.createIcons();
    await mockDelay(800);
    ScheduledPage.loadScheduled();
  },

  loadScheduled: async () => {
    const container = document.getElementById('scheduled-list');
    let scheduled = [];
    try {
      scheduled = await api.scheduled.list() || [];
    } catch (e) {
      console.error('Failed to load scheduled payments:', e);
      scheduled = [];
    }

    if (scheduled.length === 0) {
      container.innerHTML = `
        <div class="layer-primary rounded-3xl p-12 text-center border border-dashed border-white/10">
          <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="calendar-x" class="w-8 h-8 text-ai-muted"></i>
          </div>
          <h4 class="text-white font-bold mb-1">Chưa có thanh toán định kỳ nào</h4>
          <p class="text-ai-muted text-sm">Các hóa đơn được thiết lập thanh toán tự động sẽ xuất hiện tại đây.</p>
          <button onclick="router.navigate('bill-pay')" class="mt-6 bg-status-warning/10 text-status-warning px-6 py-2 rounded-xl text-sm font-bold border border-status-warning/20 hover:bg-status-warning/20 transition-all">
            THIẾT LẬP NGAY
          </button>
        </div>
      `;
    } else {
      container.innerHTML = scheduled.map(item => `
        <div class="layer-secondary rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-status-warning/30 transition-all">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-status-warning/10 flex items-center justify-center text-status-warning">
              <i data-lucide="calendar-days" class="w-6 h-6"></i>
            </div>
            <div>
              <h4 class="text-white font-bold">${item.recipient}</h4>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-[11px] text-ai-muted uppercase font-bold tracking-wider">${item.frequency === 'MONTHLY' ? 'Hàng tháng' : item.frequency}</span>
                <span class="w-1 h-1 rounded-full bg-white/10"></span>
                <span class="text-[11px] text-status-warning font-bold uppercase tracking-wider">Ngày tới: ${new Date(item.nextRunAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right">
              <div class="text-white font-bold">${formatUtils.currency(item.amount, 'VND')}</div>
              <div class="text-[10px] text-ai-muted uppercase font-bold mt-1">Số tiền dự kiến</div>
            </div>
            <button onclick="ScheduledPage.cancelScheduled('${item.id}')" class="p-2 rounded-lg bg-status-alert/10 text-status-alert hover:bg-status-alert/20 transition-colors" title="Hủy thanh toán">
              <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
    lucide.createIcons();
  },

  cancelScheduled: async (id) => {
    if (!confirm('Bạn có chắc chắn muốn hủy thanh toán định kỳ này?')) return;

    try {
      await api.scheduled.delete(id);

      const toast = document.createElement('div');
      toast.className = 'bg-status-alert text-white px-6 py-3 rounded-xl shadow-2xl animate__animated animate__fadeInRight font-bold text-sm';
      toast.innerHTML = 'Đã hủy thanh toán định kỳ';
      document.getElementById('toast-container').appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      ScheduledPage.loadScheduled();
    } catch (error) {
      Modal.open(`
        <div class="p-6 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
          </div>
          <h3 class="text-white text-lg font-bold mb-1">Hủy thất bại</h3>
          <p class="text-[14px] text-ai-muted">${error.message || 'Không thể hủy thanh toán định kỳ lúc này.'}</p>
        </div>
        <div class="p-6 bg-white/5">
          <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
            ĐÃ HIỂU
          </button>
        </div>
      `);
      lucide.createIcons();
    }
  }
};

window.ScheduledPage = ScheduledPage;