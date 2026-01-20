// Simple chart drawing functions using Canvas API

function drawBarChart(canvasId, data, labels) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Chart settings
  const barWidth = (width - 100) / data.length;
  const maxValue = Math.max(...data);
  const scale = (height - 60) / maxValue;

  // Draw bars
  data.forEach((value, index) => {
    const x = 50 + index * barWidth;
    const barHeight = value * scale;
    const y = height - 40 - barHeight;

    // Bar
    ctx.fillStyle = '#667eea';
    ctx.fillRect(x, y, barWidth - 10, barHeight);

    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + (barWidth - 10) / 2, height - 20);

    // Value
    ctx.fillText(value.toString(), x + (barWidth - 10) / 2, y - 5);
  });

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(40, 20);
  ctx.lineTo(40, height - 40);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(40, height - 40);
  ctx.lineTo(width - 20, height - 40);
  ctx.stroke();
}

function drawPieChart(canvasId, data, labels) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  const total = data.reduce((sum, value) => sum + value, 0);
  let startAngle = 0;

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();

    // Draw label
    const labelAngle = startAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius / 2);
    const labelY = centerY + Math.sin(labelAngle) * (radius / 2);

    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], labelX, labelY);

    startAngle += sliceAngle;
  });
}

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Sales chart data
  const salesData = [12000, 15000, 18000, 14000, 20000, 25000];
  const salesLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  drawBarChart('salesChart', salesData, salesLabels);

  // Category chart data
  const categoryData = [35, 25, 20, 20];
  const categoryLabels = ['Producto A', 'Producto B', 'Producto C', 'Producto D'];
  drawPieChart('categoryChart', categoryData, categoryLabels);
});