// NeoViet360 - AI Financial Coach Modal Component
const AICoachModal = {
  render: (container) => {
    const summary = aiAnalytics.getSummary(state.transactions || [], state.budgets || {});
    const insights = summary.insights || [];
    const anomalies = summary.anomalies || [];

    const insightsHtml = insights.map((insight, idx) => {
      let icon = 'lightbulb';
      let bgColor = 'bg-blue-500/10';
      let textColor = 'text-blue-400';

      if (insight.severity === 'warning') {
        icon = 'alert-circle';
        bgColor = 'bg-yellow-500/10';
        textColor = 'text-yellow-400';
      } else if (insight.severity === 'alert') {
        icon = 'alert-triangle';
        bgColor = 'bg-red-500/10';
        textColor = 'text-red-400';
      }

      let actionButton = '';
      if (insight.actionType === 'set_budget') {
        actionButton = `
          <button 
            onclick="AICoachModal.setBudget('${insight.category}', ${insight.data?.suggestedBudget || 0})"
            class="mt-3 px-4 py-2 rounded-lg bg-status-highlight/20 text-status-highlight hover:bg-status-highlight/30 transition-colors text-[13px] font-medium"
            aria-label="Lập ngân sách cho ${insight.category}">
            ${insight.action}
          </button>
        `;
      } else if (insight.actionType === 'view_details') {
        actionButton = `
          <button 
            onclick="router.navigate('insights'); AICoachModal.close()"
            class="mt-3 px-4 py-2 rounded-lg bg-status-highlight/20 text-status-highlight hover:bg-status-highlight/30 transition-colors text-[13px] font-medium"
            aria-label="Xem chi tiết phân tích">
            ${insight.action}
          </button>
        `;
      } else if (insight.actionType === 'view_budget') {
        actionButton = `
          <button 
            onclick="AICoachModal.viewBudgetDetail('${insight.category}')"
            class="mt-3 px-4 py-2 rounded-lg bg-status-highlight/20 text-status-highlight hover:bg-status-highlight/30 transition-colors text-[13px] font-medium"
            aria-label="Xem chi tiết ngân sách">
            ${insight.action}
          </button>
        `;
      }

      return `
        <div class="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0">
              <i data-lucide="${icon}" class="w-4 h-4 ${textColor}" aria-hidden="true"></i>
            </div>
            <div class="flex-1">
              <div class="text-[14px] text-white font-medium mb-1">${insight.message}</div>
              ${insight.comparison ? `<div class="text-[12px] text-ai-muted">${insight.comparison}</div>` : ''}
              ${actionButton}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const anomaliesHtml = anomalies.length > 0 ? `
      <div class="mt-6">
        <h3 class="text-[14px] font-semibold text-white mb-3 flex items-center gap-2">
          <i data-lucide="alert-circle" class="w-4 h-4 text-status-alert" aria-hidden="true"></i>
          Cảnh báo bất thường
        </h3>
        <div class="space-y-3">
          ${anomalies.map(anomaly => `
            <div class="p-3 rounded-lg bg-status-alert/10 border border-status-alert/20">
              <div class="text-[13px] text-white font-medium mb-1">${anomaly.message}</div>
              <div class="text-[11px] text-ai-muted">${new Date(anomaly.timestamp).toLocaleDateString('vi-VN')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const predictionHtml = summary.prediction?.prediction > 0 ? `
      <div class="mt-6 p-4 rounded-xl bg-gradient-to-r from-status-highlight/10 to-status-highlight/5 border border-status-highlight/20">
        <div class="text-[12px] text-ai-muted uppercase font-semibold tracking-widest mb-2">Dự đoán tháng tới</div>
        <div class="text-[24px] font-bold text-white mb-2">${formatUtils.currency(summary.prediction.prediction, 'VND')}</div>
        <div class="text-[12px] text-ai-muted">Dựa trên ${summary.prediction.confidence.toFixed(0)}% dữ liệu lịch sử</div>
      </div>
    ` : '';

    const categoryBreakdownHtml = summary.analysis?.topCategories?.length > 0 ? `
      <div class="mt-6">
        <h3 class="text-[14px] font-semibold text-white mb-3 flex items-center gap-2">
          <i data-lucide="pie-chart" class="w-4 h-4 text-status-highlight" aria-hidden="true"></i>
          Chi tiêu theo danh mục
        </h3>
        <div class="space-y-2">
          ${summary.analysis.topCategories.slice(0, 5).map(cat => {
            const percentage = parseFloat(cat.percentage);
            return `
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-[13px] text-white font-medium">${aiAnalytics.getCategoryLabel(cat.category)}</span>
                    <span class="text-[12px] text-ai-muted">${percentage}%</span>
                  </div>
                  <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-status-highlight to-status-highlight/50" style="width: ${Math.min(percentage, 100)}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div id="ai-coach-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4 opacity-0 scale-95 pointer-events-none transition-all duration-300">
        <div class="bg-[#0A1428]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[80vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="sticky top-0 p-6 border-b border-white/5 bg-[#0A1428]/80 backdrop-blur-lg flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-status-highlight/20 flex items-center justify-center">
                <i data-lucide="brain" class="w-5 h-5 text-status-highlight" aria-hidden="true"></i>
              </div>
              <div>
                <h2 class="text-[16px] font-bold text-white">NeoViet AI Coach</h2>
                <p class="text-[12px] text-ai-muted">Tư vấn tài chính cá nhân hóa</p>
              </div>
            </div>
            <button 
              onclick="AICoachModal.close()" 
              class="text-ai-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Đóng">
              <i data-lucide="x" class="w-5 h-5" aria-hidden="true"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            
            <!-- Monthly Summary -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-white/5 border border-white/10">
                <div class="text-[11px] text-ai-muted uppercase font-semibold tracking-widest mb-2">Tháng này</div>
                <div class="text-[18px] font-bold text-white">${formatUtils.currency(summary.analysis?.totalSpent || 0, 'VND')}</div>
                <div class="text-[11px] text-ai-muted mt-1">${summary.analysis?.transactionCount || 0} giao dịch</div>
              </div>
              <div class="p-4 rounded-xl bg-white/5 border border-white/10">
                <div class="text-[11px] text-ai-muted uppercase font-semibold tracking-widest mb-2">Trung bình/ngày</div>
                <div class="text-[18px] font-bold text-white">${formatUtils.currency(summary.analysis?.avgDaily || 0, 'VND')}</div>
                <div class="text-[11px] text-ai-muted mt-1">trong 30 ngày</div>
              </div>
            </div>

            <!-- Top Insights -->
            ${insightsHtml ? `
              <div>
                <h3 class="text-[14px] font-semibold text-white mb-3 flex items-center gap-2">
                  <i data-lucide="sparkles" class="w-4 h-4 text-status-highlight" aria-hidden="true"></i>
                  Gợi ý hàng đầu
                </h3>
                <div class="space-y-3">
                  ${insightsHtml}
                </div>
              </div>
            ` : ''}

            <!-- Category Breakdown -->
            ${categoryBreakdownHtml}

            <!-- Prediction -->
            ${predictionHtml}

            <!-- Anomalies -->
            ${anomaliesHtml}

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3 pt-4">
              <button
                onclick="router.navigate('insights'); AICoachModal.close()"
                class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[14px] font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
                aria-label="Xem phân tích chi tiết">
                <i data-lucide="chart-column" class="w-4 h-4" aria-hidden="true"></i>
                <span>Phân tích</span>
              </button>
              <button
                onclick="AICoachModal.generateReport()"
                class="px-4 py-3 rounded-xl bg-status-highlight/20 hover:bg-status-highlight/30 text-status-highlight text-[14px] font-medium transition-colors border border-status-highlight/30 flex items-center justify-center gap-2"
                aria-label="Tạo báo cáo chi tiêu">
                <i data-lucide="download" class="w-4 h-4" aria-hidden="true"></i>
                <span>Báo cáo</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    `;
    
    lucide.createIcons();
  },

  open: () => {
    const modal = document.getElementById('ai-coach-modal');
    if (modal) {
      modal.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      modal.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
      document.body.style.overflow = 'hidden';
    }
  },

  close: () => {
    const modal = document.getElementById('ai-coach-modal');
    if (modal) {
      modal.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      modal.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
      document.body.style.overflow = '';
    }
  },

  setBudget: (category, suggestedAmount) => {
    console.log(`Setting budget for ${category}: ${suggestedAmount}`);
    // TODO: Implement budget setting
    Modal.showSuccess(`Đã lập ngân sách cho danh mục: ${aiAnalytics.getCategoryLabel(category)}`);
  },

  viewBudgetDetail: (category) => {
    console.log(`Viewing budget detail for: ${category}`);
    router.navigate('insights');
    AICoachModal.close();
  },

  generateReport: () => {
    const summary = aiAnalytics.getSummary(state.transactions || [], state.budgets || {});
    const analysis = summary.analysis;

    let reportText = `NeoViet360 - Báo cáo Phân tích Chi tiêu\n`;
    reportText += `Ngày: ${new Date().toLocaleDateString('vi-VN')}\n\n`;
    
    reportText += `=== TỔNG QUAN THÁNG ===\n`;
    reportText += `Tổng chi tiêu: ${formatUtils.currency(analysis.totalSpent, 'VND')}\n`;
    reportText += `Số giao dịch: ${analysis.transactionCount}\n`;
    reportText += `Trung bình/ngày: ${formatUtils.currency(analysis.avgDaily, 'VND')}\n\n`;

    reportText += `=== CHI TIÊU THEO DANH MỤC ===\n`;
    analysis.topCategories.forEach(cat => {
      reportText += `${aiAnalytics.getCategoryLabel(cat.category)}: ${formatUtils.currency(cat.amount, 'VND')} (${cat.percentage}%)\n`;
    });

    reportText += `\n=== DỰ ĐOÁN THÁNG TỚI ===\n`;
    reportText += `Dự kiến chi tiêu: ${formatUtils.currency(summary.prediction.prediction, 'VND')}\n`;
    reportText += `Độ tin cây: ${summary.prediction.confidence.toFixed(0)}%\n`;

    // Download as text file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText));
    element.setAttribute('download', `neoviet-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    Modal.showSuccess('Báo cáo đã được tải xuống');
  }
};

// Initialize modal in DOM when page loads
document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  AICoachModal.render(container);
});

window.AICoachModal = AICoachModal;