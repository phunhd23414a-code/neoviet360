// neoviet360/pages/EkycPage.js
const EkycPage = {
  render: (container) => {
    container.innerHTML = `
      <div class="max-w-md mx-auto w-full pt-10 animate__animated animate__fadeIn">
        <div class="text-center mb-8">
           <div class="inline-flex items-center gap-2 bg-status-highlight/10 px-3 py-1.5 rounded-full border border-status-highlight/20 mb-4" aria-hidden="true">
             <div class="w-2 h-2 bg-status-highlight rounded-full animate-pulse"></div>
             <span class="text-[11px] font-mono text-status-highlight tracking-widest uppercase">Identity_Matrix</span>
           </div>
           <h2 class="text-2xl font-bold text-white tracking-wide">Xác thực Sinh trắc học</h2>
           <p class="text-sm text-ai-muted mt-2">Hệ thống AI cần xác minh danh tính của bạn</p>
        </div>

        <div class="layer-primary rounded-3xl p-8 relative overflow-hidden">
          <div class="absolute inset-0 cyber-grid opacity-20"></div>
          
          <div class="relative z-10 flex flex-col items-center justify-center py-10" id="ekyc-scanner">
            <div class="w-40 h-40 relative flex items-center justify-center">
               <div class="absolute inset-0 border-2 border-dashed border-ai-muted rounded-2xl animate-[spin_20s_linear_infinite]"></div>
               <div class="absolute inset-2 border border-status-highlight/40 rounded-2xl"></div>
               <div class="absolute top-0 left-0 w-full h-1 bg-status-highlight shadow-[0_0_15px_#00F5FF] animate-[scanline_2s_ease-in-out_infinite_alternate]"></div>
               
               <i data-lucide="scan-face" class="w-16 h-16 text-status-highlight drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]"></i>
            </div>
            
             <div class="mt-8 text-center" id="ekyc-status" role="status" aria-live="polite">
               <h3 class="font-bold text-white mb-1">Bước 1: Quét khuôn mặt</h3>
               <p class="text-xs text-ai-muted">Vui lòng nhìn thẳng vào camera</p>
             </div>
           </div>

           <button id="btn-scan" class="w-full relative z-10 bg-white/10 hover:bg-status-highlight/20 text-white border border-status-highlight/30 py-3.5 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] mt-6" aria-label="Bắt đầu quét sinh trắc học">
             Bắt đầu quét
           </button>
        </div>
      </div>
    `;
    lucide.createIcons();
    EkycPage.bindEvents();
  },

  bindEvents: () => {
    document.getElementById('btn-scan').addEventListener('click', async (e) => {
      const btn = e.target;
      const status = document.getElementById('ekyc-status');
      btn.disabled = true;
      btn.innerText = "Đang xử lý dữ liệu sinh trắc...";
      
      // Giả lập quá trình quét AI
      await mockDelay(1500);
      status.innerHTML = `<h3 class="font-bold text-status-success mb-1">Khớp dữ liệu: 99.8%</h3><p class="text-xs text-status-success">Đang trích xuất CCCD...</p>`;
      
      await mockDelay(1500);
      status.innerHTML = `<h3 class="font-bold text-status-success mb-1">Hoàn tất!</h3><p class="text-xs text-ai-muted">Đang thiết lập không gian làm việc...</p>`;
      
      await mockDelay(1000);
      router.navigate('dashboard');
    });
  }
};