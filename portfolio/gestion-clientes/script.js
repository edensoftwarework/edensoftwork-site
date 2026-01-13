// Gestión de Clientes - EDEN SoftWork

let clients = JSON.parse(localStorage.getItem('clients')) || [];
let editingClientId = null;

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
      <td>
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
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => modal.style.display = 'none');
document.getElementById('cancel-client').addEventListener('click', () => modal.style.display = 'none');

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
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
  // Mostrar historial
  notesList.innerHTML = '';
  if (client.notes && client.notes.length > 0) {
    client.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = `${note.date}: ${note.text}`;
      notesList.appendChild(li);
    });
    notesHistory.style.display = 'block';
  } else {
    notesHistory.style.display = 'none';
  }
  modal.style.display = 'block';
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

  if (!name) {
    showMessage('El nombre es obligatorio.');
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
      client.notes.push({ date: new Date().toLocaleString(), text: note });
    }
  } else {
    // Agregar
    const newClient = {
      id: Date.now(),
      name,
      phone,
      email,
      notes: note ? [{ date: new Date().toLocaleString(), text: note }] : []
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