// Simple and clean chart drawing functions

function drawBarChart(canvasId, data, labels) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Chart settings
  const chartWidth = width - 120;
  const chartHeight = height - 120;
  const barCount = data.length;
  const barWidth = Math.max(35, (chartWidth / barCount) * 0.7);
  const barSpacing = (chartWidth - (barWidth * barCount)) / (barCount + 1);

  // Find max value for scaling
  const maxValue = Math.max(...data);
  const scale = maxValue > 0 ? chartHeight / maxValue : 1;

  // Colors - more professional palette
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ecdc4', '#45b7d1'];

  // Draw grid lines
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = height - 70 - (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(width - 40, y);
    ctx.stroke();
  }

  // Draw bars
  data.forEach((value, index) => {
    const x = 70 + barSpacing + (index * (barWidth + barSpacing));
    const barHeight = value * scale;
    const y = height - 70 - barHeight;

    // Draw bar with gradient
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, colors[index % colors.length]);
    gradient.addColorStop(1, colors[index % colors.length] + '80'); // Add transparency

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw bar border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Draw value on top of bar
    if (barHeight > 30) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toLocaleString(), x + barWidth / 2, y + 20);
    }

    // Draw label below bar
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Truncate long labels if needed
    let label = labels[index];
    if (ctx.measureText(label).width > barWidth + 10) {
      label = label.substring(0, 6) + '...';
    }

    ctx.fillText(label, x + barWidth / 2, height - 40);
  });

  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(60, 40);
  ctx.lineTo(60, height - 70);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(60, height - 70);
  ctx.lineTo(width - 40, height - 70);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = '#666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxValue / 5) * i);
    const y = height - 70 - (chartHeight / 5) * i;
    ctx.fillText(value.toLocaleString(), 55, y + 4);
  }
}

function drawPieChart(canvasId, data, labels) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2 - 30; // Moved left by 30px to balance with legend repositioning
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40; // Even larger pie chart

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  const total = data.reduce((sum, value) => sum + value, 0);
  if (total === 0) return;

  let startAngle = -Math.PI / 2; // Start from top

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];

  // Draw slices
  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    // Draw slice with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, colors[index % colors.length]);
    gradient.addColorStop(1, colors[index % colors.length] + 'CC'); // Slightly transparent

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw slice border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate percentage
    const percentage = Math.round((value / total) * 100);

    // Draw percentage label on slice (only if slice is large enough)
    if (percentage >= 12) {
      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.85; // Increased from 0.8 to 0.85 for better positioning on even larger pie
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeText(percentage + '%', labelX, labelY + 6);
      ctx.fillText(percentage + '%', labelX, labelY + 6);
    }

    startAngle = endAngle;
  });

  // Draw legend with better styling
  const legendX = width - 130; // Moved further left from -140 to -130
  const legendY = 70;
  const legendItemHeight = 28;

  labels.forEach((label, index) => {
    const percentage = Math.round((data[index] / total) * 100);

    // Color box with border
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(legendX, legendY + index * legendItemHeight, 18, 18);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY + index * legendItemHeight, 18, 18);

    // Label text
    ctx.fillStyle = '#333';
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${label}: ${percentage}%`, legendX + 25, legendY + index * legendItemHeight + 14);
  });

  // Add a subtle shadow effect to the entire chart
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
}

// Function to update metric change classes
function updateMetricChangeClasses(changes) {
  const metricCards = document.querySelectorAll('.metric-card');

  metricCards.forEach((card, index) => {
    const changeText = Object.values(changes)[index];

    // Remove existing classes
    card.classList.remove('positive', 'negative', 'neutral', 'warning');

    // Add appropriate class based on content
    if (changeText.includes('+')) {
      card.classList.add('positive');
    } else if (changeText.includes('-')) {
      card.classList.add('negative');
    } else if (changeText.includes('Requiere atención') || changeText.includes('Mejorando') || changeText.includes('Estable')) {
      card.classList.add('warning');
    } else {
      card.classList.add('neutral');
    }
  });
}

// Export data to CSV
function exportToCSV() {
  const data = dataSets[currentPeriod];
  const csvData = [
    ['Métrica', 'Valor', 'Cambio'],
    ['Ventas Totales', data.metrics.ventas, data.changes.ventas],
    ['Clientes Diarios', data.metrics.clientes, data.changes.clientes],
    ['Productos Vendidos', data.metrics.productos, data.changes.productos],
    ['Satisfacción del Cliente', data.metrics.satisfaccion, data.changes.satisfaccion],
    ['Inventario Bajo', data.metrics.inventario, data.changes.inventario],
    ['Margen de Ganancia', data.metrics.margen, data.changes.margen],
    ['Pedidos Pendientes', data.metrics.pedidos, data.changes.pedidos],
    ['Tiempo Promedio de Entrega', data.metrics.tiempo, data.changes.tiempo]
  ];

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `dashboard-panaderia-${currentPeriod}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Data sets for different periods
const dataSets = {
  'month': {
    sales: [3200, 4100, 3800, 5200, 4800, 6100],
    categories: [40, 25, 20, 15],
    metrics: {
      ventas: '$12,450',
      clientes: '87',
      productos: '1,234',
      satisfaccion: '96%',
      inventario: '3 productos',
      margen: '42%',
      pedidos: '12 pedidos',
      tiempo: '18 min'
    },
    changes: {
      ventas: '+15% vs mes anterior',
      clientes: '+22% vs mes anterior',
      productos: '-5% vs mes anterior',
      satisfaccion: '+3% vs mes anterior',
      inventario: 'Requiere atención',
      margen: '+8% vs mes anterior',
      pedidos: 'En proceso',
      tiempo: '-5 min vs mes anterior'
    }
  },
  'quarter': {
    sales: [9500, 12200, 11400, 15600, 14400, 18300],
    categories: [42, 28, 18, 12],
    metrics: {
      ventas: '$37,350',
      clientes: '261',
      productos: '3,702',
      satisfaccion: '95%',
      inventario: '2 productos',
      margen: '45%',
      pedidos: '8 pedidos',
      tiempo: '16 min'
    },
    changes: {
      ventas: '+12% vs trimestre anterior',
      clientes: '+18% vs trimestre anterior',
      productos: '-3% vs trimestre anterior',
      satisfaccion: '+2% vs trimestre anterior',
      inventario: 'Mejorando',
      margen: '+6% vs trimestre anterior',
      pedidos: 'En proceso',
      tiempo: '-3 min vs trimestre anterior'
    }
  },
  'year': {
    sales: [38000, 48800, 45600, 62400, 57600, 73200],
    categories: [38, 30, 22, 10],
    metrics: {
      ventas: '$149,400',
      clientes: '1,044',
      productos: '14,808',
      satisfaccion: '97%',
      inventario: '1 producto',
      margen: '48%',
      pedidos: '15 pedidos',
      tiempo: '14 min'
    },
    changes: {
      ventas: '+25% vs año anterior',
      clientes: '+35% vs año anterior',
      productos: '+8% vs año anterior',
      satisfaccion: '+5% vs año anterior',
      inventario: 'Estable',
      margen: '+12% vs año anterior',
      pedidos: 'En proceso',
      tiempo: '-8 min vs año anterior'
    }
  }
};

// Current period
let currentPeriod = 'month';

// Function to update dashboard
function updateDashboard(period) {
  currentPeriod = period;
  const data = dataSets[period];

  // Update metrics
  document.querySelector('.metric-card:nth-child(1) .metric-value').textContent = data.metrics.ventas;
  document.querySelector('.metric-card:nth-child(2) .metric-value').textContent = data.metrics.clientes;
  document.querySelector('.metric-card:nth-child(3) .metric-value').textContent = data.metrics.productos;
  document.querySelector('.metric-card:nth-child(4) .metric-value').textContent = data.metrics.satisfaccion;
  document.querySelector('.metric-card:nth-child(5) .metric-value').textContent = data.metrics.inventario;
  document.querySelector('.metric-card:nth-child(6) .metric-value').textContent = data.metrics.margen;
  document.querySelector('.metric-card:nth-child(7) .metric-value').textContent = data.metrics.pedidos;
  document.querySelector('.metric-card:nth-child(8) .metric-value').textContent = data.metrics.tiempo;

  // Update metric changes
  document.querySelector('.metric-card:nth-child(1) .metric-change').textContent = data.changes.ventas;
  document.querySelector('.metric-card:nth-child(2) .metric-change').textContent = data.changes.clientes;
  document.querySelector('.metric-card:nth-child(3) .metric-change').textContent = data.changes.productos;
  document.querySelector('.metric-card:nth-child(4) .metric-change').textContent = data.changes.satisfaccion;
  document.querySelector('.metric-card:nth-child(5) .metric-change').textContent = data.changes.inventario;
  document.querySelector('.metric-card:nth-child(6) .metric-change').textContent = data.changes.margen;
  document.querySelector('.metric-card:nth-child(7) .metric-change').textContent = data.changes.pedidos;
  document.querySelector('.metric-card:nth-child(8) .metric-change').textContent = data.changes.tiempo;

  // Update classes for styling
  updateMetricChangeClasses(data.changes);

  // Update chart titles based on period
  const periodNames = {
    'month': 'Mensuales',
    'quarter': 'Trimestrales',
    'year': 'Anuales'
  };

  const periodName = periodNames[period];
  document.querySelector('.chart-container:nth-child(1) h3').textContent = `Ventas ${periodName} por Producto`;
  document.querySelector('.chart-container:nth-child(2) h3').textContent = `Distribución de Ventas por Categoría`;

  // Update charts
  const salesLabels = ['Medialunas', 'Croissants', 'Tartas', 'Tortas', 'Galletas', 'Panes'];
  drawBarChart('salesChart', data.sales, salesLabels);

  const categoryLabels = ['Panadería', 'Repostería', 'Bebidas', 'Otros'];
  drawPieChart('categoryChart', data.categories, categoryLabels);
}

// Export data to CSV
function exportToCSV() {
  const data = dataSets[currentPeriod];
  const csvData = [
    ['Métrica', 'Valor', 'Cambio'],
    ['Ventas Totales', data.metrics.ventas, data.changes.ventas],
    ['Clientes Diarios', data.metrics.clientes, data.changes.clientes],
    ['Productos Vendidos', data.metrics.productos, data.changes.productos],
    ['Satisfacción del Cliente', data.metrics.satisfaccion, data.changes.satisfaccion],
    ['Inventario Bajo', data.metrics.inventario, data.changes.inventario],
    ['Margen de Ganancia', data.metrics.margen, data.changes.margen],
    ['Pedidos Pendientes', data.metrics.pedidos, data.changes.pedidos],
    ['Tiempo Promedio de Entrega', data.metrics.tiempo, data.changes.tiempo]
  ];

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `dashboard-panaderia-${currentPeriod}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateDashboard('month');

  // Period filter functionality
  document.getElementById('period').addEventListener('change', function() {
    updateDashboard(this.value);
  });

  // Export button functionality
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);

  // Table action buttons functionality
  initializeTableActions();
});

// Table Actions Functions
function initializeTableActions() {
  // View order details
  document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const orderId = row.querySelector('.order-id').textContent;
      const customerName = row.querySelector('.customer-name').textContent;
      const products = Array.from(row.querySelectorAll('.product-item')).map(item => item.textContent).join(', ');
      const total = row.querySelector('.price').textContent;

      showOrderDetails(orderId, customerName, products, total);
    });
  });

  // Confirm pending orders
  document.querySelectorAll('.action-btn.confirm').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const orderId = row.querySelector('.order-id').textContent;

      if (confirm(`¿Confirmar el pedido ${orderId}?`)) {
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = 'status-badge preparing';
        statusBadge.textContent = 'En Preparación';
        this.style.display = 'none'; // Hide confirm button

        // Show success message
        showNotification(`Pedido ${orderId} confirmado y movido a preparación`, 'success');
      }
    });
  });

  // Prioritize orders
  document.querySelectorAll('.action-btn.priority').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const orderId = row.querySelector('.order-id').textContent;
      const statusBadge = row.querySelector('.status-badge');

      statusBadge.className = 'status-badge urgent';
      statusBadge.textContent = 'Urgente';
      this.style.display = 'none'; // Hide priority button

      showNotification(`Pedido ${orderId} marcado como urgente`, 'warning');
    });
  });

  // Mark as delivered
  document.querySelectorAll('.action-btn.delivered').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const orderId = row.querySelector('.order-id').textContent;
      const statusBadge = row.querySelector('.status-badge');

      statusBadge.className = 'status-badge delivered';
      statusBadge.textContent = 'Entregada';
      this.style.display = 'none'; // Hide delivered button

      showNotification(`Pedido ${orderId} marcado como entregado`, 'success');
    });
  });

  // Print order
  document.querySelectorAll('.action-btn.print').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const orderId = row.querySelector('.order-id').textContent;

      // Simulate printing
      window.print();
      showNotification(`Imprimiendo detalles del pedido ${orderId}`, 'info');
    });
  });

  // Edit order (placeholder functionality)
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const orderId = row.querySelector('.order-id').textContent;

      showNotification(`Función de edición para ${orderId} - próximamente disponible`, 'info');
    });
  });
}

// Show order details modal
function showOrderDetails(orderId, customerName, products, total) {
  const modal = document.getElementById('orderModal');
  const modalBody = document.getElementById('modalBody');

  const details = `
    <p><strong>ID del Pedido:</strong> ${orderId}</p>
    <p><strong>Cliente:</strong> ${customerName}</p>
    <p><strong>Productos:</strong> ${products}</p>
    <p><strong>Total:</strong> ${total}</p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
    <p><strong>Hora:</strong> ${new Date().toLocaleTimeString('es-ES')}</p>
  `;

  modalBody.innerHTML = details;
  modal.style.display = 'block';

  // Close modal functionality
  const closeBtn = document.querySelector('.modal-close');
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  }

  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
}

// Show notification messages
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: '1000',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    animation: 'slideIn 0.3s ease-out'
  });

  // Set background color based on type
  const colors = {
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8'
  };
  notification.style.backgroundColor = colors[type] || colors.info;

  // Add to page
  document.body.appendChild(notification);

  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);

  // Add slide-out animation
  setTimeout(() => {
    const styleOut = document.createElement('style');
    styleOut.textContent = `
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styleOut);
  }, 2700);
}