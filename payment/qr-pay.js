// neoviet360/payment/qr-pay.js
const QRPayPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-5xl mx-auto w-full pt-4 animate__animated animate__fadeIn">
        <div class="flex items-center gap-3 mb-8">
          <button onclick="router.navigate('dashboard')" class="p-2 rounded-lg bg-white/5 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <h2 class="text-xl font-bold text-white tracking-wide">Optic_Scan (VNPAY QR)</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="layer-primary rounded-3xl p-8 flex flex-col items-center text-center justify-center min-h-[400px]">
            <div class="relative w-64 h-64 mb-8">
              <div class="absolute inset-0 border border-status-highlight/20 rounded-3xl"></div>
              <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-status-highlight rounded-tl-3xl"></div>
              <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-status-highlight rounded-tr-3xl"></div>
              <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-status-highlight rounded-bl-3xl"></div>
              <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-status-highlight rounded-br-3xl"></div>
              <div class="absolute top-0 left-0 w-full h-1 bg-status-highlight shadow-[0_0_20px_#00F5FF] animate-[scanline_2s_ease-in-out_infinite_alternate]"></div>
              
              <div class="flex items-center justify-center w-full h-full">
                <i data-lucide="scan-line" class="w-16 h-16 text-ai-muted/30"></i>
              </div>
            </div>
            
             <button id="btn-qr-camera" class="w-full bg-status-highlight/10 hover:bg-status-highlight/20 text-status-highlight border border-status-highlight/40 py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,245,255,0.1)] flex items-center justify-center gap-2">
               <i data-lucide="camera" class="w-5 h-5"></i> KÍCH HOẠT CAMERA AI
             </button>
          </div>

          <div class="layer-secondary rounded-3xl p-8 flex flex-col items-center text-center justify-center">
            <h3 class="text-white font-bold mb-2 text-[18px]">Mã Nhận Tiền Sinh Trắc</h3>
            <p class="text-ai-muted text-[13px] mb-8">Hỗ trợ nhận tiền từ 40+ ngân hàng (VietQR)</p>
            
            <div class="bg-white p-5 rounded-2xl shadow-[0_0_40px_rgba(0,245,255,0.15)] mb-8 relative group">
              <div class="absolute inset-0 bg-status-highlight/10 blur-xl group-hover:blur-2xl transition-all"></div>
              <div id="qrcode-display" class="relative z-10 w-48 h-48 flex items-center justify-center"></div>
            </div>
            
            <div class="text-status-highlight font-mono tracking-widest text-[15px] bg-status-highlight/10 px-6 py-3 rounded-xl border border-status-highlight/20">
              ${auth.getUser()?.phone || '0901234567'}
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
    QRPayPage.generateQR();
    QRPayPage.bindEvents();
  },

  bindEvents: () => {
    document.getElementById('btn-qr-camera')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-qr-camera');
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> ĐANG QUÉT...';
      
      const amount = Math.floor(Math.random() * 5000000) + 500000;

      try {
        await api.payments.qrpay({
          amount,
          qrContent: "https://neoviet360.vn/pay/" + (auth.getUser()?.id || "TEST"),
          accountId: state.accounts?.[0]?.id
        });

        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="check-circle" class="w-8 h-8 text-status-success"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Nhận Tiền Thành Công</h3>
            <p class="text-[14px] text-ai-muted">Bạn vừa nhận được ${formatUtils.currency(amount, 'VND')} qua mã QR.</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close(); router.navigate('dashboard');" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              VỀ TRANG CHỦ
            </button>
          </div>
        `);
      } catch (error) {
        Modal.open(`
          <div class="p-6 text-center border-b border-white/5 relative">
            <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">Nhận Tiền Thất Bại</h3>
            <p class="text-[14px] text-ai-muted">${error.message || 'Không thể xử lý giao dịch QR lúc này.'}</p>
          </div>
          <div class="p-6 bg-white/5">
            <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
              ĐÓNG
            </button>
          </div>
        `);
      }
      lucide.createIcons();

      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="camera" class="w-5 h-5"></i> KÍCH HOẠT CAMERA AI';
    });
  },

  generateQR: () => {
    // Đợi DOM render xong mới chèn QR Code vào
    setTimeout(() => {
      const qrContainer = document.getElementById("qrcode-display");
      if(qrContainer && typeof QRCode !== 'undefined') {
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
          text: "https://neoviet360.vn/pay/" + (auth.getUser()?.id || 'TEST'),
          width: 192, height: 192,
          colorDark: "#07111F", // Màu xanh không gian
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } else if (qrContainer) {
        qrContainer.innerHTML = '<span class="text-status-alert text-sm">Thiếu CDN QRCode</span>';
      }
    }, 150);
  }
};