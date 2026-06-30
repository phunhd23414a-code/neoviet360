const formatUtils = {
  // Format tiền tệ: 1000000 -> "1,000,000 VND"
  currency: (amount, currencyCode = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: currencyCode === 'VND' ? 0 : 2
    }).format(amount);
  },

  // Che số tài khoản/số thẻ: "1234567890123456" -> "1234 **** **** 3456"
  maskAccount: (accNum) => {
    if (!accNum || accNum.length < 8) return accNum;
    const str = accNum.replace(/\s/g, '');
    const first4 = str.substring(0, 4);
    const last4 = str.substring(str.length - 4);
    return `${first4} **** **** ${last4}`;
  },

  // Format ngày tháng tương đối: "2 giờ trước", "Hôm qua"
  relativeTime: (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHrs < 24) return `${diffHrs} giờ trước`;
    if (diffDays === 1) return `Hôm qua, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    return date.toLocaleDateString('vi-VN');
  }
};

window.formatUtils = formatUtils;
