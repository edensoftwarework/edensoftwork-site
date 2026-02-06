// Tutorial Modal Logic
let currentStep = 0;
const steps = document.querySelectorAll('.step');
const indicators = document.querySelectorAll('.indicator');
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');
const tutorialModal = document.getElementById('tutorial-modal');
const tutorialClose = document.getElementById('tutorial-close');
const closeTutorialBtn = document.getElementById('close-tutorial');

function showTutorial() {
  tutorialModal.style.display = 'flex';
  currentStep = 0;
  updateStep();
  prevStepBtn.style.display = 'none';
}

function closeTutorial() {
  tutorialModal.style.display = 'none';
}

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === currentStep);
  });
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentStep);
  });
  
  prevStepBtn.style.display = currentStep === 0 ? 'none' : 'flex';
  nextStepBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'flex';
}

prevStepBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
});

nextStepBtn.addEventListener('click', () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStep();
  }
});

indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    currentStep = index;
    updateStep();
  });
});

tutorialClose.addEventListener('click', closeTutorial);
closeTutorialBtn.addEventListener('click', closeTutorial);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (tutorialModal.style.display === 'flex') {
    if (e.key === 'ArrowLeft' && currentStep > 0) {
      e.preventDefault();
      currentStep--;
      updateStep();
    } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
      e.preventDefault();
      currentStep++;
      updateStep();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeTutorial();
    }
  }
});

// Data Storage
let clients = JSON.parse(localStorage.getItem('crm_clients')) || [];
let budgets = JSON.parse(localStorage.getItem('crm_budgets')) || [];

// Generate Demo Data
function generateDemoData() {
  const demoClients = [
    {
      id: 'demo-1',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+54 11 4567-8901',
      status: 'activo',
      notes: 'Cliente recurrente desde 2024. Prefiere contacto por email.',
      createdAt: new Date(2024, 6, 15).toISOString(),
      isDemo: true
    },
    {
      id: 'demo-2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      phone: '+54 11 4567-8902',
      status: 'activo',
      notes: 'Empresa mediana. Solicita factura A.',
      createdAt: new Date(2024, 8, 20).toISOString(),
      isDemo: true
    },
    {
      id: 'demo-3',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+54 11 4567-8903',
      status: 'prospecto',
      notes: 'Interesada en servicios de consultoría. Primera reunión pendiente.',
      createdAt: new Date(2025, 11, 10).toISOString(),
      isDemo: true
    },
    {
      id: 'demo-4',
      name: 'Roberto Fernández',
      email: 'roberto.fernandez@negocio.com',
      phone: '+54 11 4567-8904',
      status: 'activo',
      notes: 'Cliente corporativo. Pagos mensuales.',
      createdAt: new Date(2024, 5, 5).toISOString(),
      isDemo: true
    },
    {
      id: 'demo-5',
      name: 'Laura Sánchez',
      email: 'laura.sanchez@startup.com',
      phone: '+54 11 4567-8905',
      status: 'inactivo',
      notes: 'Sin actividad desde noviembre 2025.',
      createdAt: new Date(2024, 3, 12).toISOString(),
      isDemo: true
    }
  ];

  const demoBudgets = [
    {
      id: 'budget-demo-1',
      clientId: 'demo-1',
      clientName: 'María González',
      date: new Date(2026, 0, 15).toISOString(),
      items: [
        { description: 'Desarrollo web corporativo', quantity: 1, price: 450000 },
        { description: 'Diseño UI/UX', quantity: 1, price: 180000 }
      ],
      total: 630000,
      status: 'aceptado',
      isDemo: true
    },
    {
      id: 'budget-demo-2',
      clientId: 'demo-1',
      clientName: 'María González',
      date: new Date(2025, 10, 5).toISOString(),
      items: [
        { description: 'Mantenimiento mensual', quantity: 3, price: 45000 }
      ],
      total: 135000,
      status: 'aceptado',
      isDemo: true
    },
    {
      id: 'budget-demo-3',
      clientId: 'demo-2',
      clientName: 'Carlos Rodríguez',
      date: new Date(2026, 0, 20).toISOString(),
      items: [
        { description: 'Sistema de inventario', quantity: 1, price: 680000 },
        { description: 'Capacitación personal', quantity: 1, price: 120000 }
      ],
      total: 800000,
      status: 'enviado',
      isDemo: true
    },
    {
      id: 'budget-demo-4',
      clientId: 'demo-2',
      clientName: 'Carlos Rodríguez',
      date: new Date(2025, 9, 12).toISOString(),
      items: [
        { description: 'Consultoría inicial', quantity: 1, price: 85000 }
      ],
      total: 85000,
      status: 'aceptado',
      isDemo: true
    },
    {
      id: 'budget-demo-5',
      clientId: 'demo-3',
      clientName: 'Ana Martínez',
      date: new Date(2026, 0, 25).toISOString(),
      items: [
        { description: 'Landing page premium', quantity: 1, price: 250000 },
        { description: 'SEO básico', quantity: 1, price: 95000 }
      ],
      total: 345000,
      status: 'enviado',
      isDemo: true
    },
    {
      id: 'budget-demo-6',
      clientId: 'demo-4',
      clientName: 'Roberto Fernández',
      date: new Date(2025, 11, 8).toISOString(),
      items: [
        { description: 'App móvil empresarial', quantity: 1, price: 1200000 }
      ],
      total: 1200000,
      status: 'aceptado',
      isDemo: true
    },
    {
      id: 'budget-demo-7',
      clientId: 'demo-4',
      clientName: 'Roberto Fernández',
      date: new Date(2026, 0, 30).toISOString(),
      items: [
        { description: 'Actualización sistema', quantity: 1, price: 180000 }
      ],
      total: 180000,
      status: 'borrador',
      isDemo: true
    },
    {
      id: 'budget-demo-8',
      clientId: 'demo-5',
      clientName: 'Laura Sánchez',
      date: new Date(2025, 10, 15).toISOString(),
      items: [
        { description: 'E-commerce básico', quantity: 1, price: 420000 }
      ],
      total: 420000,
      status: 'rechazado',
      isDemo: true
    }
  ];

  // Merge demo data with user data
  const existingClientIds = clients.filter(c => !c.isDemo).map(c => c.id);
  const existingBudgetIds = budgets.filter(b => !b.isDemo).map(b => b.id);

  clients = [
    ...clients.filter(c => !c.isDemo),
    ...demoClients
  ];

  budgets = [
    ...budgets.filter(b => !b.isDemo),
    ...demoBudgets
  ];
}

// Initialize demo data (always generate to ensure demo data is present)
generateDemoData();

// Save data
function saveClients() {
  localStorage.setItem('crm_clients', JSON.stringify(clients.filter(c => !c.isDemo)));
}

function saveBudgets() {
  localStorage.setItem('crm_budgets', JSON.stringify(budgets.filter(b => !b.isDemo)));
}

// Update Dashboard
function updateDashboard() {
  const totalClients = clients.length;
  const totalBudgets = budgets.length;
  const acceptedBudgets = budgets.filter(b => b.status === 'aceptado').length;
  const sentBudgets = budgets.filter(b => b.status === 'enviado' || b.status === 'aceptado' || b.status === 'rechazado').length;
  const conversionRate = sentBudgets > 0 ? ((acceptedBudgets / sentBudgets) * 100).toFixed(1) : 0;
  const totalRevenue = budgets
    .filter(b => b.status === 'aceptado')
    .reduce((sum, b) => sum + b.total, 0);

  document.getElementById('stats-total-clients').textContent = totalClients;
  document.getElementById('stats-total-budgets').textContent = totalBudgets;
  document.getElementById('stats-conversion-rate').textContent = `${conversionRate}%`;
  document.getElementById('stats-revenue').textContent = `$${totalRevenue.toLocaleString('es-AR')}`;

  // Budget status breakdown
  const statusCounts = {
    borrador: budgets.filter(b => b.status === 'borrador').length,
    enviado: budgets.filter(b => b.status === 'enviado').length,
    aceptado: budgets.filter(b => b.status === 'aceptado').length,
    rechazado: budgets.filter(b => b.status === 'rechazado').length
  };

  const statusLabels = {
    borrador: 'Borradores',
    enviado: 'Enviados',
    aceptado: 'Aceptados',
    rechazado: 'Rechazados'
  };

  const statusList = document.getElementById('budget-status-list');
  statusList.innerHTML = '';
  
  Object.keys(statusCounts).forEach(status => {
    const statusItem = document.createElement('div');
    statusItem.className = `status-item ${status}`;
    statusItem.innerHTML = `
      <div class="status-item-label">${statusLabels[status]}</div>
      <div class="status-item-value">${statusCounts[status]}</div>
    `;
    statusList.appendChild(statusItem);
  });
}

// Render Clients Table
function renderClients(filterText = '', filterStatus = '') {
  const tbody = document.getElementById('clients-tbody');
  tbody.innerHTML = '';

  let filteredClients = clients;
  
  if (filterText) {
    filteredClients = filteredClients.filter(c => 
      c.name.toLowerCase().includes(filterText.toLowerCase()) ||
      c.email.toLowerCase().includes(filterText.toLowerCase())
    );
  }
  
  if (filterStatus) {
    filteredClients = filteredClients.filter(c => c.status === filterStatus);
  }

  // Sort alphabetically by name
  filteredClients.sort((a, b) => a.name.localeCompare(b.name));

  filteredClients.forEach(client => {
    const clientBudgets = budgets.filter(b => b.clientId === client.id);
    const budgetCount = clientBudgets.length;
    const totalBilled = clientBudgets
      .filter(b => b.status === 'aceptado')
      .reduce((sum, b) => sum + b.total, 0);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${client.name}</strong></td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td class="text-center"><span class="status-badge ${client.status}">${client.status}</span></td>
      <td class="text-center">${budgetCount}</td>
      <td class="text-center">$${totalBilled.toLocaleString('es-AR')}</td>
      <td class="text-center">
        <button class="table-btn view-btn" onclick="viewClient('${client.id}')" title="Ver cliente">🔍</button>
        <button class="table-btn edit-btn" onclick="editClient('${client.id}')" title="Editar">✏️</button>
        <button class="table-btn delete-btn" onclick="deleteClient('${client.id}')" title="Eliminar">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Render Budgets Table
function renderBudgets(filterText = '', filterStatus = '') {
  const tbody = document.getElementById('budgets-tbody');
  tbody.innerHTML = '';

  let filteredBudgets = budgets;
  
  if (filterText) {
    filteredBudgets = filteredBudgets.filter(b => 
      b.clientName.toLowerCase().includes(filterText.toLowerCase())
    );
  }
  
  if (filterStatus) {
    filteredBudgets = filteredBudgets.filter(b => b.status === filterStatus);
  }

  // Sort by date descending
  filteredBudgets.sort((a, b) => new Date(b.date) - new Date(a.date));

  filteredBudgets.forEach(budget => {
    const row = document.createElement('tr');
    const dateObj = new Date(budget.date);
    const formattedDate = dateObj.toLocaleDateString('es-AR');
    
    row.innerHTML = `
      <td><strong>${budget.clientName}</strong></td>
      <td class="text-center">${formattedDate}</td>
      <td class="text-center"><strong>$${budget.total.toLocaleString('es-AR')}</strong></td>
      <td class="text-center"><span class="status-badge ${budget.status}">${budget.status}</span></td>
      <td class="text-center">
        <button class="table-btn edit-btn" onclick="editBudget('${budget.id}')" title="Editar">✏️</button>
        <button class="table-btn pdf-btn" onclick="exportBudgetPDF('${budget.id}')" title="Exportar PDF">📄</button>
        <button class="table-btn delete-btn" onclick="deleteBudget('${budget.id}')" title="Eliminar">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Client Modal
const clientModal = document.getElementById('client-modal');
const clientForm = document.getElementById('client-form');
let editingClientId = null;

document.getElementById('add-client-btn').addEventListener('click', () => {
  editingClientId = null;
  document.getElementById('client-modal-title').textContent = 'Agregar Cliente';
  document.getElementById('submit-client-btn').textContent = 'Guardar Cliente';
  clientForm.reset();
  clientModal.style.display = 'block';
});

document.getElementById('client-close').addEventListener('click', () => {
  clientModal.style.display = 'none';
});

document.getElementById('cancel-client').addEventListener('click', () => {
  clientModal.style.display = 'none';
});

clientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const clientData = {
    id: editingClientId || 'client-' + Date.now(),
    name: document.getElementById('client-name').value,
    email: document.getElementById('client-email').value,
    phone: document.getElementById('client-phone').value,
    status: document.getElementById('client-status').value,
    notes: document.getElementById('client-note').value,
    createdAt: editingClientId ? 
      clients.find(c => c.id === editingClientId).createdAt : 
      new Date().toISOString()
  };

  if (editingClientId) {
    const index = clients.findIndex(c => c.id === editingClientId);
    clients[index] = clientData;
    showMessage('Cliente actualizado correctamente');
  } else {
    clients.push(clientData);
    showMessage('Cliente agregado correctamente');
  }

  saveClients();
  renderClients();
  updateDashboard();
  clientModal.style.display = 'none';
});

function editClient(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return;

  editingClientId = clientId;
  document.getElementById('client-modal-title').textContent = 'Editar Cliente';
  document.getElementById('submit-client-btn').textContent = 'Actualizar Cliente';
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-email').value = client.email;
  document.getElementById('client-phone').value = client.phone;
  document.getElementById('client-status').value = client.status;
  document.getElementById('client-note').value = client.notes || '';
  clientModal.style.display = 'block';
}

function deleteClient(clientId) {
  if (!confirm('¿Estás seguro de eliminar este cliente? También se eliminarán todos sus presupuestos.')) return;
  
  clients = clients.filter(c => c.id !== clientId);
  budgets = budgets.filter(b => b.clientId !== clientId);
  saveClients();
  saveBudgets();
  renderClients();
  renderBudgets();
  updateDashboard();
  showMessage('Cliente eliminado');
}

function viewClient(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return;

  const clientBudgets = budgets.filter(b => b.clientId === clientId);
  const totalBilled = clientBudgets
    .filter(b => b.status === 'aceptado')
    .reduce((sum, b) => sum + b.total, 0);

  const viewContent = document.getElementById('client-view-content');
  viewContent.innerHTML = `
    <div class="client-view-header">
      <h2>${client.name}</h2>
      <span class="status-badge ${client.status}">${client.status}</span>
    </div>
    
    <div class="client-view-info">
      <div class="client-info-item">
        <div class="client-info-label">Email</div>
        <div class="client-info-value">${client.email}</div>
      </div>
      <div class="client-info-item">
        <div class="client-info-label">Teléfono</div>
        <div class="client-info-value">${client.phone}</div>
      </div>
      <div class="client-info-item">
        <div class="client-info-label">Total Facturado</div>
        <div class="client-info-value">$${totalBilled.toLocaleString('es-AR')}</div>
      </div>
      <div class="client-info-item">
        <div class="client-info-label">Presupuestos</div>
        <div class="client-info-value">${clientBudgets.length}</div>
      </div>
    </div>

    ${client.notes ? `
    <div class="client-view-section">
      <h3>📝 Notas</h3>
      <p style="color: #64748b; line-height: 1.6;">${client.notes}</p>
    </div>
    ` : ''}

    <div class="client-view-section">
      <h3>📄 Presupuestos</h3>
      ${clientBudgets.length > 0 ? `
        <div class="client-budgets-list">
          ${clientBudgets.sort((a, b) => new Date(b.date) - new Date(a.date)).map(budget => {
            const dateObj = new Date(budget.date);
            const formattedDate = dateObj.toLocaleDateString('es-AR');
            return `
              <div class="budget-card">
                <div class="budget-card-header">
                  <div class="budget-card-date">${formattedDate}</div>
                  <span class="status-badge ${budget.status}">${budget.status}</span>
                </div>
                <div class="budget-card-amount">$${budget.total.toLocaleString('es-AR')}</div>
                <div style="margin-top: 10px;">
                  ${budget.items.map(item => `
                    <div style="font-size: 14px; color: #64748b; margin-top: 5px;">
                      ${item.description} (x${item.quantity})
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : '<p style="color: #94a3b8; text-align: center; padding: 20px;">No hay presupuestos registrados</p>'}
    </div>
  `;

  document.getElementById('client-view-modal').style.display = 'block';
}

document.getElementById('client-view-close').addEventListener('click', () => {
  document.getElementById('client-view-modal').style.display = 'none';
});

// Budget Modal
const budgetModal = document.getElementById('budget-modal');
const budgetForm = document.getElementById('budget-form');
let editingBudgetId = null;

document.getElementById('add-budget-btn').addEventListener('click', () => {
  editingBudgetId = null;
  document.getElementById('budget-modal-title').textContent = 'Crear Presupuesto';
  document.getElementById('submit-budget-btn').textContent = 'Guardar Presupuesto';
  budgetForm.reset();
  
  // Populate client dropdown
  const clientSelect = document.getElementById('budget-client');
  clientSelect.innerHTML = '<option value="">Seleccionar cliente...</option>';
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = `${client.name} (${client.email})`;
    clientSelect.appendChild(option);
  });
  
  // Set today's date
  document.getElementById('budget-date').valueAsDate = new Date();
  
  // Reset items
  document.getElementById('items-container').innerHTML = `
    <div class="item-row">
      <input type="text" placeholder="Descripción" class="item-desc" required>
      <input type="number" placeholder="Cantidad" min="1" class="item-qty" value="1" required>
      <input type="number" placeholder="Precio" step="0.01" min="0" class="item-price" required>
      <button type="button" class="remove-item">✕</button>
    </div>
  `;
  
  updateBudgetTotal();
  budgetModal.style.display = 'block';
});

document.getElementById('budget-close').addEventListener('click', () => {
  budgetModal.style.display = 'none';
});

document.getElementById('cancel-budget').addEventListener('click', () => {
  budgetModal.style.display = 'none';
});

document.getElementById('add-item-btn').addEventListener('click', () => {
  const itemsContainer = document.getElementById('items-container');
  const newItem = document.createElement('div');
  newItem.className = 'item-row';
  newItem.innerHTML = `
    <input type="text" placeholder="Descripción" class="item-desc" required>
    <input type="number" placeholder="Cantidad" min="1" class="item-qty" value="1" required>
    <input type="number" placeholder="Precio" step="0.01" min="0" class="item-price" required>
    <button type="button" class="remove-item">✕</button>
  `;
  itemsContainer.appendChild(newItem);
});

document.getElementById('items-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const itemRows = document.querySelectorAll('.item-row');
    if (itemRows.length > 1) {
      e.target.closest('.item-row').remove();
      updateBudgetTotal();
    } else {
      showMessage('Debe haber al menos un ítem');
    }
  }
});

document.getElementById('items-container').addEventListener('input', updateBudgetTotal);

function updateBudgetTotal() {
  const items = document.querySelectorAll('.item-row');
  let total = 0;
  
  items.forEach(item => {
    const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
    const price = parseFloat(item.querySelector('.item-price').value) || 0;
    total += qty * price;
  });
  
  document.getElementById('budget-total').textContent = total.toFixed(2);
}

budgetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const clientId = document.getElementById('budget-client').value;
  if (!clientId) {
    showMessage('Debe seleccionar un cliente');
    return;
  }
  
  const client = clients.find(c => c.id === clientId);
  
  const items = [];
  document.querySelectorAll('.item-row').forEach(row => {
    items.push({
      description: row.querySelector('.item-desc').value,
      quantity: parseInt(row.querySelector('.item-qty').value),
      price: parseFloat(row.querySelector('.item-price').value)
    });
  });
  
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  const budgetData = {
    id: editingBudgetId || 'budget-' + Date.now(),
    clientId: clientId,
    clientName: client.name,
    date: new Date(document.getElementById('budget-date').value + 'T12:00:00').toISOString(),
    items: items,
    total: total,
    status: document.getElementById('budget-status').value
  };

  if (editingBudgetId) {
    const index = budgets.findIndex(b => b.id === editingBudgetId);
    budgets[index] = budgetData;
    showMessage('Presupuesto actualizado correctamente');
  } else {
    budgets.push(budgetData);
    showMessage('Presupuesto creado correctamente');
  }

  saveBudgets();
  renderBudgets();
  updateDashboard();
  budgetModal.style.display = 'none';
});

function editBudget(budgetId) {
  const budget = budgets.find(b => b.id === budgetId);
  if (!budget) return;

  editingBudgetId = budgetId;
  document.getElementById('budget-modal-title').textContent = 'Editar Presupuesto';
  document.getElementById('submit-budget-btn').textContent = 'Actualizar Presupuesto';
  
  // Populate client dropdown
  const clientSelect = document.getElementById('budget-client');
  clientSelect.innerHTML = '<option value="">Seleccionar cliente...</option>';
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = `${client.name} (${client.email})`;
    if (client.id === budget.clientId) option.selected = true;
    clientSelect.appendChild(option);
  });
  
  document.getElementById('budget-date').value = budget.date.split('T')[0];
  document.getElementById('budget-status').value = budget.status;
  
  // Populate items
  const itemsContainer = document.getElementById('items-container');
  itemsContainer.innerHTML = '';
  budget.items.forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
      <input type="text" placeholder="Descripción" class="item-desc" value="${item.description}" required>
      <input type="number" placeholder="Cantidad" min="1" class="item-qty" value="${item.quantity}" required>
      <input type="number" placeholder="Precio" step="0.01" min="0" class="item-price" value="${item.price}" required>
      <button type="button" class="remove-item">✕</button>
    `;
    itemsContainer.appendChild(itemRow);
  });
  
  updateBudgetTotal();
  budgetModal.style.display = 'block';
}

function deleteBudget(budgetId) {
  if (!confirm('¿Estás seguro de eliminar este presupuesto?')) return;
  
  budgets = budgets.filter(b => b.id !== budgetId);
  saveBudgets();
  renderBudgets();
  updateDashboard();
  showMessage('Presupuesto eliminado');
}

function exportBudgetPDF(budgetId) {
  const budget = budgets.find(b => b.id === budgetId);
  if (!budget) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [102, 126, 234]; // #667eea
  const darkGray = [51, 65, 85];
  const lightGray = [148, 163, 184];
  
  // Header with gradient effect (simulated with rectangle)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('EDEN SoftWork', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('Soluciones digitales a medida', 20, 28);
  
  // Document title
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('PRESUPUESTO', 20, 55);
  
  // Budget info box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 65, 170, 30, 3, 3, 'FD');
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Cliente:', 25, 73);
  doc.text('Fecha:', 25, 81);
  doc.text('Estado:', 25, 89);
  
  doc.setFont(undefined, 'normal');
  doc.text(budget.clientName, 50, 73);
  doc.text(new Date(budget.date).toLocaleDateString('es-AR'), 50, 81);
  doc.text(budget.status.toUpperCase(), 50, 89);
  
  // Items table
  let y = 110;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Detalle de Servicios', 20, y);
  
  y += 10;
  
  // Table header
  doc.setFillColor(102, 126, 234);
  doc.rect(20, y - 5, 170, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Descripción', 25, y);
  doc.text('Cant.', 130, y);
  doc.text('Precio Unit.', 150, y);
  doc.text('Total', 175, y);
  
  y += 10;
  
  // Table rows
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont(undefined, 'normal');
  
  budget.items.forEach((item, index) => {
    const itemTotal = item.quantity * item.price;
    
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, y - 5, 170, 8, 'F');
    }
    
    // Wrap long descriptions
    const descLines = doc.splitTextToSize(item.description, 100);
    doc.text(descLines[0], 25, y);
    doc.text(item.quantity.toString(), 135, y);
    doc.text('$' + item.price.toLocaleString('es-AR'), 150, y);
    doc.text('$' + itemTotal.toLocaleString('es-AR'), 175, y);
    
    y += 10;
    
    // Add extra space for wrapped text
    if (descLines.length > 1) {
      y += (descLines.length - 1) * 5;
    }
  });
  
  // Total section
  y += 10;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(120, y - 5, 70, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL:', 125, y + 3);
  doc.text('$' + budget.total.toLocaleString('es-AR'), 175, y + 3, { align: 'right' });
  
  // Footer
  y = 270;
  doc.setFontSize(9);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont(undefined, 'italic');
  doc.text('Gracias por su confianza. Para consultas, contáctenos a edensoftwarework@gmail.com', 105, y, { align: 'center' });
  
  // Save PDF
  doc.save(`presupuesto-${budget.clientName.replace(/\s+/g, '-')}-${Date.now()}.pdf`);
  showMessage('PDF generado correctamente');
}

// Filters
document.getElementById('search-client').addEventListener('input', (e) => {
  const filterStatus = document.getElementById('filter-client-status').value;
  renderClients(e.target.value, filterStatus);
});

document.getElementById('filter-client-status').addEventListener('change', (e) => {
  const filterText = document.getElementById('search-client').value;
  renderClients(filterText, e.target.value);
});

document.getElementById('clear-client-filters').addEventListener('click', () => {
  document.getElementById('search-client').value = '';
  document.getElementById('filter-client-status').value = '';
  renderClients();
});

document.getElementById('search-budget').addEventListener('input', (e) => {
  const filterStatus = document.getElementById('filter-budget-status').value;
  renderBudgets(e.target.value, filterStatus);
});

document.getElementById('filter-budget-status').addEventListener('change', (e) => {
  const filterText = document.getElementById('search-budget').value;
  renderBudgets(filterText, e.target.value);
});

document.getElementById('clear-budget-filters').addEventListener('click', () => {
  document.getElementById('search-budget').value = '';
  document.getElementById('filter-budget-status').value = '';
  renderBudgets();
});

// Message Modal
function showMessage(message) {
  const messageModal = document.getElementById('message-modal');
  const messageText = document.getElementById('message-text');
  messageText.textContent = message;
  messageModal.style.display = 'block';
  
  setTimeout(() => {
    messageModal.style.display = 'none';
  }, 3000);
}

document.querySelector('.message-close').addEventListener('click', () => {
  document.getElementById('message-modal').style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Close modals with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Don't close tutorial modal here, it has its own handler
    if (clientModal.style.display === 'block') {
      clientModal.style.display = 'none';
    }
    if (budgetModal.style.display === 'block') {
      budgetModal.style.display = 'none';
    }
    if (document.getElementById('client-view-modal').style.display === 'block') {
      document.getElementById('client-view-modal').style.display = 'none';
    }
    if (document.getElementById('message-modal').style.display === 'block') {
      document.getElementById('message-modal').style.display = 'none';
    }
  }
});

// Initialize
updateDashboard();
renderClients();
renderBudgets();

// Show tutorial on first visit
setTimeout(() => {
  showTutorial();
}, 500);
