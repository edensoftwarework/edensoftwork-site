// Demo Data Generator
let currentPeriod = 'month';
let compareEnabled = false;
let customStartDate = null;
let customEndDate = null;
let allTransactions = []; // Store all transactions (2 years)
let currentMargin = 42; // Will be set randomly on data generation

// Generate two full years of realistic demo data
function generateFullYearData() {
  const products = ['Medialunas', 'Croissants', 'Torta Chocolate', 'Galletas', 'Tartas', 'Café', 'Pan Integral', 'Facturas'];
  const categories = ['Panificados', 'Pastelería', 'Bebidas', 'Dulces'];
  
  // Expanded customer list for realistic panadería traffic
  const firstNames = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofía', 'Diego', 'Carmen', 'Miguel', 'Isabel', 'Antonio', 'Rosa', 'Manuel', 'Elena', 'Francisco', 'Patricia', 'José', 'Beatriz', 'Rafael', 'Marta', 'Luis', 'Cristina', 'Pablo', 'Andrea', 'Sergio', 'Lucía', 'Alberto', 'Silvia', 'Fernando', 'Teresa', 'Ricardo', 'Verónica', 'Eduardo', 'Claudia', 'Roberto', 'Daniela', 'Javier', 'Marcela', 'Gustavo'];
  const lastNames = ['González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Díaz', 'Morales', 'Vargas', 'Castro', 'Romero', 'Suárez', 'Ortiz', 'Silva', 'Ruiz', 'Herrera', 'Jiménez', 'Mendoza', 'Molina', 'Vega', 'Guerrero', 'Medina', 'Cruz', 'Ramos'];
  
  // Generate 120+ unique customers with realistic behavior patterns
  const allCustomers = [];
  for (let i = 0; i < 120; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Assign customer type and first appearance day
    const customerType = Math.random();
    let startDay, frequency;
    
    if (customerType < 0.15) {
      // 15% - Very regular customers (desde el inicio, alta frecuencia)
      startDay = 0;
      frequency = 0.4; // Alta probabilidad de aparecer cada día
    } else if (customerType < 0.35) {
      // 20% - Regular customers (desde primeros 6 meses)
      startDay = Math.floor(Math.random() * 180);
      frequency = 0.25;
    } else if (customerType < 0.60) {
      // 25% - Ocasionales (distribuidos en el primer año)
      startDay = Math.floor(Math.random() * 365);
      frequency = 0.12;
    } else if (customerType < 0.80) {
      // 20% - Clientes del último año
      startDay = 365 + Math.floor(Math.random() * 270);
      frequency = 0.15;
    } else {
      // 20% - Clientes recientes (últimos 3 meses)
      startDay = 640 + Math.floor(Math.random() * 90);
      frequency = 0.20;
    }
    
    allCustomers.push({ name, startDay, frequency });
  }
  
  // Set margin for this dataset (varies between datasets but stays consistent within)
  currentMargin = 36 + Math.floor(Math.random() * 12); // 36-47%
  
  const transactions = [];
  const now = new Date();
  const twoYearsAgo = new Date(now);
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  // Generate 3-6 transactions per day for the last 2 years
  const totalDays = 730;
  let transactionId = 1000;
  
  for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
    const date = new Date(twoYearsAgo);
    date.setDate(date.getDate() + dayOffset);
    
    // Get active customers for this day
    const activeCustomers = allCustomers.filter(c => 
      c.startDay <= dayOffset && Math.random() < c.frequency
    );
    
    if (activeCustomers.length === 0) continue;
    
    // Random number of transactions per day
    const dailyTransactions = Math.min(3 + Math.floor(Math.random() * 4), activeCustomers.length);
    
    // Shuffle active customers
    const shuffled = activeCustomers.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < dailyTransactions; i++) {
      // Random hour between 8am and 8pm
      const hour = 8 + Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      date.setHours(hour, minute, 0, 0);
      
      const productCount = 1 + Math.floor(Math.random() * 3);
      const selectedProducts = [];
      for (let j = 0; j < productCount; j++) {
        selectedProducts.push(products[Math.floor(Math.random() * products.length)]);
      }
      
      const total = 120 + Math.floor(Math.random() * 400);
      const statuses = ['completada', 'completada', 'completada', 'completada', 'pendiente', 'cancelada'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      transactions.push({
        id: `#${String(transactionId++).padStart(5, '0')}`,
        date: new Date(date),
        customer: shuffled[i % shuffled.length].name,
        products: selectedProducts,
        total: total,
        status: status,
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    }
  }
  
  return transactions.sort((a, b) => b.date - a.date);
}

// Filter transactions by period
function filterTransactionsByPeriod(transactions, period) {
  const now = new Date();
  const cutoffDate = new Date();
  
  const periodMap = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365
  };
  
  const daysBack = periodMap[period] || 30;
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  
  return transactions.filter(t => t.date >= cutoffDate);
}

// Get previous period transactions for comparison
function getPreviousPeriodTransactions(transactions, period) {
  const now = new Date();
  const periodMap = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365
  };
  
  const daysBack = periodMap[period] || 30;
  const currentStart = new Date();
  currentStart.setDate(currentStart.getDate() - daysBack);
  
  const prevStart = new Date(currentStart);
  prevStart.setDate(prevStart.getDate() - daysBack);
  const prevEnd = new Date(currentStart);
  prevEnd.setDate(prevEnd.getDate() - 1);
  
  return transactions.filter(t => t.date >= prevStart && t.date <= prevEnd);
}

// Calculate metrics from transactions
function calculateMetrics(transactions, prevTransactions = null) {
  const metrics = {
    totalRevenue: 0,
    totalSales: transactions.length,
    totalCustomers: new Set(),
    productsSold: 0,
    completedTransactions: 0
  };
  
  transactions.forEach(t => {
    if (t.status === 'completada') {
      metrics.totalRevenue += t.total;
      metrics.completedTransactions++;
    }
    metrics.totalCustomers.add(t.customer);
    metrics.productsSold += t.products.length;
  });
  
  metrics.avgTicket = metrics.completedTransactions > 0 ? metrics.totalRevenue / metrics.completedTransactions : 0;
  metrics.profitMargin = currentMargin; // Use stored margin for consistency
  
  // Calculate comparisons
  if (prevTransactions) {
    const prevMetrics = calculateMetrics(prevTransactions);
    metrics.revenueChange = ((metrics.totalRevenue - prevMetrics.totalRevenue) / prevMetrics.totalRevenue * 100).toFixed(1);
    metrics.salesChange = ((metrics.totalSales - prevMetrics.totalSales) / prevMetrics.totalSales * 100).toFixed(1);
    metrics.customersChange = ((metrics.totalCustomers.size - prevMetrics.totalCustomers.size) / prevMetrics.totalCustomers.size * 100).toFixed(1);
    metrics.ticketChange = ((metrics.avgTicket - prevMetrics.avgTicket) / prevMetrics.avgTicket * 100).toFixed(1);
    metrics.productsChange = ((metrics.productsSold - prevMetrics.productsSold) / prevMetrics.productsSold * 100).toFixed(1);
    metrics.marginChange = (metrics.profitMargin - prevMetrics.profitMargin).toFixed(1);
  }
  
  return metrics;
}

// Update metrics display
function updateMetrics(metrics) {
  document.getElementById('total-revenue').textContent = `$${metrics.totalRevenue.toLocaleString()}`;
  document.getElementById('total-sales').textContent = metrics.totalSales;
  document.getElementById('total-customers').textContent = metrics.totalCustomers.size;
  document.getElementById('avg-ticket').textContent = `$${Math.round(metrics.avgTicket).toLocaleString()}`;
  document.getElementById('products-sold').textContent = metrics.productsSold;
  document.getElementById('profit-margin').textContent = `${metrics.profitMargin}%`;
  
  if (compareEnabled && metrics.revenueChange !== undefined) {
    updateChangeIndicator('revenue-change', metrics.revenueChange);
    updateChangeIndicator('sales-change', metrics.salesChange);
    updateChangeIndicator('customers-change', metrics.customersChange);
    updateChangeIndicator('ticket-change', metrics.ticketChange);
    updateChangeIndicator('products-change', metrics.productsChange);
    updateChangeIndicator('margin-change', metrics.marginChange);
  } else {
    document.querySelectorAll('.metric-change').forEach(el => {
      el.textContent = 'Sin comparación';
      el.className = 'metric-change neutral';
    });
  }
}

function updateChangeIndicator(elementId, change) {
  const el = document.getElementById(elementId);
  const value = parseFloat(change);
  const className = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
  const prefix = value > 0 ? '+' : '';
  el.textContent = `${prefix}${change}% vs período anterior`;
  el.className = `metric-change ${className}`;
}

// Render transactions table
let showingAllTransactions = false;

function renderTransactionsTable(transactions) {
  const tbody = document.getElementById('transactions-tbody');
  tbody.innerHTML = '';
  
  const filtered = filterTransactions(transactions);
  const limit = showingAllTransactions ? filtered.length : 20;
  const display = filtered.slice(0, limit);
  
  display.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${t.id}</strong></td>
      <td>${t.date.toLocaleDateString()} ${t.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
      <td>${t.customer}</td>
      <td>${t.products.join(', ')}</td>
      <td><strong>$${t.total.toLocaleString()}</strong></td>
      <td><span class="status-badge ${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
    `;
    tbody.appendChild(row);
  });
  
  // Update footer info
  const showMoreBtn = document.getElementById('show-more-btn');
  const showingCount = document.getElementById('showing-count');
  
  if (filtered.length <= 20) {
    showMoreBtn.style.display = 'none';
    showingCount.textContent = `Mostrando ${filtered.length} transacciones`;
  } else {
    showMoreBtn.style.display = 'block';
    if (showingAllTransactions) {
      showMoreBtn.textContent = 'Ver Menos';
      showingCount.textContent = `Mostrando ${filtered.length} transacciones`;
    } else {
      showMoreBtn.textContent = 'Ver Todas las Transacciones';
      showingCount.textContent = `Mostrando 20 de ${filtered.length} transacciones`;
    }
  }
}

function filterTransactions(transactions) {
  const searchText = document.getElementById('search-table').value.toLowerCase();
  const statusFilter = document.getElementById('status-filter').value;
  
  return transactions.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(searchText) || 
                         t.products.some(p => p.toLowerCase().includes(searchText));
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}

// Draw charts
function drawSalesTrendChart(transactions) {
  const canvas = document.getElementById('sales-trend-chart');
  if (!canvas) return;
  setupCanvas(canvas);
  const ctx = canvas.getContext('2d');
  
  // Group by day, keeping date objects
  const dailySales = {};
  transactions.forEach(t => {
    if (t.status === 'completada') {
      const dateKey = t.date.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailySales[dateKey]) {
        dailySales[dateKey] = { date: t.date, total: 0 };
      }
      dailySales[dateKey].total += t.total;
    }
  });
  
  // Sort and format dates based on period
  const sortedEntries = Object.entries(dailySales)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-30);
  
  const formattedLabels = sortedEntries.map(([key, data]) => {
    const date = data.date;
    if (currentPeriod === 'week') {
      // "Lun 5" - día de semana + día del mes
      const weekday = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = date.getDate();
      return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${dayNum}`;
    } else if (currentPeriod === 'month') {
      // "5 feb"
      return `${date.getDate()} ${date.toLocaleDateString('es-ES', { month: 'short' })}`;
    } else if (currentPeriod === 'quarter' || currentPeriod === 'year') {
      // "5 feb"
      return `${date.getDate()} ${date.toLocaleDateString('es-ES', { month: 'short' })}`;
    }
    return key;
  });
  
  const values = sortedEntries.map(([key, data]) => data.total);
  
  drawLineChart(ctx, canvas.width, canvas.height, formattedLabels, values, '#667eea', 'Ventas ($)');
}

function drawCategoryChart(transactions) {
  const canvas = document.getElementById('category-chart');
  if (!canvas) return;
  setupCanvas(canvas);
  const ctx = canvas.getContext('2d');
  
  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.status === 'completada') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.total;
    }
  });
  
  const categories = Object.keys(categoryTotals);
  const values = categories.map(c => categoryTotals[c]);
  
  drawBarChart(ctx, canvas.width, canvas.height, categories, values, 'Ventas ($)');
}

function drawTopProductsChart(transactions) {
  const canvas = document.getElementById('top-products-chart');
  if (!canvas) return;
  setupCanvas(canvas);
  const ctx = canvas.getContext('2d');
  
  const productCounts = {};
  transactions.forEach(t => {
    if (t.status === 'completada') {
      t.products.forEach(p => {
        productCounts[p] = (productCounts[p] || 0) + 1;
      });
    }
  });
  
  const sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const products = sorted.map(s => s[0]);
  const counts = sorted.map(s => s[1]);
  
  drawBarChart(ctx, canvas.width, canvas.height, products, counts, 'Cantidad Vendida');
}

function drawHourlyChart(transactions) {
  const canvas = document.getElementById('hourly-chart');
  if (!canvas) return;
  setupCanvas(canvas);
  const ctx = canvas.getContext('2d');
  
  const hourlySales = Array(24).fill(0);
  transactions.forEach(t => {
    if (t.status === 'completada') {
      const hour = t.date.getHours();
      hourlySales[hour] += t.total;
    }
  });
  
  // Find range of hours with activity
  let minHour = 24, maxHour = 0;
  hourlySales.forEach((value, hour) => {
    if (value > 0) {
      minHour = Math.min(minHour, hour);
      maxHour = Math.max(maxHour, hour);
    }
  });
  
  // If no sales, show empty chart
  if (minHour > maxHour) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No hay datos de ventas para este período', canvas.width / 2 / (window.devicePixelRatio || 1), canvas.height / 2 / (window.devicePixelRatio || 1));
    return;
  }
  
  // Expand range to show context (1 hour before/after)
  minHour = Math.max(0, minHour - 1);
  maxHour = Math.min(23, maxHour + 1);
  
  // Create labels and values for the active range
  const hours = [];
  const values = [];
  for (let h = minHour; h <= maxHour; h++) {
    hours.push(`${h}:00`);
    values.push(hourlySales[h]);
  }
  
  drawLineChart(ctx, canvas.width, canvas.height, hours, values, '#f97316', 'Ventas ($)');
}

// Setup canvas for high DPI displays
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  return ctx;
}

// Chart drawing functions
function drawBarChart(ctx, canvasWidth, canvasHeight, labels, values, yAxisLabel = 'Valores') {
  const width = ctx.canvas.getBoundingClientRect().width;
  const height = ctx.canvas.getBoundingClientRect().height;
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  const padding = 80;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...values);
  const barWidth = Math.min(50, chartWidth / labels.length * 0.45);
  const spacing = (chartWidth - barWidth * labels.length) / (labels.length + 1);
  
  // Draw bars
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ecdc4'];
  values.forEach((value, i) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + spacing + i * (barWidth + spacing);
    const y = height - padding - barHeight;
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Value label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(value), x + barWidth / 2, y - 8);
    
    // X-axis label (rotated)
    ctx.save();
    ctx.translate(x + barWidth / 2, height - padding + 15);
    ctx.rotate(-Math.PI / 4); // 45 degrees
    ctx.font = '11px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    const label = labels[i].length > 12 ? labels[i].substring(0, 10) + '..' : labels[i];
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });
  
  // Y-axis grid and labels
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxValue / 5 * i), padding - 10, y + 4);
  }
  
  // Y-axis label
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yAxisLabel, 0, 0);
  ctx.restore();
}

function drawLineChart(ctx, canvasWidth, canvasHeight, labels, values, color, yAxisLabel = 'Valores') {
  const width = ctx.canvas.getBoundingClientRect().width;
  const height = ctx.canvas.getBoundingClientRect().height;
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  const padding = 80;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...values);
  const stepX = chartWidth / (labels.length - 1 || 1);
  
  // Draw grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((value, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (value / maxValue) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw points
  ctx.fillStyle = color;
  values.forEach((value, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (value / maxValue) * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // X-axis labels (show strategically to avoid overlap)
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  const skipFactor = Math.max(1, Math.ceil(labels.length / 10));
  const minDistance = 50; // Minimum pixels between labels
  let lastLabelX = -minDistance;
  
  labels.forEach((label, i) => {
    const x = padding + i * stepX;
    const shouldShow = (i % skipFactor === 0 || i === 0) && (x - lastLabelX >= minDistance);
    const isLast = i === labels.length - 1;
    const isSecondToLast = i === labels.length - 2;
    
    // Show last label only if far enough from previous, skip second-to-last if too close to last
    if (shouldShow || (isLast && x - lastLabelX >= minDistance)) {
      if (!(isSecondToLast && labels.length * stepX > 400)) { // Skip second-to-last for long ranges
        const shortLabel = label.length > 10 ? label.substring(0, 8) + '..' : label;
        ctx.fillText(shortLabel, x, height - padding + 25);
        lastLabelX = x;
      }
    }
  });
  
  // Y-axis labels
  ctx.textAlign = 'right';
  ctx.font = '12px Arial';
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (chartHeight / 5) * i;
    ctx.fillText(Math.round(maxValue / 5 * i), padding - 10, y + 4);
  }
  
  // Y-axis label
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yAxisLabel, 0, 0);
  ctx.restore();
}

// Generate insights
function generateInsights(transactions, metrics) {
  const insights = [];
  
  // Revenue insight
  if (compareEnabled && metrics.revenueChange > 10) {
    insights.push({
      type: 'success',
      title: '🎯 Crecimiento Destacado',
      text: `Los ingresos aumentaron ${metrics.revenueChange}% respecto al período anterior. ¡Excelente rendimiento!`
    });
  } else if (compareEnabled && metrics.revenueChange < -5) {
    insights.push({
      type: 'warning',
      title: '⚠️ Disminución de Ingresos',
      text: `Los ingresos cayeron ${Math.abs(metrics.revenueChange)}%. Considera revisar estrategias de precios o promociones.`
    });
  }
  
  // Best seller
  const productCounts = {};
  transactions.forEach(t => {
    if (t.status === 'completada') {
      t.products.forEach(p => productCounts[p] = (productCounts[p] || 0) + 1);
    }
  });
  const bestSeller = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
  if (bestSeller) {
    insights.push({
      type: 'info',
      title: '⭐ Producto Más Vendido',
      text: `"${bestSeller[0]}" lidera las ventas con ${bestSeller[1]} unidades vendidas en este período.`
    });
  }
  
  // Ticket average
  if (metrics.avgTicket > 300) {
    insights.push({
      type: 'success',
      title: '💰 Ticket Promedio Alto',
      text: `El ticket promedio de $${Math.round(metrics.avgTicket)} indica buena receptividad a productos premium.`
    });
  }
  
  // Customer retention
  insights.push({
    type: 'info',
    title: '👥 Base de Clientes',
    text: `Se atendieron ${metrics.totalCustomers.size} clientes únicos. El promedio de compras por cliente es ${(metrics.totalSales / metrics.totalCustomers.size).toFixed(1)}.`
  });
  
  renderInsights(insights);
}

function renderInsights(insights) {
  const container = document.getElementById('insights-container');
  container.innerHTML = '';
  
  insights.forEach(insight => {
    const card = document.createElement('div');
    card.className = `insight-card ${insight.type}`;
    card.innerHTML = `
      <h4>${insight.title}</h4>
      <p>${insight.text}</p>
    `;
    container.appendChild(card);
  });
}

// Export to PDF
function exportToPDF(transactions, metrics) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const primaryColor = [102, 126, 234];
  const darkGray = [51, 65, 85];
  
  // Get period name
  const periodNames = {
    week: 'Última Semana',
    month: 'Último Mes',
    quarter: 'Último Trimestre',
    year: 'Último Año',
    custom: 'Período Personalizado'
  };
  const periodName = periodNames[currentPeriod] || 'Período Seleccionado';
  
  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('EDEN SoftWork', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('Dashboard de Métricas y Análisis', 20, 28);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(`Período: ${periodName}`, 20, 37);
  
  // Metrics
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Métricas Principales', 20, 58);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  let y = 68;
  doc.text(`Ingresos Totales: $${metrics.totalRevenue.toLocaleString()}`, 20, y);
  doc.text(`Ventas: ${metrics.totalSales}`, 110, y);
  y += 8;
  doc.text(`Clientes: ${metrics.totalCustomers.size}`, 20, y);
  doc.text(`Ticket Promedio: $${Math.round(metrics.avgTicket).toLocaleString()}`, 110, y);
  y += 8;
  doc.text(`Productos Vendidos: ${metrics.productsSold}`, 20, y);
  doc.text(`Margen: ${metrics.profitMargin}%`, 110, y);
  
  // Transactions table
  y += 15;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Transacciones (${transactions.length} total)`, 20, y);
  
  y += 10;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(20, y - 5, 170, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('ID', 25, y);
  doc.text('Fecha', 45, y);
  doc.text('Cliente', 75, y);
  doc.text('Total', 125, y);
  doc.text('Estado', 150, y);
  
  y += 8;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8);
  
  // Add all transactions with pagination
  let pageNumber = 1;
  transactions.forEach((t, i) => {
    if (y > 275) {
      // New page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${pageNumber}`, 180, 290);
      
      doc.addPage();
      pageNumber++;
      y = 20;
      
      // Repeat header on new page
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(20, y - 5, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text('ID', 25, y);
      doc.text('Fecha', 45, y);
      doc.text('Cliente', 75, y);
      doc.text('Total', 125, y);
      doc.text('Estado', 150, y);
      y += 8;
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(8);
    }
    
    doc.text(t.id, 25, y);
    doc.text(t.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }), 45, y);
    doc.text(t.customer.substring(0, 18), 75, y);
    doc.text(`$${t.total.toLocaleString()}`, 125, y);
    doc.text(t.status, 150, y);
    y += 6;
  });
  
  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Página ${pageNumber}`, 180, 290);
  doc.setTextColor(100, 100, 100);
  doc.text(`Reporte generado el ${new Date().toLocaleDateString('es-ES')}`, 20, 285);
  doc.text('edensoftwarework@gmail.com', 140, 285);
  
  doc.save(`dashboard-${periodName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`);
}

// Event listeners and initialization
let currentTransactions = [];
let prevTransactions = [];

function updateDashboard() {
  // Filter data from the full year dataset
  currentTransactions = filterTransactionsByPeriod(allTransactions, currentPeriod);
  
  if (compareEnabled) {
    prevTransactions = getPreviousPeriodTransactions(allTransactions, currentPeriod);
  }
  
  const metrics = calculateMetrics(currentTransactions, compareEnabled ? prevTransactions : null);
  
  updateMetrics(metrics);
  renderTransactionsTable(currentTransactions);
  drawSalesTrendChart(currentTransactions);
  drawCategoryChart(currentTransactions);
  drawTopProductsChart(currentTransactions);
  drawHourlyChart(currentTransactions);
  generateInsights(currentTransactions, metrics);
}

document.getElementById('period-select').addEventListener('change', (e) => {
  currentPeriod = e.target.value;
  const customDates = document.querySelector('.custom-dates');
  customDates.style.display = e.target.value === 'custom' ? 'flex' : 'none';
  if (e.target.value !== 'custom') {
    updateDashboard();
  }
});

document.getElementById('compare-toggle').addEventListener('change', (e) => {
  compareEnabled = e.target.checked;
  updateDashboard();
});

document.getElementById('refresh-btn').addEventListener('click', () => {
  allTransactions = generateFullYearData();
  updateDashboard();
});

document.getElementById('export-pdf-btn').addEventListener('click', () => {
  const metrics = calculateMetrics(currentTransactions);
  exportToPDF(currentTransactions, metrics);
});

document.getElementById('search-table').addEventListener('input', () => {
  showingAllTransactions = false;
  renderTransactionsTable(currentTransactions);
});

document.getElementById('status-filter').addEventListener('change', () => {
  showingAllTransactions = false;
  renderTransactionsTable(currentTransactions);
});

document.getElementById('show-more-btn').addEventListener('click', () => {
  showingAllTransactions = !showingAllTransactions;
  renderTransactionsTable(currentTransactions);
});

// Initialize
window.addEventListener('load', () => {
  allTransactions = generateFullYearData();
  updateDashboard();
  
  // Show tutorial on first load
  showTutorial();
});

// Tutorial functionality
let currentStep = 0;
const totalSteps = 5;

function showTutorial() {
  const modal = document.getElementById('tutorial-modal');
  modal.style.display = 'flex';
}

function closeTutorial() {
  const modal = document.getElementById('tutorial-modal');
  modal.style.display = 'none';
}

function showStep(step) {
  const steps = document.querySelectorAll('.step');
  const indicators = document.querySelectorAll('.indicator');
  
  steps.forEach((s, i) => {
    s.classList.toggle('active', i === step);
  });
  
  indicators.forEach((ind, i) => {
    ind.classList.toggle('active', i === step);
  });
  
  currentStep = step;
}

function nextStep() {
  if (currentStep < totalSteps - 1) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

// Tutorial event listeners
document.getElementById('tutorial-close').addEventListener('click', closeTutorial);
document.getElementById('close-tutorial').addEventListener('click', closeTutorial);
document.getElementById('next-step').addEventListener('click', nextStep);
document.getElementById('prev-step').addEventListener('click', prevStep);

document.querySelectorAll('.indicator').forEach((indicator, index) => {
  indicator.addEventListener('click', () => showStep(index));
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('tutorial-modal');
  if (modal.style.display === 'flex') {
    if (e.key === 'ArrowRight') nextStep();
    if (e.key === 'ArrowLeft') prevStep();
    if (e.key === 'Escape') closeTutorial();
  }
});

// Close on outside click
document.getElementById('tutorial-modal').addEventListener('click', (e) => {
  if (e.target.id === 'tutorial-modal') {
    closeTutorial();
  }
});
