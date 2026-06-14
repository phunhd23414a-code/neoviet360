// neoviet360/utils/router.js
const router = {
  navigate: (page) => {
    state.currentPage = page;
    const appContainer = document.getElementById('app');
    const authContainer = document.getElementById('auth-layout');

    if (page === 'login' || page === 'register') {
      appContainer.classList.add('hidden');
      authContainer.classList.remove('hidden');
      authContainer.innerHTML = ''; 
      
      if (page === 'login') LoginPage.render(authContainer);
      if (page === 'register') RegisterPage.render(authContainer);
    } else {
      if (!auth.isLoggedIn()) {
        router.navigate('login');
        return;
      }
      
      authContainer.classList.add('hidden');
      appContainer.classList.remove('hidden');
      
      const mainContent = document.getElementById('main-content');
      
      // Gọi Header một lần cho tất cả các trang
      Header.render(document.getElementById('header-container'), page);
      
      // Khối định tuyến Phase 3
      if (page === 'dashboard') {
        DashboardPage.render(mainContent);
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
        Header.render(document.getElementById('header-container'), page);
        QRPayPage.render(mainContent);
      } else if (page === 'bill-pay') {
        Header.render(document.getElementById('header-container'), page);
        BillPayPage.render(mainContent);
      } else if (page === 'ewallet') {
        Header.render(document.getElementById('header-container'), page);
        EwalletPage.render(mainContent);
      } else if (page === 'topup') {
        Header.render(document.getElementById('header-container'), page);
        TopupPage.render(mainContent);
      } else if (page === 'fx-exchange') {
        Header.render(document.getElementById('header-container'), page);
        FxExchangePage.render(mainContent);
      } else if (page === 'crypto') {
        Header.render(document.getElementById('header-container'), page);
        CryptoPage.render(mainContent);
      } else if (page === 'chatbot') {
        Header.render(document.getElementById('header-container'), page);
        ChatbotPage.render(mainContent);
      } else if (page === 'spending') {
        Header.render(document.getElementById('header-container'), page);
        SpendingPage.render(mainContent);
      } else if (page === 'marketplace') {
        Header.render(document.getElementById('header-container'), page);
        MarketplacePage.render(mainContent);
      } else if (page === 'activity') {
        ActivityPage.render(mainContent);
      } else if (page === 'payments') {
        PaymentsPage.render(mainContent);
      } else if (page === 'insights') {
        InsightsPage.render(mainContent);
      } else {
        // Fallback an toàn nếu bấm nhầm
        mainContent.innerHTML = `<div class="p-10 text-center text-ai-muted font-mono">Module [${page}] đang được phát triển.</div>`;
      }
      
    }
  },
  
  init: () => {
    if (auth.isLoggedIn()) {
      router.navigate('dashboard');
    } else {
      router.navigate('login');
    }
  }
};