// neoviet360/utils/advancedAnalytics.js
// Advanced analytics engine for monthly/quarterly/yearly reports, trend analysis, and tax-ready exports

const advancedAnalytics = {
  // Group transactions by period (month, quarter, year)
  groupByPeriod: (transactions, period = 'month') => {
    const grouped = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp);
      let key;
      
      if (period === 'day') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else if (period === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (period === 'quarter') {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        key = `${date.getFullYear()}-Q${quarter}`;
      } else if (period === 'year') {
        key = `${date.getFullYear()}`;
      }
      
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(tx);
    });
    
    return grouped;
  },

  // Calculate summary stats for a period
  calculatePeriodStats: (transactions) => {
    let totalIncome = 0, totalExpense = 0, totalInvestment = 0;
    const categories = {};
    
    transactions.forEach(tx => {
      if (tx.type === 'credit') {
        totalIncome += tx.amount || 0;
      } else if (tx.type === 'debit') {
        if (tx.category === 'investment' || tx.category === 'crypto') {
          totalInvestment += tx.amount || 0;
        } else {
          totalExpense += tx.amount || 0;
        }
      }
      
      // Category breakdown
      const cat = tx.category || 'other';
      if (!categories[cat]) {
        categories[cat] = { count: 0, amount: 0, type: tx.type };
      }
      categories[cat].count++;
      categories[cat].amount += tx.amount || 0;
    });
    
    const netFlow = totalIncome - totalExpense - totalInvestment;
    const expenseRatio = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0;
    
    return {
      totalIncome,
      totalExpense,
      totalInvestment,
      netFlow,
      expenseRatio,
      transactionCount: transactions.length,
      categories
    };
  },

  // Generate monthly/quarterly/yearly reports
  generateReport: (transactions, period = 'month') => {
    const grouped = advancedAnalytics.groupByPeriod(transactions, period);
    const reports = {};
    
    Object.keys(grouped).sort().forEach(key => {
      reports[key] = advancedAnalytics.calculatePeriodStats(grouped[key]);
    });
    
    return reports;
  },

  // Calculate category trends over time
  calculateCategoryTrends: (transactions) => {
    const grouped = advancedAnalytics.groupByPeriod(transactions, 'month');
    const months = Object.keys(grouped).sort();
    const latestMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];
    
    const categoryData = {};
    
    months.forEach(month => {
      const monthTxs = grouped[month];
      monthTxs.forEach(tx => {
        if (tx.type !== 'debit') return; // Only track spending trends
        const cat = tx.category || 'other';
        if (!categoryData[cat]) categoryData[cat] = {};
        if (!categoryData[cat][month]) categoryData[cat][month] = 0;
        categoryData[cat][month] += tx.amount || 0;
      });
    });
    
    const finalTrends = {};
    Object.keys(categoryData).forEach(cat => {
      const history = months.map(m => ({
        month: m,
        amount: categoryData[cat][m] || 0
      }));
      
      const currentAmount = categoryData[cat][latestMonth] || 0;
      const previousAmount = categoryData[cat][prevMonth] || 0;
      
      let changePercent = 0;
      if (previousAmount > 0) {
        changePercent = (((currentAmount - previousAmount) / previousAmount) * 100).toFixed(1);
      } else if (currentAmount > 0) {
        changePercent = 100.0;
      }
      
      const total = history.reduce((sum, h) => sum + h.amount, 0);
      const average = total / months.length;
      
      finalTrends[cat] = {
        currentMonth: currentAmount,
        previousMonth: previousAmount,
        changePercent: parseFloat(changePercent),
        average: Math.round(average),
        history: history
      };
    });
    
    return finalTrends;
  },

  // Calculate net worth based on accounts
  calculateNetWorth: async (accounts, transactions) => {
    if (!Array.isArray(accounts)) {
      accounts = await api.fetchJSON('./data/accounts.json') || [];
    }
    
    let totalAssets = 0;
    let totalLiabilities = 0;
    
    accounts.forEach(acc => {
      if (acc.balance) {
        if (acc.type === 'credit' || acc.name?.includes('Nợ')) {
          totalLiabilities += acc.balance || 0;
        } else {
          totalAssets += acc.balance || 0;
        }
      }
    });
    
    const netWorth = totalAssets - totalLiabilities;
    
    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      accounts: accounts.map(acc => ({
        name: acc.name,
        type: acc.type,
        balance: acc.balance,
        currency: acc.currency || 'VND'
      }))
    };
  },

  // Generate tax-ready export (formatted for tax filing)
  generateTaxExport: (transactions) => {
    const headers = [
      'Ngày giao dịch',
      'Mô tả',
      'Danh mục',
      'Thu nhập',
      'Chi tiêu',
      'Tư bản đầu tư',
      'Ghi chú'
    ];
    
    const rows = transactions
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(tx => {
        const date = new Date(tx.timestamp).toLocaleDateString('vi-VN');
        let income = '', expense = '', investment = '';
        
        if (tx.type === 'credit') {
          income = tx.amount || 0;
        } else if (tx.type === 'debit') {
          if (tx.category === 'investment' || tx.category === 'crypto') {
            investment = tx.amount || 0;
          } else {
            expense = tx.amount || 0;
          }
        }
        
        return [
          date,
          tx.merchant || '',
          tx.category || '',
          income,
          expense,
          investment,
          tx.status || ''
        ];
      });
    
    return { headers, rows };
  },

  // Export to CSV format
  exportToCSV: (headers, rows, filename = 'report.csv') => {
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map(row => row.map(escapeCsv).join(','))
      .join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  },

  // Top merchants/categories analysis
  getTopItems: (transactions, type = 'merchant', limit = 10) => {
    const items = {};
    
    transactions.forEach(tx => {
      const key = type === 'merchant' ? tx.merchant : tx.category;
      if (!items[key]) {
        items[key] = { count: 0, amount: 0 };
      }
      items[key].count++;
      items[key].amount += tx.amount || 0;
    });
    
    return Object.entries(items)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  },

  // Average transaction analysis
  getAverageMetrics: (transactions) => {
    if (transactions.length === 0) return { avgAmount: 0, avgFrequency: 0 };
    
    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const avgAmount = totalAmount / transactions.length;
    
    // Calculate daily average frequency
    const dates = new Set(transactions.map(tx => new Date(tx.timestamp).toDateString()));
    const avgFrequency = transactions.length / (dates.size || 1);
    
    return {
      avgAmount: Math.round(avgAmount),
      avgFrequency: parseFloat(avgFrequency.toFixed(2)),
      medianAmount: Math.round(transactions
        .map(t => t.amount)
        .sort((a, b) => a - b)[Math.floor(transactions.length / 2)] || 0)
    };
  },

  // Year-over-year comparison
  compareYearOverYear: (transactions) => {
    const grouped = advancedAnalytics.groupByPeriod(transactions, 'month');
    const comparison = {};
    
    Object.keys(grouped).forEach(monthYear => {
      const year = monthYear.split('-')[0];
      const month = monthYear.split('-')[1];
      const key = month; // Same month across different years
      
      if (!comparison[key]) comparison[key] = {};
      comparison[key][year] = advancedAnalytics.calculatePeriodStats(grouped[monthYear]);
    });
    
    return comparison;
  },

  // Get daily spending trend for the last N days
  getDailyTrend: (transactions, days = 30) => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    
    const dailyData = {};
    // Initialize all days with 0
    for (let i = 0; i <= days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dailyData[key] = 0;
    }
    
    transactions.forEach(tx => {
      if (tx.type !== 'debit') return;
      const date = new Date(tx.timestamp);
      if (date >= startDate) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (dailyData.hasOwnProperty(key)) {
          dailyData[key] += tx.amount || 0;
        }
      }
    });
    
    return dailyData;
  }
};
