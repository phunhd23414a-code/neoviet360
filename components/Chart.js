// neoviet360/components/Chart.js
const ChartUI = {
  renderCashFlow: (canvasId, labels, datasets) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    if (!container) return;

    // Cleanup listener cũ nếu chart được render lại khi chuyển trang/state update
    if (typeof canvas.__cashFlowCleanup === 'function') {
      canvas.__cashFlowCleanup();
      canvas.__cashFlowCleanup = null;
    }

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    let tooltip = container.querySelector('.cash-flow-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'cash-flow-tooltip';
      tooltip.style.cssText = [
        'position:absolute',
        'z-index:30',
        'pointer-events:none',
        'opacity:0',
        'transform:translate(-50%, calc(-100% - 14px))',
        'transition:opacity 120ms ease, transform 120ms ease',
        'background:rgba(15,23,42,0.94)',
        'border:1px solid rgba(255,255,255,0.12)',
        'box-shadow:0 18px 45px rgba(0,0,0,0.35)',
        'backdrop-filter:blur(14px)',
        'border-radius:14px',
        'padding:10px 12px',
        'min-width:170px',
        'color:#E2E8F0',
        'font-family:"Outfit", sans-serif',
        'font-size:12px',
        'line-height:1.45'
      ].join(';');
      container.appendChild(tooltip);
    }

    // Lấy kích thước thực tế của container
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width <= 0 || height <= 0) return;

    // Set kích thước canvas (xử lý High DPI)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Reset transform để tránh scale chồng nếu browser giữ context state
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Padding
    const padding = { top: 40, right: 40, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Tìm giá trị lớn nhất để scale trục Y
    let maxValue = 0;
    ['income', 'expense', 'savings'].forEach(key => {
      if (datasets[key] && datasets[key].length) {
        const maxInArr = Math.max(...datasets[key]);
        if (maxInArr > maxValue) maxValue = maxInArr;
      }
    });

    // Làm tròn lên số chẵn gần nhất (ví dụ: 42M -> 50M)
    maxValue = Math.max(10000000, Math.ceil(maxValue / 10000000) * 10000000);

    const safePointGap = labels.length > 1 ? chartWidth / (labels.length - 1) : chartWidth;

    // Hàm tính tọa độ X, Y
    const getX = index => padding.left + (labels.length > 1 ? index * safePointGap : chartWidth / 2);
    const getY = value => padding.top + chartHeight - (value / maxValue) * chartHeight;

    const seriesMeta = [
      { key: 'savings', label: 'Tiết kiệm', color: '#00F5FF', glow: 'rgba(0, 245, 255, 0.5)', dashed: true },
      { key: 'expense', label: 'Chi tiêu', color: '#FF5F56', glow: 'rgba(255, 95, 86, 0.5)' },
      { key: 'income', label: 'Thu nhập', color: '#00E676', glow: 'rgba(0, 230, 118, 0.5)', ecoGradient: true }
    ];

    const formatMoney = value => {
      if (typeof value !== 'number' || Number.isNaN(value)) return '—';
      if (Math.abs(value) >= 1000000) {
        const millions = value / 1000000;
        return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M ₫`;
      }
      return `${value.toLocaleString('vi-VN')} ₫`;
    };

    const getPointColor = meta => (meta.ecoGradient ? '#00E676' : meta.color);

    const drawBezierLine = (data, meta, activeIndex = null) => {
      if (!data || data.length === 0) return;

      ctx.beginPath();
      ctx.moveTo(getX(0), getY(data[0]));

      for (let i = 0; i < data.length - 1; i++) {
        const xMid = (getX(i) + getX(i + 1)) / 2;
        const y1 = getY(data[i]);
        const y2 = getY(data[i + 1]);
        ctx.bezierCurveTo(xMid, y1, xMid, y2, getX(i + 1), y2);
      }

      // Style nét vẽ
      if (meta.ecoGradient) {
        const lineGrad = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
        lineGrad.addColorStop(0, '#A855F7'); // Purple AI
        lineGrad.addColorStop(1, '#00E676'); // Green Eco
        ctx.strokeStyle = lineGrad;
      } else {
        ctx.strokeStyle = meta.color;
      }

      ctx.lineWidth = activeIndex !== null ? 3.5 : 3;
      ctx.setLineDash(meta.dashed ? [5, 5] : []);

      // Hiệu ứng phát sáng (Glow)
      ctx.shadowColor = meta.glow;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      ctx.stroke();

      // Reset shadow cho fill
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // Vẽ Fill Gradient mờ xuống trục X
      ctx.lineTo(getX(data.length - 1), height - padding.bottom);
      ctx.lineTo(getX(0), height - padding.bottom);
      ctx.closePath();

      const fillGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);

      if (meta.ecoGradient) {
        fillGrad.addColorStop(0, 'rgba(168, 85, 247, 0.2)'); // Purple AI
        fillGrad.addColorStop(1, 'rgba(0, 230, 118, 0)'); // Green Eco transparent
      } else {
        let r, g, b;
        if (meta.color === '#00E676') {
          r = 0;
          g = 230;
          b = 118;
        } else if (meta.color === '#FF5F56') {
          r = 255;
          g = 95;
          b = 86;
        } else if (meta.color === '#00F5FF') {
          r = 0;
          g = 245;
          b = 255;
        } else {
          r = 255;
          g = 255;
          b = 255;
        }
        fillGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
        fillGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      }

      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Vẽ các điểm (Points)
      ctx.setLineDash([]);
      data.forEach((val, i) => {
        const isActive = activeIndex === i;
        const x = getX(i);
        const y = getY(val);

        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `${getPointColor(meta)}33`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, isActive ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = getPointColor(meta);
        ctx.fill();
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      });
    };

    const drawLegend = () => {
      const legendY = 15;
      let currentX = width - padding.right;

      const items = [
        { label: 'Tiết kiệm', color: '#00F5FF' },
        { label: 'Chi tiêu', color: '#FF5F56' },
        { label: 'Thu nhập', color: '#00E676' }
      ];

      ctx.font = '12px "Outfit", sans-serif';
      ctx.textBaseline = 'middle';

      items.forEach(item => {
        // Tính chiều rộng text
        const textWidth = ctx.measureText(item.label).width;

        // Vẽ text
        ctx.fillStyle = '#E2E8F0';
        ctx.textAlign = 'right';
        ctx.fillText(item.label, currentX, legendY);

        // Vẽ chấm màu
        ctx.beginPath();
        ctx.arc(currentX - textWidth - 10, legendY, 4, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();

        // Cập nhật vị trí X cho item tiếp theo
        currentX -= textWidth + 30;
      });
    };

    const drawHoverGuide = activeIndex => {
      if (activeIndex === null || activeIndex < 0 || activeIndex >= labels.length) return;

      const x = getX(activeIndex);

      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(x, height - padding.bottom, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();
    };

    const render = (activeIndex = null) => {
      // Xóa canvas
      ctx.clearRect(0, 0, width, height);

      // Vẽ lưới (Grid)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const numGridLines = 5;
      for (let i = 0; i <= numGridLines; i++) {
        const y = padding.top + (chartHeight / numGridLines) * i;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);

        // Vẽ nhãn trục Y
        ctx.fillStyle = '#94A3B8';
        ctx.font = '11px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const val = maxValue - (maxValue / numGridLines) * i;
        ctx.fillText(`${val / 1000000}M`, padding.left - 10, y);
      }
      ctx.stroke();

      // Vẽ nhãn trục X
      labels.forEach((label, i) => {
        const x = getX(i);
        ctx.fillStyle = activeIndex === i ? '#FFFFFF' : '#94A3B8';
        ctx.font = `${activeIndex === i ? '600 ' : ''}12px "Outfit", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x, height - padding.bottom + 10);
      });

      drawHoverGuide(activeIndex);

      // Vẽ các đường dữ liệu theo thứ tự cũ
      seriesMeta.forEach(meta => {
        if (datasets[meta.key]) drawBezierLine(datasets[meta.key], meta, activeIndex);
      });

      drawLegend();
    };

    const updateTooltip = (activeIndex, pointerX) => {
      if (activeIndex === null) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translate(-50%, calc(-100% - 8px))';
        return;
      }

      const rows = [
        { key: 'income', label: 'Thu nhập', color: '#00E676' },
        { key: 'expense', label: 'Chi tiêu', color: '#FF5F56' },
        { key: 'savings', label: 'Tiết kiệm', color: '#00F5FF' }
      ]
        .filter(item => datasets[item.key] && datasets[item.key][activeIndex] !== undefined)
        .map(item => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:4px;">
            <span style="display:flex;align-items:center;gap:6px;color:#CBD5E1;">
              <span style="width:7px;height:7px;border-radius:999px;background:${item.color};box-shadow:0 0 10px ${item.color};"></span>
              ${item.label}
            </span>
            <strong style="color:#F8FAFC;font-weight:700;">${formatMoney(datasets[item.key][activeIndex])}</strong>
          </div>
        `)
        .join('');

      tooltip.innerHTML = `
        <div style="font-weight:800;color:#FFFFFF;margin-bottom:6px;">${labels[activeIndex]}</div>
        ${rows}
      `;

      const clampedX = Math.min(Math.max(pointerX, 92), width - 92);
      const highestY = Math.min(
        ...seriesMeta
          .filter(meta => datasets[meta.key] && datasets[meta.key][activeIndex] !== undefined)
          .map(meta => getY(datasets[meta.key][activeIndex]))
      );
      const tooltipY = Math.max(44, highestY - 10);

      tooltip.style.left = `${clampedX}px`;
      tooltip.style.top = `${tooltipY}px`;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translate(-50%, calc(-100% - 14px))';
    };

    let currentActiveIndex = null;

    const getMousePosition = event => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    const handlePointerMove = event => {
      const pos = getMousePosition(event);

      if (
        pos.x < padding.left - safePointGap / 2 ||
        pos.x > width - padding.right + safePointGap / 2 ||
        pos.y < padding.top - 30 ||
        pos.y > height - padding.bottom + 30
      ) {
        currentActiveIndex = null;
        render(null);
        updateTooltip(null);
        return;
      }

      let nearestIndex = 0;
      let nearestDistance = Infinity;

      labels.forEach((_, index) => {
        const distance = Math.abs(pos.x - getX(index));
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      const hitRadius = Math.max(28, safePointGap / 2);
      if (nearestDistance > hitRadius) {
        currentActiveIndex = null;
        render(null);
        updateTooltip(null);
        return;
      }

      if (currentActiveIndex !== nearestIndex) {
        currentActiveIndex = nearestIndex;
        render(currentActiveIndex);
      }

      updateTooltip(currentActiveIndex, pos.x);
    };

    const handlePointerLeave = () => {
      currentActiveIndex = null;
      render(null);
      updateTooltip(null);
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('touchstart', handlePointerMove, { passive: true });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
    canvas.addEventListener('touchend', handlePointerLeave);

    canvas.__cashFlowCleanup = () => {
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      canvas.removeEventListener('touchstart', handlePointerMove);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchend', handlePointerLeave);
    };

    render(null);
  }
};

window.ChartUI = ChartUI;