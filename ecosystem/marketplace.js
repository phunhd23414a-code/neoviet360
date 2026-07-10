// neoviet360/ecosystem/marketplace.js
const MarketplacePage = {
  render: async (container) => {
    const products = await api.fetchJSON('./data/products.json') || [];

    const productHtml = products.map(p => `
      <div class="layer-tertiary p-6 rounded-3xl flex flex-col justify-between group hover:border-status-highlight/50 transition-all min-h-[220px]">
        <div>
          <div class="inline-flex items-center gap-2 bg-status-highlight/10 px-2.5 py-1 rounded-md border border-status-highlight/20 mb-4">
             <span class="text-[10px] font-mono text-status-highlight uppercase">${p.highlight}</span>
          </div>
          <h3 class="text-white font-bold text-[16px] mb-2">${p.name}</h3>
          <p class="text-ai-muted text-[13px] leading-relaxed">${p.desc}</p>
        </div>
        <button onclick='MarketplacePage.explore(${JSON.stringify(p).replace(/'/g, "'")})' class="w-full mt-6 bg-white/5 hover:bg-status-highlight/20 text-white hover:text-status-highlight border border-white/10 hover:border-status-highlight/50 py-3 rounded-xl font-semibold transition-all text-[13px]">
          Khám Phá
        </button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render()}
          <h2 class="text-xl font-bold text-white tracking-wide">Ecosystem Hub (Hệ Sinh Thái)</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${productHtml}
        </div>
      </div>
    `;
  },

  explore: (product) => {
    const benefitsHtml = product.benefits ? product.benefits.map(b => `
      <li class="flex items-start gap-3 text-ai-muted text-sm">
        <i data-lucide="check-circle" class="w-4 h-4 text-status-highlight shrink-0 mt-0.5"></i>
        <span>${b}</span>
      </li>
    `).join('') : '';

    const html = `
      <div class="p-8 border-b border-white/5">
        <div class="flex justify-between items-start mb-6">
          <div>
            <span class="text-[10px] font-mono text-status-highlight uppercase tracking-widest border border-status-highlight/30 px-2 py-0.5 rounded mb-2 inline-block">Sản phẩm Hệ sinh thái</span>
            <h3 class="text-white text-2xl font-bold">${product.name}</h3>
          </div>
          <button onclick="Modal.close()" class="text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        
        <div class="space-y-6">
          <div>
            <h4 class="text-white font-bold mb-2 flex items-center gap-2">
              <i data-lucide="info" class="w-4 h-4 text-status-highlight"></i>
              Chi tiết
            </h4>
            <p class="text-ai-muted leading-relaxed text-sm">${product.fullDesc || product.desc}</p>
          </div>
          
          <div>
            <h4 class="text-white font-bold mb-3 flex items-center gap-2">
              <i data-lucide="zap" class="w-4 h-4 text-status-highlight"></i>
              Lợi ích vượt trội
            </h4>
            <ul class="space-y-3">
              ${benefitsHtml}
            </ul>
          </div>
        </div>
      </div>
      <div class="p-6 flex gap-4">
        <button onclick="Modal.close()" class="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
          ĐÓNG
        </button>
        <button onclick="MarketplacePage.register('${product.name}')" class="flex-1 bg-status-highlight text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
          ĐĂNG KÝ NGAY
        </button>
      </div>
    `;
    Modal.open(html);
    lucide.createIcons();
  },

  register: (productName) => {
    Modal.close();
    const toast = document.createElement('div');
    toast.className = 'animate__animated animate__fadeInUp glass-layer border-l-4 border-status-success p-4 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto';
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <p class="text-white text-sm font-bold">Đăng ký thành công!</p>
        <p class="text-ai-muted text-xs">Yêu cầu đăng ký ${productName} đã được gửi. Chuyên viên sẽ liên hệ bạn sớm.</p>
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

window.MarketplacePage = MarketplacePage;