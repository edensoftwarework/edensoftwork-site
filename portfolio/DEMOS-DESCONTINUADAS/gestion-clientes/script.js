// Gestión de Clientes - EDEN SoftWork

let clients = JSON.parse(localStorage.getItem('clients')) || [];
let editingClientId = null;
let currentSort = 'desc'; // 'asc' o 'desc'
let currentClientNotes = []; // Para mantener las notas filtradas

// Cargar clientes en la tabla
function loadClients() {
  const tbody = document.getElementById('clients-tbody');
  tbody.innerHTML = '';
  clients.forEach(client => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.phone || '-'}</td>
      <td>${client.email || '-'}</td>
      <td><a href="#" onclick="viewHistory(${client.id}); return false;" style="color: #667eea; text-decoration: underline;">Ver</a></td>
      <td class="actions-cell">
        <button onclick="editClient(${client.id})">Editar</button>
        <button onclick="deleteClient(${client.id})" style="background: #dc3545;">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Buscar clientes
document.getElementById('search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filtered = clients.filter(client => client.name.toLowerCase().includes(query));
  const tbody = document.getElementById('clients-tbody');
  tbody.innerHTML = '';
  filtered.forEach(client => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.phone || '-'}</td>
      <td>${client.email || '-'}</td>
      <td><a href="#" onclick="viewHistory(${client.id}); return false;" style="color: #667eea; text-decoration: underline;">Ver</a></td>
      <td>
        <button onclick="editClient(${client.id})">Editar</button>
        <button onclick="deleteClient(${client.id})" style="background: #dc3545;">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
});

document.getElementById('clear-search').addEventListener('click', function() {
  document.getElementById('search').value = '';
  loadClients();
});

// Modal para agregar/editar cliente
const modal = document.getElementById('client-modal');
const closeModal = document.getElementById('client-close');
const form = document.getElementById('client-form');
const modalTitle = document.getElementById('modal-title');
const notesHistory = document.getElementById('notes-history');
const notesList = document.getElementById('notes-list');

document.getElementById('add-client-btn').addEventListener('click', () => {
  editingClientId = null;
  modalTitle.textContent = 'Agregar Cliente';
  form.reset();
  notesHistory.style.display = 'none';
  document.getElementById('submit-client-btn').textContent = 'Guardar Cliente';
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => modal.style.display = 'none');
document.getElementById('cancel-client').addEventListener('click', () => modal.style.display = 'none');

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Cerrar modales con Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
    document.getElementById('history-modal').style.display = 'none';
    document.getElementById('message-modal').style.display = 'none';
  }
});

// Cerrar history modal
document.getElementById('history-close').addEventListener('click', () => {
  document.getElementById('history-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('history-modal')) {
    document.getElementById('history-modal').style.display = 'none';
  }
});

// Filtro de historial por fecha
document.getElementById('history-filter-date').addEventListener('change', function() {
  const selectedDate = this.value;
  const clientName = document.getElementById('history-title').textContent.replace('Historial de ', '');
  const client = clients.find(c => c.name === clientName);
  if (!client || !client.notes) return;
  
  if (selectedDate) {
    currentClientNotes = client.notes.filter(note => {
      // Extraer fecha de la nota (formato: "dd/mm/yyyy, hh:mm:ss")
      const noteDateStr = note.date.split(',')[0]; // "dd/mm/yyyy"
      const [day, month, year] = noteDateStr.split('/');
      const noteDateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return noteDateFormatted === selectedDate;
    });
  } else {
    currentClientNotes = client.notes;
  }
  displayHistory(currentClientNotes, currentSort);
});

document.getElementById('clear-history-filter').addEventListener('click', function() {
  document.getElementById('history-filter-date').value = '';
  const clientName = document.getElementById('history-title').textContent.replace('Historial de ', '');
  const client = clients.find(c => c.name === clientName);
  currentClientNotes = client.notes || [];
  displayHistory(currentClientNotes, currentSort);
});

// Toggle ordenar
document.getElementById('sort-toggle').addEventListener('click', function() {
  currentSort = currentSort === 'asc' ? 'desc' : 'asc';
  this.textContent = currentSort === 'asc' ? 'Ascendente ↑' : 'Descendente ↓';
  displayHistory(currentClientNotes, currentSort);
});

// Editar cliente
function editClient(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;
  editingClientId = id;
  modalTitle.textContent = 'Editar Cliente';
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-phone').value = client.phone || '';
  document.getElementById('client-email').value = client.email || '';
  document.getElementById('client-note').value = '';
  document.getElementById('note-priority').checked = false;
  document.getElementById('submit-client-btn').textContent = 'Actualizar Cliente';
  // Mostrar historial
  notesList.innerHTML = '';
  if (client.notes && client.notes.length > 0) {
    client.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = `${note.date}: ${note.text}`;
      if (note.priority) li.style.fontWeight = 'bold';
      notesList.appendChild(li);
    });
    notesHistory.style.display = 'block';
  } else {
    notesHistory.style.display = 'none';
  }
  modal.style.display = 'block';
}

// Ver historial de cliente
function viewHistory(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;
  const historyModal = document.getElementById('history-modal');
  const historyTitle = document.getElementById('history-title');
  const filterDate = document.getElementById('history-filter-date');
  const sortToggle = document.getElementById('sort-toggle');
  historyTitle.textContent = `Historial de ${client.name}`;
  filterDate.value = '';
  currentSort = 'asc';
  sortToggle.textContent = 'Ascendente ↑';
  currentClientNotes = client.notes || [];
  displayHistory(currentClientNotes, currentSort);
  historyModal.style.display = 'block';
}

function displayHistory(notes, sortOrder = 'desc') {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  if (notes.length > 0) {
    // Crear una copia para no mutar el original
    const sortedNotes = [...notes].sort((a, b) => {
      // Parsear fecha manualmente (formato: "dd/mm/yyyy, hh:mm:ss")
      const [dateStrA] = a.date.split(', ');
      const [dayA, monthA, yearA] = dateStrA.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      
      const [dateStrB] = b.date.split(', ');
      const [dayB, monthB, yearB] = dateStrB.split('/').map(Number);
      const dateB = new Date(yearB, monthB - 1, dayB);
      
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    sortedNotes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = `${note.date}: ${note.text}`;
      if (note.priority) li.style.fontWeight = 'bold';
      historyList.appendChild(li);
    });
  } else {
    historyList.innerHTML = '<li>No hay notas.</li>';
  }
}

// Eliminar cliente
function deleteClient(id) {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
    loadClients();
    showMessage('Cliente eliminado correctamente.');
  }
}

// Guardar cliente
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const note = document.getElementById('client-note').value.trim();
  const priority = document.getElementById('note-priority').checked;

  if (!name) {
    showMessage('El nombre es obligatorio.');
    return;
  }

  // Verificar si ya existe un cliente con el mismo nombre (ignorando mayúsculas/minúsculas)
  const existingClient = clients.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingClientId);
  if (existingClient) {
    showMessage('Ya existe un cliente con ese nombre.');
    return;
  }

  if (editingClientId) {
    // Editar
    const client = clients.find(c => c.id === editingClientId);
    client.name = name;
    client.phone = phone;
    client.email = email;
    if (note) {
      if (!client.notes) client.notes = [];
      client.notes.push({ date: new Date().toLocaleString(), text: note, priority });
    }
  } else {
    // Agregar
    const newClient = {
      id: Date.now(),
      name,
      phone,
      email,
      notes: note ? [{ date: new Date().toLocaleString(), text: note, priority }] : []
    };
    clients.push(newClient);
  }

  saveClients();
  loadClients();
  modal.style.display = 'none';
  showMessage(editingClientId ? 'Cliente actualizado correctamente.' : 'Cliente agregado correctamente.');
});

// Guardar en localStorage
function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
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
loadClients();