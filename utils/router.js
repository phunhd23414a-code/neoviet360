// neoviet360/utils/router.js
const router = {
  navigate: (page) => {
    if (state.currentPage === page && page !== 'login' && page !== 'register') return;
    state.currentPage = page;
    const appContainer = document.getElementById('app');
    const authContainer = document.getElementById('auth-layout');

    if (page === 'login' || page === 'register') {
      // Chỉ giữ một màn hình xác thực duy nhất.
      // Mọi request tới register đều gom về login để tránh xuất hiện 2 trang đăng nhập/xác thực.
      state.currentPage = 'login';
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }

      appContainer.classList.add('hidden');
      authContainer.classList.remove('hidden');
      authContainer.innerHTML = '';
      LoginPage.render(authContainer);
    } else {
      // 2. Kích hoạt chốt chặn an ninh nội bộ trước khi render bất kỳ trang Core Banking nào
      auth.checkProtection();
      
      if (!auth.isLoggedIn()) return; // Dừng luồng nếu không có token hợp lệ

      appContainer.classList.remove('hidden');
      authContainer.classList.add('hidden');
      
      const mainContent = document.getElementById('main-content');
      const headerContainer = document.getElementById('header-container');
      Header.render(headerContainer, page);
      if (window.BottomNav) {
        BottomNav.render(document.getElementById('bottom-nav-container'), page);
      }
      
      // Khối định tuyến Phase 3
      if (page === 'dashboard') {
        DashboardPage.render(mainContent);
      } else if (page === 'ekyc') {
        EkycPage.render(mainContent);
      } else if (page === 'accounts') {
        AccountsPage.render(mainContent);
      } else if (page === 'transfer') {
        TransferPage.render(mainContent);
      } else if (page === 'savings') {
        SavingsPage.render(mainContent);
      } else if (page === 'loan') {
        LoanPage.render(mainContent);
      } else if (page === 'cards') {
        CardsPage.render(mainContent);
      } else if (page === 'invest') {
        InvestPage.render(mainContent);
      } else if (page === 'qr-pay') {
        QRPayPage.render(mainContent);
      } else if (page === 'bill-pay') {
        BillPayPage.render(mainContent);
      } else if (page === 'scheduled') {
        ScheduledPage.render(mainContent);
      } else if (page === 'split-bill') {
        SplitBillPage.render(mainContent);
      } else if (page === 'ewallet') {
        EwalletPage.render(mainContent);
      } else if (page === 'topup') {
        TopupPage.render(mainContent);
      } else if (page === 'fx-exchange') {
        FxExchangePage.render(mainContent);
      } else if (page === 'crypto') {
        CryptoPage.render(mainContent);
      } else if (page === 'chatbot') {
        ChatbotPage.render(mainContent);
      } else if (page === 'spending') {
        SpendingPage.render(mainContent);
      } else if (page === 'marketplace') {
        MarketplacePage.render(mainContent);
      } else if (page === 'activity') {
        ActivityPage.render(mainContent);
      } else if (page === 'payments') {
        PaymentsPage.render(mainContent);
      } else if (page === 'insights') {
        InsightsPage.render(mainContent);
      } else if (page === 'rewards') {
        RewardsPage.render(mainContent);
      } else if (page === 'carbon') {
        CarbonPage.render(mainContent);
      } else if (page === 'profile') {
        ProfilePage.render(mainContent);
      } else if (page === 'settings') {
        SettingsPage.render(mainContent);
      } else if (page === 'security') {
        SecurityPage.render(mainContent);
      } else {
        // Fallback an toàn nếu bấm nhầm
        mainContent.innerHTML = `<div class="p-10 text-center text-ai-muted font-mono">Module [${page}] đang được phát triển.</div>`;
      }
      
    }
  },
  
  init: async () => {
    try {
      // Chỉ khôi phục session đã tồn tại, tuyệt đối không tự tạo user mock khi tải trang.
      if (window.auth && typeof auth.initSession === 'function') {
        await auth.initSession();
      }

      if (auth.isLoggedIn()) {
        // Khởi tạo dữ liệu state từ mock data
        await state.initData();
        
        // 1. Đọc trực tiếp đường dẫn trên thanh URL khi F5
        const hash = window.location.hash.replace('#/', '');
        const page = hash ? hash : 'dashboard';
        router.navigate(page);
      } else {
        router.navigate('login');
      }
    } catch (err) {
      console.error('Router init error:', err);
      // Fallback to login if something goes wrong during init
      router.navigate('login');
    }
    
    // 2. Lắng nghe khi người dùng gõ URL mới hoặc bấm nút Back/Forward của trình duyệt
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#/', '');
      router.navigate(hash || 'login');
    });
  }
};

window.router = router;
