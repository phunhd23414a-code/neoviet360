// neoviet360/pages/RegisterPage.js
const RegisterPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate__animated animate__fadeInUp">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Mở tài khoản</h2>
          <p class="text-sm text-gray-500 mt-2">Gia nhập hệ sinh thái tài chính 360 độ</p>
        </div>
        <form id="register-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nv-purple focus:border-nv-purple outline-none transition-all" placeholder="Ví dụ: Nguyễn Văn A" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nv-purple focus:border-nv-purple outline-none transition-all" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nv-purple focus:border-nv-purple outline-none transition-all" placeholder="Từ 6 ký tự trở lên" required>
          </div>
          <button type="submit" id="reg-btn" class="w-full bg-nv-purple text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mt-2">
            Đăng ký & Định danh eKYC
          </button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản? <a href="#" id="go-to-login" class="text-nv-purple font-medium hover:underline">Đăng nhập</a>
        </div>
      </div>
    `;
    RegisterPage.bindEvents();
  },
  
  bindEvents: () => {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('reg-btn');
      btn.innerText = "Đang khởi tạo tài khoản...";
      btn.disabled = true;
      
      await mockDelay(1500);
      
      // Đăng ký demo thành công -> tự gán thông tin user mock và vào app
      const user = await api.fetchJSON('./data/user.json');
      localStorage.setItem('nv360_session', JSON.stringify(user));
      state.user = user;
      router.navigate('dashboard');
    });

    document.getElementById('go-to-login').addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate('login');
    });
  }
};