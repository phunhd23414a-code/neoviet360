// neoviet360/payment/split-bill.js
const SplitBillPage = {
  render: (container) => {
    // Dữ liệu giả lập (Mock data) danh bạ bạn bè
    const friends = [
      { id: 'f1', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=VA&background=00BCD4&color=fff', phone: '0901***123' },
      { id: 'f2', name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=TB&background=FF5F56&color=fff', phone: '0982***456' },
      { id: 'f3', name: 'Lê Hoàng C', avatar: 'https://ui-avatars.com/api/?name=LC&background=A855F7&color=fff', phone: '0913***789' },
      { id: 'f4', name: 'Phạm Văn D', avatar: 'https://ui-avatars.com/api/?name=PD&background=00E676&color=fff', phone: '0934***012' }
    ];

    const friendsHtml = friends.map(f => `
      <div class="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-ai-surface hover:bg-white/5 transition-colors cursor-pointer mb-3 friend-item" data-id="${f.id}" onclick="SplitBillPage.toggleFriend(this)">
        <div class="flex items-center gap-3">
          <img src="${f.avatar}" class="w-10 h-10 rounded-full border border-white/10">
          <div>
            <div class="text-white font-medium text-[14px]">${f.name}</div>
            <div class="text-ai-muted text-[12px]">${f.phone}</div>
          </div>
        </div>
        <div class="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center check-circle transition-colors">
          <i data-lucide="check" class="w-3.5 h-3.5 opacity-0 text-black"></i>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn pb-24 md:pb-8">
        <div class="flex items-center gap-3 mb-8">
          ${BackButton.render()}
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">Chia tiền nhóm (Split Bill)</h2>
            <p class="text-[12px] text-ai-muted mt-1">Gửi yêu cầu thanh toán nhanh chóng</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="layer-primary rounded-3xl p-6 md:p-8">
            <div class="mb-6">
              <label class="block text-[12px] font-mono text-ai-muted mb-2 uppercase tracking-widest">Tổng hóa đơn (VND)</label>
              <input type="number" id="split-total" placeholder="0" required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-4 text-3xl font-bold text-status-highlight placeholder-ai-muted/30 outline-none focus:border-status-highlight/50 transition-colors" oninput="SplitBillPage.calculate()">
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-[12px] font-mono text-ai-muted uppercase tracking-widest">Chọn người chia sẻ</label>
                <span id="selected-count" class="text-[12px] text-status-highlight font-medium">0 đã chọn</span>
              </div>
              <div class="max-h-[250px] overflow-y-auto native-scrollbar pr-2">
                ${friendsHtml}
              </div>
            </div>
          </div>

          <div class="layer-secondary rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
                <div class="w-12 h-12 rounded-2xl bg-status-highlight/10 border border-status-highlight/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,245,255,0.2)] relative z-10">
                  <i data-lucide="pie-chart" class="w-6 h-6 text-status-highlight"></i>
                </div>
                <h3 class="font-bold text-white mb-6 text-[16px]">Chi tiết chia tiền</h3>
                
                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-white/5 pb-4">
                    <span class="text-[13px] text-ai-muted font-medium">Tổng số người:</span>
                    <span id="calc-people" class="text-[14px] font-bold text-white">1 (Bao gồm bạn)</span>
                  </div>
                  <div class="flex justify-between items-center border-b border-white/5 pb-4">
                    <span class="text-[13px] text-ai-muted font-medium">Bạn tự trả:</span>
                    <span id="calc-you" class="text-[16px] font-bold text-status-success">0 ₫</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-[13px] text-ai-muted font-medium">Mỗi người bạn trả:</span>
                    <span id="calc-others" class="text-[24px] font-extrabold text-status-highlight drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]">0 ₫</span>
                  </div>
                </div>
            </div>

            <div class="mt-8">
              <div class="mb-4">
                <input type="text" id="split-note" placeholder="Ví dụ: Tiền ăn lẩu Haidilao..." 
                       class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-status-highlight/50 transition-colors">
              </div>
              <button onclick="SplitBillPage.confirm()" id="btn-split" class="w-full bg-status-highlight hover:bg-status-highlight/90 text-black py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)] flex items-center justify-center gap-2">
                <i data-lucide="send" class="w-5 h-5"></i> GỬI YÊU CẦU THANH TOÁN
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
    lucide.createIcons();
  },

  toggleFriend: (el) => {
    el.classList.toggle('active');
    const checkCircle = el.querySelector('.check-circle');
    const checkIcon = el.querySelector('i');
    
    // Hiệu ứng check/uncheck xịn xò
    if (el.classList.contains('active')) {
      el.classList.replace('border-white/5', 'border-status-highlight/50');
      el.classList.replace('bg-ai-surface', 'bg-status-highlight/10');
      checkCircle.classList.replace('border-white/20', 'bg-status-highlight');
      checkCircle.classList.add('border-status-highlight');
      checkIcon.classList.remove('opacity-0');
    } else {
      el.classList.replace('border-status-highlight/50', 'border-white/5');
      el.classList.replace('bg-status-highlight/10', 'bg-ai-surface');
      checkCircle.classList.replace('bg-status-highlight', 'border-white/20');
      checkCircle.classList.remove('border-status-highlight');
      checkIcon.classList.add('opacity-0');
    }
    
    SplitBillPage.calculate();
  },

  calculate: () => {
    const totalInput = document.getElementById('split-total');
    const totalAmount = parseFloat(totalInput.value) || 0;
    
    const selectedFriends = document.querySelectorAll('.friend-item.active').length;
    const totalPeople = selectedFriends + 1; // Bao gồm cả user
    
    document.getElementById('selected-count').innerText = `${selectedFriends} đã chọn`;
    document.getElementById('calc-people').innerText = `${totalPeople} (Bao gồm bạn)`;
    
    if (totalAmount === 0) {
      document.getElementById('calc-you').innerText = '0 ₫';
      document.getElementById('calc-others').innerText = '0 ₫';
      return;
    }

    const splitAmount = Math.round(totalAmount / totalPeople);
    
    document.getElementById('calc-you').innerText = formatUtils.currency(splitAmount, 'VND');
    document.getElementById('calc-others').innerText = formatUtils.currency(splitAmount, 'VND');
  },

  confirm: async () => {
    const totalAmount = parseFloat(document.getElementById('split-total').value) || 0;
    const selectedElements = document.querySelectorAll('.friend-item.active');
    const selectedFriendsCount = selectedElements.length;
    const note = document.getElementById('split-note').value || 'Chia hóa đơn';
    
    if (totalAmount <= 0) {
      Modal.open(`
        <div class="p-6 text-center border-b border-white/5 relative">
           <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
             <i data-lucide="x" class="w-5 h-5"></i>
           </button>
           <div class="w-16 h-16 rounded-full bg-status-warning/20 border border-status-warning/30 flex items-center justify-center mx-auto mb-4">
             <i data-lucide="alert-triangle" class="w-8 h-8 text-status-warning"></i>
           </div>
           <h3 class="text-white text-lg font-bold mb-1">Lỗi nhập liệu</h3>
           <p class="text-[14px] text-ai-muted">Vui lòng nhập tổng số tiền cần chia!</p>
        </div>
      `);
      lucide.createIcons();
      return;
    }
    if (selectedFriendsCount === 0) {
      Modal.open(`
        <div class="p-6 text-center border-b border-white/5 relative">
           <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
             <i data-lucide="x" class="w-5 h-5"></i>
           </button>
           <div class="w-16 h-16 rounded-full bg-status-warning/20 border border-status-warning/30 flex items-center justify-center mx-auto mb-4">
             <i data-lucide="users" class="w-8 h-8 text-status-warning"></i>
           </div>
           <h3 class="text-white text-lg font-bold mb-1">Thiếu người tham gia</h3>
           <p class="text-[14px] text-ai-muted">Vui lòng chọn ít nhất 1 người để chia tiền!</p>
        </div>
      `);
      lucide.createIcons();
      return;
    }

    const btn = document.getElementById('btn-split');
    btn.disabled = true;
    btn.innerHTML = '<i class="animate-spin" data-lucide="loader"></i> ĐANG TẠO LINK YÊU CẦU...';
    lucide.createIcons();

    const splitAmount = Math.round(totalAmount / (selectedFriendsCount + 1));
    const members = Array.from(selectedElements).map(el => ({
      id: el.dataset.id,
      name: el.querySelector('.text-white').innerText,
      amount: splitAmount,
      status: 'pending'
    }));

    try {
      await api.splitBills.create({
        title: note,
        totalAmount,
        members
      });

      const html = `
        <div class="p-8 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 left-6 text-ai-muted hover:text-white transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-20 h-20 rounded-full bg-status-highlight/20 border-2 border-status-highlight/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
              <i data-lucide="share-2" class="w-10 h-10 text-status-highlight"></i>
          </div>
          <h3 class="text-white text-xl font-bold mb-2">Đã gửi yêu cầu!</h3>
          <p class="text-[14px] text-ai-muted leading-relaxed">Yêu cầu chia ${formatUtils.currency(totalAmount, 'VND')} đã được tạo và gửi đến ${selectedFriendsCount} người bạn.</p>
        </div>
        <div class="p-6">
          <button onclick="Modal.close(); router.navigate('dashboard');" class="w-full bg-status-highlight hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] text-black py-4 rounded-xl font-bold transition-all">
            HOÀN TẤT
          </button>
        </div>
      `;
      Modal.open(html);
      lucide.createIcons();
    } catch (error) {
      Modal.open(`
        <div class="p-6 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-16 h-16 rounded-full bg-status-error/20 border border-status-error/30 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="alert-circle" class="w-8 h-8 text-status-error"></i>
          </div>
          <h3 class="text-white text-lg font-bold mb-1">Tạo yêu cầu thất bại</h3>
          <p class="text-[14px] text-ai-muted">${error.message || 'Không thể tạo yêu cầu chia tiền lúc này.'}</p>
        </div>
        <div class="p-6 bg-white/5">
          <button onclick="Modal.close()" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
            ĐÃ HIỂU
          </button>
        </div>
      `);
      lucide.createIcons();
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="send" class="w-5 h-5"></i> GỬI YÊU CẦU THANH TOÁN';
      lucide.createIcons();
    }
  }
};

window.SplitBillPage = SplitBillPage;