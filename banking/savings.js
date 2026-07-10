// neoviet360/banking/savings.js
const SavingsPage = {
  render: async (container) => {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto w-full pt-4 animate__animated animate__fadeIn space-y-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            ${BackButton.render('accounts')}
            <h2 class="text-xl font-bold text-white tracking-wide">Tiết Kiệm Mục Tiêu</h2>
          </div>
          <button onclick="document.getElementById('savings-form-container').scrollIntoView({behavior: 'smooth'})" class="bg-status-success/10 text-status-success px-4 py-2 rounded-xl text-sm font-bold border border-status-success/20">
            + TẠO MỤC TIÊU MỚI
          </button>
        </div>

        <!-- Danh sách mục tiêu hiện có -->
        <div id="goals-list-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="col-span-full">${SkeletonLoader.card(2)}</div>
        </div>

        <div id="savings-form-container" class="layer-primary rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl">
          <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-5 h-5 text-status-success"></i>
            Thiết lập mục tiêu mới
          </h3>
          <form id="savings-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="md:col-span-2">
              <label class="block text-[11px] font-bold text-ai-muted mb-2 uppercase tracking-widest">Tên mục tiêu tiết kiệm</label>
              <input type="text" id="sv-goal-name" placeholder="Ví dụ: Mua Macbook, Đi du lịch..." required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-ai-muted/30 outline-none focus:border-status-success/50 transition-colors">
            </div>

            <div>
              <label class="block text-[11px] font-bold text-ai-muted mb-2 uppercase tracking-widest">Số tiền gửi ban đầu (VND)</label>
              <input type="number" id="sv-initial-amount" placeholder="Nhập số tiền..." required min="1000000"
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-xl font-bold text-status-success placeholder-ai-muted/30 outline-none focus:border-status-success/50 transition-colors">
            </div>

            <div>
              <label class="block text-[11px] font-bold text-ai-muted mb-2 uppercase tracking-widest">Số tiền mục tiêu (VND)</label>
              <input type="number" id="sv-target-amount" placeholder="Nhập số tiền..." required min="1000000"
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-xl font-bold text-status-highlight placeholder-ai-muted/30 outline-none focus:border-status-success/50 transition-colors">
            </div>

            <div>
              <label class="block text-[11px] font-bold text-ai-muted mb-2 uppercase tracking-widest">Ngày hoàn thành dự kiến</label>
              <input type="date" id="sv-deadline" required
                     class="w-full bg-ai-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-status-success/50 transition-colors">
            </div>

            <div>
              <label class="block text-[11px] font-bold text-ai-muted mb-2 uppercase tracking-widest">Kỳ hạn gửi</label>
              <div class="grid grid-cols-4 gap-3">
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors active" data-months="1" data-rate="4.5">
                  <div class="text-white font-bold">1 Tháng</div><div class="text-status-success text-xs">4.5%/năm</div>
                </div>
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors" data-months="3" data-rate="5.0">
                  <div class="text-white font-bold">3 Tháng</div><div class="text-status-success text-xs">5.0%/năm</div>
                </div>
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors" data-months="6" data-rate="6.0">
                  <div class="text-white font-bold">6 Tháng</div><div class="text-status-success text-xs">6.0%/năm</div>
                </div>
                <div class="term-box p-3 rounded-xl border border-white/10 text-center cursor-pointer transition-colors" data-months="12" data-rate="7.0">
                  <div class="text-white font-bold">12 Tháng</div><div class="text-status-success text-xs">7.0%/năm</div>
                </div>
              </div>
            </div>

            <div class="layer-tertiary p-5 rounded-xl border border-status-success/20 bg-status-success/5 md:col-span-2">
              <div class="flex justify-between mb-2"><span class="text-ai-muted text-sm font-medium">Lãi suất áp dụng:</span><span id="sv-rate-display" class="text-white font-bold">4.5% / năm</span></div>
              <div class="flex justify-between mb-2"><span class="text-ai-muted text-sm font-medium">Tiền lãi dự kiến:</span><span id="sv-interest" class="text-status-success font-bold">+0 VND</span></div>
              <div class="flex justify-between border-t border-white/10 pt-2 mt-2"><span class="text-ai-muted text-sm font-medium">Tổng gốc + lãi khi đáo hạn:</span><span id="sv-total" class="text-status-highlight font-bold">0 VND</span></div>
            </div>

            <button type="submit" id="btn-savings" class="md:col-span-2 w-full bg-status-success text-black py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_30px_rgba(0,230,118,0.5)] mt-2">
              XÁC NHẬN MỞ SỔ TIẾT KIỆM
            </button>
          </form>
        </div>
      </div>
    `;
    lucide.createIcons();
    SavingsPage.renderGoals();
    SavingsPage.bindEvents();
  },

  renderGoals: async () => {
    const container = document.getElementById('goals-list-container');
    const goals = JSON.parse(localStorage.getItem('neoviet_goals')) || [];
    
    if (goals.length === 0) {
      container.innerHTML = `
        <div class="col-span-full layer-primary rounded-3xl p-12 text-center border border-dashed border-white/10">
          <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="target" class="w-8 h-8 text-ai-muted"></i>
          </div>
          <h4 class="text-white font-bold mb-1">Chưa có mục tiêu nào</h4>
          <p class="text-ai-muted text-sm">Hãy tạo mục tiêu đầu tiên để bắt đầu hành trình tiết kiệm của bạn.</p>
        </div>
      `;
    } else {
      container.innerHTML = goals.map(goal => {
        const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
        return `
          <div class="layer-secondary rounded-2xl p-5 border border-white/5 hover:border-status-success/30 transition-all group">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="text-white font-bold group-hover:text-status-success transition-colors">${goal.name}</h4>
                <p class="text-[11px] text-ai-muted uppercase tracking-tighter font-bold mt-1">Hạn chót: ${new Date(goal.deadline).toLocaleDateString('vi-VN')}</p>
              </div>
              <div class="text-right">
                <div class="text-status-success font-bold text-sm">${Math.round(progress)}%</div>
              </div>
            </div>
            
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div class="h-full bg-status-success shadow-[0_0_10px_rgba(0,230,118,0.5)] transition-all duration-1000" style="width: ${progress}%"></div>
            </div>
            
            <div class="flex justify-between items-end">
              <div>
                <p class="text-[10px] text-ai-muted uppercase font-bold">Hiện có</p>
                <p class="text-white font-bold text-sm">${formatUtils.currency(goal.currentAmount, 'VND')}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-ai-muted uppercase font-bold">Mục tiêu</p>
                <p class="text-status-highlight font-bold text-sm">${formatUtils.currency(goal.targetAmount, 'VND')}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
    lucide.createIcons();
  },

  bindEvents: () => {
    let currentRate = 4.5;
    let currentMonths = 1;
    const inputInitial = document.getElementById('sv-initial-amount');
    
    // Logic tính lãi suất real-time
    const calculate = () => {
      const amount = parseFloat(inputInitial.value) || 0;
      const interest = (amount * (currentRate / 100) * (currentMonths * 30)) / 365;
      document.getElementById('sv-interest').innerText = `+${formatUtils.currency(Math.round(interest), 'VND')}`;
      document.getElementById('sv-total').innerText = formatUtils.currency(Math.round(amount + interest), 'VND');
    };

    // Bắt sự kiện chọn kỳ hạn
    document.querySelectorAll('.term-box').forEach(box => {
      box.addEventListener('click', (e) => {
        document.querySelectorAll('.term-box').forEach(b => {
          b.classList.remove('border-status-success', 'bg-status-success/10');
          b.classList.add('border-white/10');
        });
        const target = e.currentTarget;
        target.classList.remove('border-white/10');
        target.classList.add('border-status-success', 'bg-status-success/10');
        
        currentRate = parseFloat(target.dataset.rate);
        currentMonths = parseInt(target.dataset.months);
        document.getElementById('sv-rate-display').innerText = `${currentRate}% / năm`;
        calculate();
      });
    });

    inputInitial.addEventListener('input', calculate);
    
    // Logic Submit
    document.getElementById('savings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-savings');
      btn.disabled = true;
      btn.innerHTML = `<i class="animate-spin w-4 h-4" data-lucide="loader"></i> ĐANG XỬ LÝ...`;
      lucide.createIcons();
      
      await mockDelay(1200);
      
      const goalName = document.getElementById('sv-goal-name').value;
      const initialAmount = parseFloat(inputInitial.value) || 0;
      const targetAmount = parseFloat(document.getElementById('sv-target-amount').value) || 0;
      const deadline = document.getElementById('sv-deadline').value;
      const interest = (initialAmount * (currentRate / 100) * (currentMonths * 30)) / 365;
      const total = Math.round(initialAmount + interest);

      // Save Goal Persistence
      const newGoal = {
        id: "GOAL-" + Date.now(),
        name: goalName,
        targetAmount: targetAmount,
        currentAmount: initialAmount,
        deadline: deadline,
        rate: currentRate,
        months: currentMonths,
        timestamp: new Date().toISOString(),
        status: "active"
      };
      
      const goals = JSON.parse(localStorage.getItem('neoviet_goals')) || [];
      goals.unshift(newGoal);
      localStorage.setItem('neoviet_goals', JSON.stringify(goals));
      
      // Cập nhật state nếu cần
      if (window.state) {
        state.goals = goals;
        state.save();
      }

      SavingsPage.renderGoals();
      document.getElementById('savings-form').reset();
      calculate();

      Modal.open(`
        <div class="p-8 text-center border-b border-white/5 relative">
          <button onclick="Modal.close()" class="absolute top-6 right-6 text-ai-muted hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="w-20 h-20 rounded-full bg-status-success/20 border-2 border-status-success/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,230,118,0.2)]">
            <i data-lucide="piggy-bank" class="w-10 h-10 text-status-success"></i>
          </div>
          <h3 class="text-white text-xl font-bold mb-2">Mở Sổ Thành Công!</h3>
          <p class="text-[14px] text-ai-muted leading-relaxed">Bạn đã khởi tạo thành công sổ tiết kiệm kỳ hạn ${currentMonths} tháng với số tiền gốc ${formatUtils.currency(initialAmount, 'VND')}.</p>
        </div>
        <div class="p-6 bg-white/5 space-y-3">
          <div class="flex justify-between text-sm"><span class="text-ai-muted">Lãi suất:</span><span class="text-status-success font-bold">${currentRate}%/năm</span></div>
          <div class="flex justify-between text-sm"><span class="text-ai-muted">Tiền lãi dự kiến:</span><span class="text-white font-bold">+${formatUtils.currency(Math.round(interest), 'VND')}</span></div>
          <div class="flex justify-between text-sm border-t border-white/10 pt-3"><span class="text-ai-muted">Tổng nhận khi đáo hạn:</span><span class="text-status-highlight font-bold">${formatUtils.currency(total, 'VND')}</span></div>
          
          <button onclick="Modal.close(); router.navigate('accounts');" class="w-full bg-status-success/20 hover:bg-status-success/30 text-status-success border border-status-success/50 py-4 rounded-xl font-bold transition-all mt-4">
            XEM DANH SÁCH TÀI KHOẢN
          </button>
        </div>
      `);
      lucide.createIcons();

      btn.disabled = false;
      btn.innerHTML = `XÁC NHẬN MỞ SỔ`;
    });
  }
};
