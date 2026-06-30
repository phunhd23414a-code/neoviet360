// neoviet360/banking/cards.js
const CardsPage = {
  render: (container) => {
    const user = auth.getUser();
    
    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Quản lý thẻ</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div class="flex flex-col items-center">
            <div class="card-3d-wrap h-[240px] w-full max-w-[400px] cursor-pointer group mb-8">
              <div class="card-3d-inner relative w-full h-full">
                <div class="card-front absolute w-full h-full rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,188,212,0.2)]" 
                     style="background: linear-gradient(135deg, #0C1728 0%, #1D4ED8 100%); border: 1px solid rgba(0,212,255,0.3);">
                  <div class="absolute top-[-50px] right-[-50px] w-40 h-40 bg-status-highlight/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div class="flex justify-between items-start z-10">
                    <i data-lucide="contact" class="w-8 h-8 text-white"></i>
                    <span class="text-white font-bold tracking-widest text-[15px]">NEOVIET AI</span>
                  </div>
                  <div class="z-10 mt-6">
                    <i data-lucide="cpu" class="w-10 h-10 text-status-warning/80 mb-4"></i>
                    <div id="card-number" class="text-[22px] font-mono tracking-[0.18em] text-white drop-shadow-md transition-all">
                      4231 **** **** 9081
                    </div>
                  </div>
                  <div class="flex justify-between items-end z-10 mt-2">
                    <div class="uppercase text-[13px] font-medium text-white/80 tracking-widest">${user?.fullName || 'USER'}</div>
                    <svg class="h-8 w-14 opacity-90" viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NeoViet card network">
                      <circle cx="32" cy="26" r="20" fill="#FF5F56" fill-opacity="0.9"/>
                      <circle cx="52" cy="26" r="20" fill="#FFB800" fill-opacity="0.9"/>
                      <path d="M42 10C48.1 13.7 52 19.4 52 26C52 32.6 48.1 38.3 42 42C35.9 38.3 32 32.6 32 26C32 19.4 35.9 13.7 42 10Z" fill="#FF8A00" fill-opacity="0.95"/>
                      <path d="M20 38C27 45 57 45 64 38" stroke="rgba(255,255,255,0.65)" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                </div>
                <div class="card-back absolute w-full h-full rounded-3xl bg-[#07111F] border border-white/10 flex flex-col shadow-2xl">
                  <div class="w-full h-12 bg-black/80 mt-8"></div>
                  <div class="px-6 py-4 flex flex-col items-end gap-2 mt-2">
                    <div class="w-full bg-white/90 h-10 flex items-center justify-end px-4 rounded font-mono text-black">
                      <span class="text-[12px] text-gray-500 mr-4">CVV</span> <span id="card-cvv">***</span>
                    </div>
                    <span class="text-[10px] text-ai-muted">Phát hành bởi Ngân hàng Số NeoViet 360</span>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-[12px] text-ai-muted font-medium mb-4"><i data-lucide="mouse-pointer-click" class="inline w-3 h-3"></i> Di chuột/Chạm vào thẻ để xem mặt sau</p>
          </div>

          <div class="layer-primary rounded-3xl p-6 md:p-8 flex flex-col justify-center gap-4">
            <button id="btn-reveal" class="w-full layer-tertiary p-4 rounded-xl flex items-center gap-4 hover:border-status-highlight transition-all">
              <div class="w-10 h-10 rounded-lg bg-status-highlight/10 flex items-center justify-center"><i data-lucide="eye" class="w-5 h-5 text-status-highlight"></i></div>
              <div class="text-left"><div class="text-white font-semibold">Hiển thị số thẻ thật</div><div class="text-ai-muted text-[12px]">Xác thực sinh trắc học để xem</div></div>
            </button>

            <button id="btn-freeze" class="w-full layer-tertiary p-4 rounded-xl flex items-center gap-4 hover:border-status-alert transition-all">
              <div class="w-10 h-10 rounded-lg bg-status-alert/10 flex items-center justify-center"><i data-lucide="lock" class="w-5 h-5 text-status-alert"></i></div>
              <div class="text-left"><div class="text-white font-semibold">Khóa thẻ khẩn cấp</div><div class="text-ai-muted text-[12px]">Chặn mọi giao dịch ngay lập tức</div></div>
            </button>

            <button class="w-full layer-tertiary p-4 rounded-xl flex items-center gap-4 hover:border-status-success transition-all">
              <div class="w-10 h-10 rounded-lg bg-status-success/10 flex items-center justify-center"><i data-lucide="plus" class="w-5 h-5 text-status-success"></i></div>
              <div class="text-left"><div class="text-white font-semibold">Tạo thẻ ảo dùng 1 lần</div><div class="text-ai-muted text-[12px]">Bảo mật thanh toán quốc tế</div></div>
            </button>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
    CardsPage.bindEvents();
  },

  bindEvents: () => {
    let isRevealed = false;
    let isFrozen = false;
    
    document.getElementById('btn-reveal').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const iconContainer = btn.firstElementChild; // Lấy thẻ div bọc ngoài icon
      
      if (!isRevealed) {
        // 1. Đổi icon sang trạng thái quay Loading
        iconContainer.innerHTML = '<i data-lucide="loader" class="w-5 h-5 text-status-highlight animate-spin"></i>';
        lucide.createIcons();
        
        await mockDelay(800); // Giả lập chờ quét FaceID/Sinh trắc học
        
        // 2. Hiện số thẻ và CVV (Sử dụng giá trị mock động để tăng tính bảo mật cho luồng giả lập)
        const mockCvv = Math.floor(100 + Math.random() * 900).toString(); // Sinh CVV ngẫu nhiên khi cần thiết
        document.getElementById('card-number').innerText = "4231 8829 1102 9081";
        document.getElementById('card-cvv').innerText = mockCvv;
        
        // 3. Đổi icon thành mắt nhắm
        iconContainer.innerHTML = '<i data-lucide="eye-off" class="w-5 h-5 text-status-highlight"></i>';
        btn.querySelector('.text-white').innerText = "Ẩn số thẻ";
      } else {
        // 1. Ẩn số thẻ và CVV
        document.getElementById('card-number').innerText = "4231 **** **** 9081";
        document.getElementById('card-cvv').innerText = "***";
        
        // 2. Đổi lại icon mắt mở
        iconContainer.innerHTML = '<i data-lucide="eye" class="w-5 h-5 text-status-highlight"></i>';
        btn.querySelector('.text-white').innerText = "Hiển thị số thẻ thật";
      }
      
      // Chốt cập nhật trạng thái
      isRevealed = !isRevealed; 
      lucide.createIcons(); 
    });

    document.getElementById('btn-freeze').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const iconContainer = btn.firstElementChild;
      
      if (!isFrozen) {
        iconContainer.innerHTML = '<i data-lucide="unlock" class="w-5 h-5 text-status-success"></i>';
        iconContainer.classList.replace('bg-status-alert/10', 'bg-status-success/10');
        btn.querySelector('.text-status-alert').classList.replace('text-status-alert', 'text-status-success');
        btn.querySelector('.text-white').innerText = "Mở khóa thẻ";
      } else {
        iconContainer.innerHTML = '<i data-lucide="lock" class="w-5 h-5 text-status-alert"></i>';
        iconContainer.classList.replace('bg-status-success/10', 'bg-status-alert/10');
        btn.querySelector('.text-status-success').classList.replace('text-status-success', 'text-status-alert');
        btn.querySelector('.text-white').innerText = "Khóa thẻ khẩn cấp";
      }
      
      isFrozen = !isFrozen; 
      lucide.createIcons(); 
    });
  }
};