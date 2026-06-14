// neoviet360/components/Header.js
const Header = {
  render: (container, currentRoute) => {
    const user = auth.getUser();
    
    const menuItems = [
      { id: 'dashboard', label: 'Overview' },
      { id: 'activity', label: 'Activity' },
      { id: 'payments', label: 'Payments' },
      { id: 'insights', label: 'Insights' }
    ];

    const menuHtml = menuItems.map(item => `
      <a href="#" onclick="router.navigate('${item.id}'); return false;"
         class="px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-300 ${
           currentRoute === item.id 
           ? 'text-white bg-white/10 shadow-sm border border-white/5' 
           : 'text-ai-muted hover:text-white hover:bg-white/5'
         }">
        ${item.label}
      </a>
    `).join('');

    container.innerHTML = `
      <div class="w-full px-4 sm:px-8 xl:px-12">
        <div class="flex justify-between items-center h-[68px]">
          
          <div class="flex items-center gap-8">
            <div class="flex-shrink-0 cursor-pointer flex items-center gap-2.5 transition-transform hover:scale-105" onclick="router.navigate('dashboard')">
              <div class="w-7 h-7 rounded-lg bg-status-highlight/10 border border-status-highlight/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                <i data-lucide="sparkles" class="w-4 h-4 text-status-highlight"></i>
              </div>
              <span class="text-white font-semibold text-[15px] tracking-tight">NeoViet AI</span>
            </div>
            <nav class="hidden md:flex space-x-1">
              ${menuHtml}
            </nav>
          </div>

          <div class="flex items-center gap-6">
            <button class="text-ai-muted hover:text-white transition-colors relative">
              <i data-lucide="bell" class="w-5 h-5 stroke-[1.5]"></i>
              <span class="absolute top-0 right-0.5 w-1.5 h-1.5 bg-status-alert rounded-full shadow-[0_0_8px_#FF5F56]"></span>
            </button>
            
            <div class="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group" onclick="router.navigate('chatbot')">
              <div class="hidden sm:block text-right">
                <div class="text-[13px] font-semibold text-white">${user?.fullName || 'Identity_Node'}</div>
                <div class="text-[11px] text-status-premium font-medium mt-0.5 group-hover:text-white transition-colors flex items-center justify-end gap-1"><i data-lucide="crown" class="w-3 h-3"></i> Premium</div>
              </div>
              <img src="${user?.avatar || './public/avatar-default.svg'}" class="w-8 h-8 rounded-full border border-white/20 group-hover:border-status-premium transition-colors object-cover shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
  }
};