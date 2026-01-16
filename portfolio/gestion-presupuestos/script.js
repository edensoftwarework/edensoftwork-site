// Gestión de Presupuestos - EDEN SoftWork

let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
let editingBudgetId = null;

// Cargar presupuestos en la tabla
function loadBudgets() {
  const tbody = document.getElementById('budgets-tbody');
  tbody.innerHTML = '';
  budgets.forEach(budget => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${budget.client}</td>
      <td>${budget.date}</td>
      <td>$${budget.total.toFixed(2)}</td>
      <td>${budget.status}</td>
      <td>
        <button onclick="editBudget(${budget.id})">Editar</button>
        <button onclick="deleteBudget(${budget.id})" style="background: #dc3545;">Eliminar</button>
        <button onclick="exportPDF(${budget.id})">PDF</button>
        <button onclick="shareBudget(${budget.id})">Compartir</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Buscar presupuestos
document.getElementById('search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filtered = budgets.filter(budget => budget.client.toLowerCase().includes(query));
  displayFiltered(filtered);
});

document.getElementById('filter-status').addEventListener('change', function() {
  const status = this.value;
  let filtered = budgets;
  if (status) {
    filtered = budgets.filter(budget => budget.status === status);
  }
  displayFiltered(filtered);
});

document.getElementById('clear-filters').addEventListener('click', function() {
  document.getElementById('search').value = '';
  document.getElementById('filter-status').value = '';
  loadBudgets();
});

function displayFiltered(filtered) {
  const tbody = document.getElementById('budgets-tbody');
  tbody.innerHTML = '';
  filtered.forEach(budget => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${budget.client}</td>
      <td>${budget.date}</td>
      <td>$${budget.total.toFixed(2)}</td>
      <td>${budget.status}</td>
      <td>
        <button onclick="editBudget(${budget.id})">Editar</button>
        <button onclick="deleteBudget(${budget.id})" style="background: #dc3545;">Eliminar</button>
        <button onclick="exportPDF(${budget.id})">PDF</button>
        <button onclick="shareBudget(${budget.id})">Compartir</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Modal para agregar/editar presupuesto
const modal = document.getElementById('budget-modal');
const closeModal = document.getElementById('budget-close');
const form = document.getElementById('budget-form');
const modalTitle = document.getElementById('budget-modal-title');

document.getElementById('add-budget-btn').addEventListener('click', () => {
  editingBudgetId = null;
  modalTitle.textContent = 'Agregar Presupuesto';
  form.reset();
  document.getElementById('items-container').innerHTML = `
    <div class="item">
      <input type="text" placeholder="Descripción" class="item-desc" required>
      <input type="number" placeholder="Precio" step="0.01" min="0" class="item-price" required>
      <input type="number" placeholder="Cantidad" min="1" class="item-qty" value="1" required>
      <button type="button" class="remove-item">Eliminar</button>
    </div>
  `;
  calculateTotal();
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => modal.style.display = 'none');
document.getElementById('cancel-budget').addEventListener('click', () => modal.style.display = 'none');

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Cerrar modales con Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
    document.getElementById('message-modal').style.display = 'none';
  }
});

// Agregar ítem
document.getElementById('add-item-btn').addEventListener('click', () => {
  const container = document.getElementById('items-container');
  const item = document.createElement('div');
  item.className = 'item';
  item.innerHTML = `
    <input type="text" placeholder="Descripción" class="item-desc" required>
    <input type="number" placeholder="Precio" step="0.01" min="0" class="item-price" required>
    <input type="number" placeholder="Cantidad" min="1" class="item-qty" value="1" required>
    <button type="button" class="remove-item">Eliminar</button>
  `;
  container.appendChild(item);
  calculateTotal();
});

// Remover ítem
document.getElementById('items-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    e.target.parentElement.remove();
    calculateTotal();
  }
});

// Calcular total
function calculateTotal() {
  const items = document.querySelectorAll('.item');
  let total = 0;
  items.forEach(item => {
    const price = parseFloat(item.querySelector('.item-price').value) || 0;
    const qty = parseInt(item.querySelector('.item-qty').value) || 0;
    total += price * qty;
  });
  document.getElementById('budget-total').textContent = total.toFixed(2);
}

document.getElementById('items-container').addEventListener('input', calculateTotal);

// Guardar presupuesto
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const client = document.getElementById('budget-client').value.trim();
  const date = document.getElementById('budget-date').value;
  const status = document.getElementById('budget-status').value;
  const items = [];
  document.querySelectorAll('.item').forEach(item => {
    const desc = item.querySelector('.item-desc').value.trim();
    const price = parseFloat(item.querySelector('.item-price').value);
    const qty = parseInt(item.querySelector('.item-qty').value);
    if (desc && price >= 0 && qty > 0) {
      items.push({ desc, price, qty });
    }
  });
  const total = parseFloat(document.getElementById('budget-total').textContent);

  if (!client || items.length === 0) {
    showMessage('Cliente y al menos un ítem son obligatorios.');
    return;
  }

  if (editingBudgetId) {
    const budget = budgets.find(b => b.id === editingBudgetId);
    budget.client = client;
    budget.date = date;
    budget.items = items;
    budget.total = total;
    budget.status = status;
  } else {
    const newBudget = {
      id: Date.now(),
      client,
      date,
      items,
      total,
      status
    };
    budgets.push(newBudget);
  }

  saveBudgets();
  loadBudgets();
  modal.style.display = 'none';
  showMessage(editingBudgetId ? 'Presupuesto actualizado correctamente.' : 'Presupuesto agregado correctamente.');
});

// Editar presupuesto
function editBudget(id) {
  const budget = budgets.find(b => b.id === id);
  if (!budget) return;
  editingBudgetId = id;
  modalTitle.textContent = 'Editar Presupuesto';
  document.getElementById('budget-client').value = budget.client;
  document.getElementById('budget-date').value = budget.date;
  document.getElementById('budget-status').value = budget.status;
  const container = document.getElementById('items-container');
  container.innerHTML = '';
  budget.items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
      <input type="text" placeholder="Descripción" class="item-desc" value="${item.desc}" required>
      <input type="number" placeholder="Precio" step="0.01" min="0" class="item-price" value="${item.price}" required>
      <input type="number" placeholder="Cantidad" min="1" class="item-qty" value="${item.qty}" required>
      <button type="button" class="remove-item">Eliminar</button>
    `;
    container.appendChild(itemDiv);
  });
  calculateTotal();
  modal.style.display = 'block';
}

// Eliminar presupuesto
function deleteBudget(id) {
  if (confirm('¿Estás seguro de eliminar este presupuesto?')) {
    budgets = budgets.filter(b => b.id !== id);
    saveBudgets();
    loadBudgets();
    showMessage('Presupuesto eliminado correctamente.');
  }
}

// Exportar a PDF
function exportPDF(id) {
  const budget = budgets.find(b => b.id === id);
  if (!budget) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text(`Presupuesto para ${budget.client}`, 20, 20);
  doc.text(`Fecha: ${budget.date}`, 20, 30);
  doc.text(`Estado: ${budget.status}`, 20, 40);

  let y = 60;
  budget.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.desc} - $${item.price} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}`, 20, y);
    y += 10;
  });

  doc.text(`Total: $${budget.total.toFixed(2)}`, 20, y + 10);

  doc.save(`presupuesto-${budget.client}.pdf`);
}

// Compartir presupuesto
function shareBudget(id) {
  const budget = budgets.find(b => b.id === id);
  if (!budget) return;

  const data = encodeURIComponent(JSON.stringify(budget));
  const url = `${window.location.origin}${window.location.pathname}?budget=${data}`;
  navigator.clipboard.writeText(url).then(() => {
    showMessage('Enlace copiado al portapapeles.');
  });
}

// Cargar desde URL si hay
const urlParams = new URLSearchParams(window.location.search);
const budgetData = urlParams.get('budget');
if (budgetData) {
  try {
    const budget = JSON.parse(decodeURIComponent(budgetData));
    budgets.push(budget);
    saveBudgets();
    loadBudgets();
    showMessage('Presupuesto compartido cargado.');
  } catch (e) {
    showMessage('Error al cargar presupuesto compartido.');
  }
}

// Guardar en localStorage
function saveBudgets() {
  localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Mostrar mensaje
function showMessage(text) {
  const messageModal = document.getElementById('message-modal');
  document.getElementById('message-text').textContent = text;
  messageModal.style.display = 'block';
  document.querySelector('.message-close').addEventListener('click', () => messageModal.style.display = 'none');
  setTimeout(() => messageModal.style.display = 'none', 3000);
}

// Inicializar
loadBudgets();