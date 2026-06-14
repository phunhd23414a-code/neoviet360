// neoviet360/pages/LoginPage.js
const LoginPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate__animated animate__fadeInUp">
        <div class="text-center mb-8">
          <img src="./public/logo.svg" alt="NeoViet 360" class="h-10 mx-auto mb-4">
          <h2 class="text-2xl font-bold text-gray-900">Đăng nhập</h2>
          <p class="text-sm text-gray-500 mt-2">Chào mừng trở lại với ngân hàng số thế hệ mới</p>
        </div>
        <form id="login-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="login-email" value="khoa@neoviet360.vn" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nv-blue focus:border-nv-blue outline-none transition-all" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" id="login-password" value="123456" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nv-blue focus:border-nv-blue outline-none transition-all" required>
          </div>
          <button type="submit" id="login-btn" class="w-full bg-nv-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex justify-center items-center">
            <span>Đăng nhập</span>
          </button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản? <a href="#" id="go-to-register" class="text-nv-blue font-medium hover:underline">Đăng ký ngay</a>
        </div>
      </div>
    `;
    LoginPage.bindEvents();
  },
  
  bindEvents: () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const btn = document.getElementById('login-btn');
      
      // Loading state
      btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
      btn.disabled = true;
      
      try {
        await auth.login(email, pass);
        router.navigate('dashboard');
      } catch (error) {
        alert(error.message);
        btn.innerHTML = `<span>Đăng nhập</span>`;
        btn.disabled = false;
      }
    });

    document.getElementById('go-to-register').addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate('register');
    });
  }
};