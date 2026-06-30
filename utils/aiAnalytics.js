// NeoViet360 - AI Financial Coach & Spending Prediction Engine
const aiAnalytics = {
  
  /**
   * Phân tích spending patterns từ transaction history
   * @param {Array} transactions - danh sách transactions
   * @param {Number} days - số ngày để analyze (7, 30, 90)
   * @returns {Object} spending analysis
   */
  analyzeSpending: (transactions = [], days = 30) => {
    if (!transactions || transactions.length === 0) {
      return {
        totalSpent: 0,
        avgDaily: 0,
        byCategory: {},
        topCategories: [],
        periodDays: days
      };
    }

    // Filter transactions by date range
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const filtered = transactions.filter(txn => {
      const txnDate = new Date(txn.timestamp);
      return txnDate >= cutoffDate && txn.type === 'debit';
    });

    // Group by category
    const byCategory = {};
    let totalSpent = 0;

    filtered.forEach(txn => {
      const category = txn.category || 'other';
      if (!byCategory[category]) {
        byCategory[category] = { amount: 0, count: 0 };
      }
      byCategory[category].amount += txn.amount;
      byCategory[category].count += 1;
      totalSpent += txn.amount;
    });

    // Calculate percentages and sort
    const topCategories = Object.entries(byCategory)
      .map(([cat, data]) => ({
        category: cat,
        amount: data.amount,
        count: data.count,
        percentage: totalSpent > 0 ? (data.amount / totalSpent * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const avgDaily = days > 0 ? totalSpent / days : 0;

    return {
      totalSpent,
      avgDaily,
      byCategory,
      topCategories,
      transactionCount: filtered.length,
      periodDays: days,
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * So sánh spending giữa hai period
   * @param {Array} transactions - danh sách transactions
   * @returns {Object} comparison result
   */
  compareWithPreviousPeriod: (transactions = []) => {
    const currentAnalysis = aiAnalytics.analyzeSpending(transactions, 30);
    const previousAnalysis = aiAnalytics.analyzeSpending(transactions, 60);
    
    // Get last 30 days from the 60-day data
    const now = new Date();
    const current30Cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previous30Cutoff = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const previousTransactions = transactions.filter(txn => {
      const txnDate = new Date(txn.timestamp);
      return txnDate >= previous30Cutoff && txnDate < current30Cutoff && txn.type === 'debit';
    });

    const previousTotal = previousTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    const change = previousTotal > 0 
      ? ((currentAnalysis.totalSpent - previousTotal) / previousTotal * 100).toFixed(1)
      : 0;

    return {
      current: currentAnalysis.totalSpent,
      previous: previousTotal,
      change: parseFloat(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  },

  /**
   * Detect anomalies trong transactions
   * @param {Array} transactions - danh sách transactions
   * @returns {Array} anomaly alerts
   */
  detectAnomalies: (transactions = []) => {
    if (!transactions || transactions.length === 0) return [];

    const alerts = [];
    const debitTxns = transactions.filter(txn => txn.type === 'debit');
    
    if (debitTxns.length < 2) return [];

    // Calculate average transaction amount
    const avgAmount = debitTxns.reduce((sum, txn) => sum + txn.amount, 0) / debitTxns.length;
    const threshold = avgAmount * 3;

    // Find transactions way above average
    const unusualTransactions = debitTxns.filter(txn => txn.amount > threshold);

    unusualTransactions.slice(0, 3).forEach(txn => {
      const multiple = (txn.amount / avgAmount).toFixed(1);
      alerts.push({
        type: 'unusual_amount',
        severity: 'warning',
        amount: txn.amount,
        merchant: txn.merchant,
        message: `Giao dịch ${txn.merchant} với số tiền ${formatUtils.currency(txn.amount, 'VND')} cao hơn ${multiple}x trung bình của bạn`,
        timestamp: txn.timestamp
      });
    });

    // Detect multiple transactions in short time
    const sortedByTime = [...debitTxns].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    for (let i = 0; i < sortedByTime.length - 2; i++) {
      const txn1 = sortedByTime[i];
      const txn2 = sortedByTime[i + 1];
      const txn3 = sortedByTime[i + 2];
      
      const time1 = new Date(txn1.timestamp);
      const time2 = new Date(txn2.timestamp);
      const time3 = new Date(txn3.timestamp);
      
      // Check if 3 transactions in 1 hour
      if (time1 - time3 < 3600000) {
        const totalAmount = txn1.amount + txn2.amount + txn3.amount;
        if (totalAmount > avgAmount * 5) {
          alerts.push({
            type: 'rapid_spending',
            severity: 'alert',
            amount: totalAmount,
            message: `Bạn vừa thực hiện 3 giao dịch trong 1 giờ với tổng ${formatUtils.currency(totalAmount, 'VND')}`,
            timestamp: txn1.timestamp
          });
          break;
        }
      }
    }

    return alerts;
  },

  /**
   * Generate AI coaching insights
   * @param {Array} transactions - danh sách transactions
   * @param {Object} budgets - budget data
   * @returns {Array} coaching suggestions
   */
  generateInsights: (transactions = [], budgets = {}) => {
    const insights = [];
    const analysis = aiAnalytics.analyzeSpending(transactions, 30);
    const comparison = aiAnalytics.compareWithPreviousPeriod(transactions);

    // Insight 1: Top spending category
    if (analysis.topCategories.length > 0) {
      const top = analysis.topCategories[0];
      const categoryLabel = aiAnalytics.getCategoryLabel(top.category);
      
      if (top.percentage > 25) {
        insights.push({
          type: 'high_category_spending',
          severity: 'info',
          category: top.category,
          message: `Bạn chi ${top.percentage}% vào ${categoryLabel.toLowerCase()}`,
          action: 'Muốn lập ngân sách cho danh mục này?',
          actionType: 'set_budget',
          data: { category: top.category, suggestedBudget: top.amount }
        });
      }
    }

    // Insight 2: Comparison with previous period
    if (Math.abs(comparison.change) > 15) {
      const trend = comparison.change > 0 ? 'tăng' : 'giảm';
      const percent = Math.abs(comparison.change);
      insights.push({
        type: 'spending_trend',
        severity: 'info',
        message: `Chi tiêu tháng này ${trend} ${percent}% so với tháng trước`,
        action: 'Xem chi tiết',
        actionType: 'view_details'
      });
    }

    // Insight 3: Budget alerts
    if (budgets && Object.keys(budgets).length > 0) {
      Object.entries(budgets).forEach(([category, budget]) => {
        const spent = analysis.byCategory[category]?.amount || 0;
        const percentage = budget.limit > 0 ? (spent / budget.limit * 100).toFixed(1) : 0;
        
        if (percentage > 80) {
          insights.push({
            type: 'budget_alert',
            severity: percentage > 100 ? 'alert' : 'warning',
            category,
            message: `Ngân sách "${aiAnalytics.getCategoryLabel(category)}" đã dùng ${percentage}%`,
            action: percentage > 100 ? 'Vượt ngân sách' : 'Gần hết ngân sách',
            actionType: 'view_budget',
            data: { category, spent, limit: budget.limit, percentage }
          });
        }
      });
    }

    // Insight 4: Daily spending status
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todaySpent = transactions
      .filter(txn => new Date(txn.timestamp) >= today && txn.type === 'debit')
      .reduce((sum, txn) => sum + txn.amount, 0);

    if (todaySpent > 0) {
      const dailyAvg = analysis.avgDaily;
      insights.push({
        type: 'daily_status',
        severity: 'info',
        message: `Chi tiêu hôm nay: ${formatUtils.currency(todaySpent, 'VND')}`,
        status: todaySpent > dailyAvg ? 'over_average' : 'under_average',
        comparison: todaySpent > dailyAvg 
          ? `cao hơn ${((todaySpent / dailyAvg - 1) * 100).toFixed(0)}% trung bình`
          : `thấp hơn ${((1 - todaySpent / dailyAvg) * 100).toFixed(0)}% trung bình`,
        actionType: 'none'
      });
    }

    return insights;
  },

  /**
   * Predict next month spending
   * @param {Array} transactions - danh sách transactions
   * @returns {Object} prediction
   */
  predictNextMonth: (transactions = []) => {
    if (!transactions || transactions.length === 0) {
      return { prediction: 0, confidence: 0, method: 'no_data' };
    }

    const analysis = aiAnalytics.analyzeSpending(transactions, 30);
    const comparison = aiAnalytics.compareWithPreviousPeriod(transactions);

    // Simple prediction: current + (current - previous) * trend factor
    let prediction = analysis.totalSpent;
    let trendFactor = 1;

    if (comparison.trend === 'up') {
      trendFactor = 1 + (Math.abs(comparison.change) / 100) * 0.5;
    } else if (comparison.trend === 'down') {
      trendFactor = 1 - (Math.abs(comparison.change) / 100) * 0.3;
    }

    prediction = Math.round(analysis.totalSpent * trendFactor);

    return {
      prediction,
      currentMonth: analysis.totalSpent,
      previousMonth: comparison.previous,
      confidence: Math.min(90, 70 + (transactions.length / 2)), // Confidence increases with data
      method: 'trend_based',
      breakdown: analysis.topCategories.slice(0, 3).map(cat => ({
        category: cat.category,
        predicted: Math.round(cat.amount * trendFactor),
        label: aiAnalytics.getCategoryLabel(cat.category)
      }))
    };
  },

  /**
   * Get category label in Vietnamese
   * @param {String} category - category code
   * @returns {String} Vietnamese label
   */
  getCategoryLabel: (category) => {
    const labels = {
      'bill-payment': 'Hóa đơn',
      'topup': 'Nạp tiền',
      'qr-payment': 'QR Payment',
      'ewallet-topup': 'Ví điện tử',
      'ewallet-withdrawal': 'Rút ví',
      'transfer': 'Chuyển tiền',
      'eating': 'Ăn uống',
      'shopping': 'Mua sắm',
      'entertainment': 'Giải trí',
      'transport': 'Giao thông',
      'utilities': 'Tiện ích',
      'healthcare': 'Y tế',
      'education': 'Giáo dục',
      'investment': 'Đầu tư',
      'other': 'Khác'
    };
    return labels[category] || category;
  },

  /**
   * Categorize transaction by merchant
   * @param {String} merchant - tên merchant
   * @returns {String} category code
   */
  categorizeMerchant: (merchant = '') => {
    const merchantLower = merchant.toLowerCase();
    
    if (merchantLower.includes('restaurant') || merchantLower.includes('coffee') || 
        merchantLower.includes('food') || merchantLower.includes('delivery')) {
      return 'eating';
    }
    if (merchantLower.includes('shop') || merchantLower.includes('mall') || 
        merchantLower.includes('store')) {
      return 'shopping';
    }
    if (merchantLower.includes('cinema') || merchantLower.includes('movie') || 
        merchantLower.includes('game') || merchantLower.includes('spotify')) {
      return 'entertainment';
    }
    if (merchantLower.includes('taxi') || merchantLower.includes('uber') || 
        merchantLower.includes('grab') || merchantLower.includes('bus')) {
      return 'transport';
    }
    if (merchantLower.includes('hospital') || merchantLower.includes('clinic') || 
        merchantLower.includes('pharmacy')) {
      return 'healthcare';
    }
    if (merchantLower.includes('school') || merchantLower.includes('university')) {
      return 'education';
    }
    if (merchantLower.includes('electric') || merchantLower.includes('water')) {
      return 'utilities';
    }
    
    return 'other';
  },

  /**
   * Get summary for display
   * @param {Array} transactions - danh sách transactions
   * @param {Object} budgets - budget data
   * @returns {Object} summary data
   */
  getSummary: (transactions = [], budgets = {}) => {
    const analysis = aiAnalytics.analyzeSpending(transactions, 30);
    const comparison = aiAnalytics.compareWithPreviousPeriod(transactions);
    const prediction = aiAnalytics.predictNextMonth(transactions) || { prediction: 0, confidence: 0 };
    const insights = aiAnalytics.generateInsights(transactions, budgets) || [];
    const anomalies = aiAnalytics.detectAnomalies(transactions) || [];

    return {
      analysis,
      comparison,
      prediction,
      insights: insights.slice(0, 3), // Top 3 insights
      anomalies: anomalies.slice(0, 2), // Top 2 anomalies
      lastUpdated: new Date().toISOString()
    };
  }
};

window.aiAnalytics = aiAnalytics;