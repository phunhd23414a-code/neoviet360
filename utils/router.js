// neoviet360/utils/router.js
const router = {
  /** Lịch sử điều hướng để hỗ trợ nút Back */
  _history: [],
  _maxHistory: 20,

  /** Lưu trang trước khi điều hướng,
   *  tránh lưu nếu navigate('login') liên tục */
  _pushHistory(page) {
    const prev = this._history[this._history.length - 1];
    if (prev !== page && page !== 'login') {
      this._history.push(page);
      if (this._history.length > this._maxHistory) {
        this._history.shift();
      }
    }
  },

  /** Lấy trang trước đó trong lịch sử */
  getPreviousPage() {
    return this._history[this._history.length - 1] || 'dashboard';
  },

  /** Quay lại trang trước đó */
  back() {
    if (this._history.length > 0) {
      const prev = this._history.pop();
      // pop tiếp nếu trùng với current
      while (this._history.length > 0 && this._history[this._history.length - 1] === prev) {
        this._history.pop();
      }
      this.navigate(prev, { replace: true });
      return;
    }
    this.navigate('dashboard', { replace: true });
  },

  navigate: (page, opts = {}) => {
    if (state.currentPage === page && page !== 'login' && page !== 'register') return;

    if (!opts.replace) {
      // Chỉ push history nếu không phải replace
      if (state.currentPage !== 'login' && state.currentPage !== page) {
        router._pushHistory(state.currentPage);
      }
    }
    state.currentPage = page;

    // Cập nhật URL hash cho mọi trang — tạo "địa chỉ" riêng cho từng trang
    const newHash = page === 'login' ? '#/login' : `#/${page}`;
    if (window.location.hash !== newHash) {
      if (opts.replace) {
        window.location.replace(newHash);
      } else {
        window.location.hash = newHash;
      }
    }

    const appContainer = document.getElementById('app');
    const authContainer = document.getElementById('auth-layout');

    if (page === 'login' || page === 'register') {
      state.currentPage = 'login';
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }

      appContainer.classList.add('hidden');
      authContainer.classList.remove('hidden');
      authContainer.innerHTML = '';
      LoginPage.render(authContainer);
    } else {
      auth.checkProtection();

      if (!auth.isLoggedIn()) return;

      appContainer.classList.remove('hidden');
      authContainer.classList.add('hidden');

      const mainContent = document.getElementById('main-content');
      const headerContainer = document.getElementById('header-container');
      Header.render(headerContainer, page);
      if (window.BottomNav) {
        BottomNav.render(document.getElementById('bottom-nav-container'), page);
      }

      // Khối định tuyến
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
        mainContent.innerHTML = `<div class="p-10 text-center text-ai-muted font-mono">Module [${page}] đang được phát triển.</div>`;
      }

    }
  },

  init: async () => {
    try {
      if (window.auth && typeof auth.initSession === 'function') {
        await auth.initSession();
      }

      if (auth.isLoggedIn()) {
        await state.initData();

        const hash = window.location.hash.replace('#/', '');
        const page = hash ? hash : 'dashboard';
        router.navigate(page);
      } else {
        router.navigate('login');
      }
    } catch (err) {
      console.error('Router init error:', err);
      router.navigate('login');
    }

    // Lắng nghe hashchange (Back/Forward của trình duyệt)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash && hash !== state.currentPage) {
        router.navigate(hash || 'login', { replace: true });
      } else if (!hash) {
        router.navigate('login', { replace: true });
      }
    });
  }
};

window.router = router;
