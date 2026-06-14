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
        <button class="w-full mt-6 bg-white/5 hover:bg-status-highlight/20 text-white hover:text-status-highlight border border-white/10 hover:border-status-highlight/50 py-3 rounded-xl font-semibold transition-all text-[13px]">
          Khám Phá
        </button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <h2 class="text-xl font-bold text-white tracking-wide mb-8">Ecosystem Hub (Hệ Sinh Thái)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${productHtml}
        </div>
      </div>
    `;
  }
};