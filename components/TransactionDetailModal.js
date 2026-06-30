// neoviet360/components/TransactionDetailModal.js
const TransactionDetailModal = {
  open: (tx) => {
    let statusColor = tx.status === 'success' ? 'text-status-success' : (tx.status === 'pending' ? 'text-status-warning' : 'text-status-alert');
    let statusText = tx.status === 'success' ? 'Thành công' : (tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại');
    let sign = tx.type === 'credit' ? '+' : '-';
    let amountColor = tx.type === 'credit' ? 'text-status-success' : 'text-white';
    
    const html = `
        <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 left-6 text-ai-muted hover:text-white transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <i data-lucide="receipt" class="w-8 h-8 text-status-highlight"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">${tx.merchant}</h3>
            <p class="text-[24px] font-extrabold ${amountColor} mb-2">${sign}${formatUtils.currency(tx.amount, tx.currency)}</p>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium ${statusColor}">
                <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                ${statusText}
            </div>
        </div>
        <div class="p-6 space-y-4">
            <div class="flex justify-between items-center text-[13px]">
                <span class="text-ai-muted">Mã giao dịch</span>
                <div class="flex items-center gap-2">
                  <span class="text-white font-mono">${tx.id || 'TXN-' + Math.floor(Math.random()*1000000)}</span>
                  <button onclick="TransactionDetailModal.copyId('${tx.id}')" class="text-status-highlight hover:text-white transition-colors">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
            </div>
            <div class="flex justify-between items-center text-[13px]">
                <span class="text-ai-muted">Thời gian</span>
                <span class="text-white">${new Date(tx.timestamp).toLocaleString('vi-VN')}</span>
            </div>
            <div class="flex justify-between items-center text-[13px]">
                <span class="text-ai-muted">Danh mục</span>
                <span class="text-white capitalize">${tx.category}</span>
            </div>
            <div class="flex justify-between items-center text-[13px]">
                <span class="text-ai-muted">Tài khoản nguồn</span>
                <span class="text-white">${tx.accountId || 'Tài khoản chính'}</span>
            </div>
            <div class="flex justify-between items-center text-[13px]">
                <span class="text-ai-muted">Ghi chú</span>
                <span class="text-white text-right max-w-[60%] truncate">${tx.note || 'Giao dịch qua NeoViet 360'}</span>
            </div>
        </div>
        <div class="p-6 bg-white/5 flex gap-3">
            <button onclick="Modal.close()" class="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
                Đóng
            </button>
            <button class="flex-1 bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight py-3 rounded-xl font-medium text-[13px] transition-colors flex items-center justify-center gap-2">
                <i data-lucide="download" class="w-4 h-4"></i> Biên lai
            </button>
        </div>
    `;
    Modal.open(html);
  },

  close: () => {
    Modal.close();
  },

  copyId: (id) => {
    navigator.clipboard.writeText(id).then(() => {
      // Toast notification pattern
      const toast = document.createElement('div');
      toast.className = 'bg-ai-surface border border-white/10 px-4 py-2 rounded-xl text-white text-[13px] shadow-2xl animate__animated animate__fadeInUp flex items-center gap-2';
      toast.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-status-success"></i> Đã sao chép mã giao dịch`;
      document.getElementById('toast-container').appendChild(toast);
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        toast.classList.replace('animate__fadeInUp', 'animate__fadeOutDown');
        setTimeout(() => toast.remove(), 500);
      }, 2000);
    });
  }
};

window.TransactionDetailModal = TransactionDetailModal;