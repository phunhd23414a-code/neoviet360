// neoviet360/components/Modal.js
const Modal = {
  init: () => {
    // Nếu chưa có container của Modal thì tạo mới và chèn vào body
    if (!document.getElementById('neo-modal-container')) {
      const div = document.createElement('div');
      div.id = 'neo-modal-container';
      div.className = 'fixed inset-0 z-[200] hidden justify-center p-4 sm:p-6 overflow-y-auto py-10';
      div.innerHTML = `
        <div id="neo-modal-backdrop" class="fixed inset-0 bg-[#07111F]/80 backdrop-blur-sm transition-opacity duration-300 opacity-0" onclick="Modal.close()"></div>
        <div id="neo-modal-content" class="relative bg-[#0F1A2E] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl transform scale-95 opacity-0 transition-all duration-300 overflow-hidden flex flex-col my-auto">
        </div>
      `;
      document.body.appendChild(div);
    }
  },

  open: (htmlContent, size = 'md') => {
    Modal.init();
    const container = document.getElementById('neo-modal-container');
    const backdrop = document.getElementById('neo-modal-backdrop');
    const content = document.getElementById('neo-modal-content');

    // Reset and set size
    content.classList.remove('max-w-md', 'max-w-lg', 'max-w-2xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl');
    const sizeClass = size === 'full' ? 'max-w-[95vw]' : `max-w-${size}`;
    content.classList.add(sizeClass || 'max-w-md');

    // Đẩy nội dung HTML vào popup
    content.innerHTML = htmlContent;
    if (window.lucide) lucide.createIcons();

    // Hiển thị modal
    container.classList.remove('hidden');
    container.classList.add('flex');

    // Hiệu ứng mượt mà (Animation)
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }, 10);
  },

  close: () => {
    const container = document.getElementById('neo-modal-container');
    const backdrop = document.getElementById('neo-modal-backdrop');
    const content = document.getElementById('neo-modal-content');

    if (!container) return;

    // Hiệu ứng mờ dần khi đóng
    backdrop.classList.add('opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      container.classList.remove('flex');
      container.classList.add('hidden');
    }, 300);
  },

  showSuccess: (message, title = 'Thành công') => {
    Modal.open(`
      <div class="p-6 sm:p-7">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <i data-lucide="check-circle-2" class="w-6 h-6" aria-hidden="true"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white">${title}</h3>
            <p class="mt-2 text-sm leading-6 text-white/70">${message}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            onclick="Modal.close()"
            class="inline-flex items-center justify-center rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/30"
            aria-label="Đóng thông báo thành công">
            Đã hiểu
          </button>
        </div>
      </div>
    `);
  }
};

// Gắn vào window để gọi được từ bất cứ đâu
window.Modal = Modal;