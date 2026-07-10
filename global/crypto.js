// neoviet360/global/crypto.js
const CryptoPage = {
  render: async (container) => {
    const cryptoData = await api.fetchJSON('./data/crypto.json') || [];
    
    const cryptoHtml = cryptoData.map(coin => {
      const isUp = coin.change_24h >= 0;
      const colorClass = isUp ? 'text-status-success' : 'text-status-alert';
      const glowClass = isUp ? 'shadow-[0_0_15px_rgba(0,230,118,0.15)]' : 'shadow-[0_0_15px_rgba(255,95,86,0.15)]';
      
      return `
        <div class="layer-tertiary p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:border-white/20 transition-all ${glowClass}">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-[12px]">${coin.symbol}</div>
            <div><div class="text-white font-bold text-[15px]">${coin.name}</div><div class="text-ai-muted text-[11px]">${coin.symbol}/USD</div></div>
          </div>
          <div class="text-right">
            <div class="text-white font-bold text-[16px]">$ ${coin.price_usd.toLocaleString()}</div>
            <div class="text-[12px] font-bold mt-1 ${colorClass}">${isUp ? '+' : ''}${coin.change_24h}%</div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render()}
          <h2 class="text-xl font-bold text-white tracking-wide">Thị Trường Crypto (Revolut Sync)</h2>
        </div>
        <div class="grid grid-cols-1 gap-4">
          ${cryptoHtml}
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};