// neoviet360/components/Chart.js
const ChartUI = {
  renderCashFlow: (canvasId, labels, data) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Tạo dải màu gradient từ Cyan sang Purple mờ dần
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 245, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Dòng tiền',
          data: data,
          borderColor: '#00F5FF', // Màu cyan
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4, // Tạo đường cong mượt (smooth curve)
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#A855F7',
          pointBorderWidth: 2,
          pointRadius: 0, // Ẩn điểm để nhìn cho hiện đại
          pointHoverRadius: 6,
          pointHitRadius: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // Ẩn chú thích
          tooltip: {
            backgroundColor: 'rgba(12, 23, 40, 0.9)',
            titleColor: '#8B9BB4',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(0, 245, 255, 0.2)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) { return formatUtils.currency(context.parsed.y, 'VND'); }
            }
          }
        },
        scales: {
          x: { display: false }, // Ẩn trục X cho ngầu
          y: { display: false, min: 0 } // Ẩn trục Y
        },
        interaction: { mode: 'index', intersect: false }
      }
    });
  }
};