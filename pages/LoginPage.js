// neoviet360/pages/LoginPage.js
const LoginPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden select-none animate__animated animate__fadeIn">
        <div class="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
        <div class="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-status-highlight/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-duration: 8s;"></div>
        <div class="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-status-premium/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-duration: 10s;"></div>

        <div class="w-full max-w-md bg-[#0C1728]/70 backdrop-blur-[20px] border border-[#00F5FF]/10 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10 transition-all hover:border-[#00F5FF]/20 duration-500">
          
          <div class="text-center mb-8">
            <div class="inline-flex p-3.5 rounded-2xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 mb-4 shadow-[0_0_25px_rgba(0,245,255,0.15)] animate__animated animate__zoomIn">
              <i data-lucide="sparkles" class="w-6 h-6 text-status-highlight"></i>
            </div>
            <h1 class="text-2xl font-bold text-white tracking-wide">Gate_Way Authentication</h1>
            <p class="text-ai-muted text-[11px] font-mono uppercase tracking-widest mt-1.5">Kích hoạt nút mạng tài chính NeoViet AI</p>
          </div>

          <div id="login-form-container">
            <form id="spa-login-form" class="space-y-6">
              <div>
                <label class="block text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2">Mã định danh Node / Email</label>
                <div class="relative">
                  <i data-lucide="terminal" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ai-muted"></i>
                  <input type="text" id="login-username" value="admin@neoviet360.vn" required autocomplete="off"
                         class="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)] font-mono text-[14px]">
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2">Khóa mật mã bảo mật</label>
                <div class="relative">
                  <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ai-muted"></i>
                  <input type="password" id="login-password" value="password123" required
                         class="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)] text-[14px]">
                </div>
              </div>

              <div class="flex items-center justify-between text-[12px] pt-1">
                <label class="flex items-center gap-2 text-ai-muted cursor-pointer select-none group">
                  <input type="checkbox" checked class="rounded bg-black/50 border-white/10 text-status-highlight focus:ring-0 accent-status-highlight cursor-pointer">
                  <span class="group-hover:text-white transition-colors">Ghi nhớ phiên node</span>
                </label>
                <a href="#" id="btn-recover-key" class="text-status-highlight hover:text-white transition-colors font-medium">Khôi phục khóa?</a>
              </div>

              <button type="submit" id="btn-submit-login" class="w-full bg-status-highlight/10 hover:bg-status-highlight/20 text-status-highlight border border-status-highlight/40 py-4 rounded-xl font-bold text-[14px] tracking-wide transition-all shadow-[0_0_15px_rgba(0,245,255,0.08)] hover:shadow-[0_0_25px_rgba(0,245,255,0.25)] flex items-center justify-center gap-2 mt-4 group">
                <i data-lucide="shield-check" class="w-4 h-4 group-hover:scale-110 transition-transform"></i> KÍCH HOẠT PHIÊN LÀM VIỆC
              </button>
            </form>

            <div class="mt-8 pt-6 border-t border-white/10">
              <p class="text-center text-ai-muted text-[12px] mb-4">Chưa có tài khoản?</p>
              <button type="button" id="btn-open-register" class="w-full bg-status-premium/10 hover:bg-status-premium/20 text-status-premium border border-status-premium/40 py-3 rounded-xl font-semibold text-[13px] tracking-wide transition-all shadow-[0_0_15px_rgba(200,100,255,0.08)] hover:shadow-[0_0_25px_rgba(200,100,255,0.25)] flex items-center justify-center gap-2 group">
                <i data-lucide="user-plus" class="w-4 h-4 group-hover:scale-110 transition-transform"></i> MỞ TÀI KHOẢN NGAY
              </button>
            </div>
          </div>

          <div id="register-form-container" class="hidden space-y-4">
            <button type="button" id="btn-back-login" class="text-ai-muted hover:text-white transition-colors flex items-center gap-2 text-[12px] mb-4">
              <i data-lucide="arrow-left" class="w-4 h-4"></i> Quay lại đăng nhập
            </button>
            <form id="register-form" class="space-y-4">
              <div>
                <label class="block text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2">Họ và tên</label>
                <input type="text" id="register-name" class="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]" placeholder="Ví dụ: Nguyễn Văn A" required>
              </div>
              <div>
                <label class="block text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2">Email</label>
                <input type="email" id="register-email" class="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]" required>
              </div>
              <div>
                <label class="block text-[11px] font-mono text-ai-muted uppercase tracking-widest mb-2">Mật khẩu</label>
                <input type="password" id="register-password" class="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-ai-muted/30 outline-none transition-all focus:border-status-highlight/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]" placeholder="Từ 6 ký tự trở lên" required>
              </div>
              <button type="submit" id="btn-submit-register" class="w-full bg-status-premium/10 hover:bg-status-premium/20 text-status-premium border border-status-premium/40 py-3 rounded-xl font-semibold text-[13px] tracking-wide transition-all shadow-[0_0_15px_rgba(200,100,255,0.08)] hover:shadow-[0_0_25px_rgba(200,100,255,0.25)] flex items-center justify-center gap-2 mt-4 group">
                <i data-lucide="check-circle" class="w-4 h-4 group-hover:scale-110 transition-transform"></i> ĐĂNG KÝ & ĐỊNH DANH eKYC
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    LoginPage.bindEvents();
  },

  bindEvents: () => {
    // Handle login form submission
    document.getElementById('spa-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      
      try {
        const btnSubmit = document.getElementById('btn-submit-login');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Kích hoạt...';
        lucide.createIcons();
        
        const user = await auth.login(email, password);

        // Khởi tạo dữ liệu state sau đăng nhập (giống luồng reload)
        if (window.state && typeof state.initData === 'function') {
          await state.initData();
        }

        // Navigate to dashboard after successful login
        if (window.router) {
          router.navigate('dashboard');
        }
        
      } catch (error) {
        console.error('Login error:', error);
        const message = error.message || 'Lỗi đăng nhập. Vui lòng kiểm tra thông tin.';
        
        if (window.Toast) {
          Toast.error(message);
        } else {
          alert(message);
        }
        
        const btnSubmit = document.getElementById('btn-submit-login');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i data-lucide="shield-check" class="w-4 h-4"></i> KÍCH HOẠT PHIÊN LÀM VIỆC';
        lucide.createIcons();
      }
    });

    // Handle recover key button
    document.getElementById('btn-recover-key').addEventListener('click', (e) => {
       e.preventDefault();
       Modal.open(`
         <div class="p-8 text-center border-b border-white/5 relative">
           <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
             <i data-lucide="x" class="w-5 h-5"></i>
           </button>
           <div class="w-20 h-20 rounded-full bg-status-highlight/20 border-2 border-status-highlight/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
             <i data-lucide="key" class="w-10 h-10 text-status-highlight"></i>
           </div>
          <h3 class="text-white text-xl font-bold mb-2">Khôi Phục Khóa</h3>
          <p class="text-[14px] text-ai-muted leading-relaxed">Tính năng khôi phục qua khóa private-key đang được đồng bộ với NeoViet AI Core. Vui lòng thử lại trong phiên bản tiếp theo.</p>
        </div>
        <div class="p-6 bg-white/5">
          <button onclick="Modal.close()" class="w-full bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight border border-status-highlight/50 py-4 rounded-xl font-bold transition-all">
            ĐÃ HIỂU
          </button>
        </div>
      `);
      lucide.createIcons();
    });

    document.getElementById('btn-open-register').addEventListener('click', () => {
      document.getElementById('login-form-container').classList.add('hidden');
      document.getElementById('register-form-container').classList.remove('hidden');
    });

    document.getElementById('btn-back-login').addEventListener('click', () => {
      document.getElementById('register-form-container').classList.add('hidden');
      document.getElementById('login-form-container').classList.remove('hidden');
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-register');
      btn.innerHTML = `<i class="animate-spin" data-lucide="loader"></i> ĐANG KHỞI TẠO...`;
      btn.disabled = true;
      lucide.createIcons();
      
      await mockDelay(1500);
      
      // Đăng ký demo thành công -> tự gán thông tin user mock và vào app
      try {
        const response = await fetch('./data/user.json');
        const user = await response.json();
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        if (window.state) window.state.user = user;
        
        if (window.state && typeof state.initData === 'function') {
          await state.initData();
        }
        
        window.location.hash = '#/dashboard';
        router.navigate('dashboard');
      } catch (error) {
        console.error('Lỗi đăng ký:', error);
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> ĐĂNG KÝ & ĐỊNH DANH eKYC`;
        lucide.createIcons();
      }
    });
  }
};

window.LoginPage = LoginPage;
