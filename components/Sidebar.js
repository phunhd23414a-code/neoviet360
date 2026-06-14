// neoviet360/components/Sidebar.js
const Sidebar = {
  render: (container, currentRoute) => {
    const menuItems = [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Tổng quan' },
      { id: 'accounts', icon: 'credit-card', label: 'Ngân hàng (VCB)' },
      { id: 'payments', icon: 'qr-code', label: 'Thanh toán (VNPAY)' },
      { id: 'global', icon: 'globe', label: 'Toàn cầu (Revolut)' },
      { id: 'ecosystem', icon: 'shopping-bag', label: 'Hệ sinh thái' }
    ];

    const menuHtml = menuItems.map(item => `
      <a href="#" onclick="router.navigate('${item.id}'); return false;" 
         class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentRoute === item.id ? 'bg-nv-blue text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-gray-100 hover:text-nv-blue'}">
        <i data-lucide="${item.icon}" class="w-5 h-5"></i>
        <span class="font-medium">${item.label}</span>
      </a>
    `).join('');

    container.innerHTML = `
      <div class="p-6 flex items-center gap-2">
        <img src="./public/logo.svg" alt="NeoViet 360" class="h-8">
      </div>
      <div class="px-4 flex-1 space-y-2 mt-2">
        ${menuHtml}
      </div>
      <div class="p-4 border-t border-gray-200">
        <button onclick="auth.logout()" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-nv-red w-full transition-colors rounded-xl hover:bg-red-50">
          <i data-lucide="log-out" class="w-5 h-5"></i>
          <span class="font-medium">Đăng xuất</span>
        </button>
      </div>
    `;
    lucide.createIcons();
  }
};