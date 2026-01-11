document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointment-form');
    const appointmentsList = document.getElementById('appointments-list');
    const searchInput = document.getElementById('search');
    const filterToday = document.getElementById('filter-today');
    const filterWeek = document.getElementById('filter-week');
    const filterAll = document.getElementById('filter-all');
    const statsTotal = document.getElementById('stats-total');
    const statsToday = document.getElementById('stats-today');
    const statsWeek = document.getElementById('stats-week');
    const calendarTitle = document.getElementById('calendar-title');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    const calendar = document.getElementById('calendar');
    const modal = document.getElementById('day-modal');
    const modalDate = document.getElementById('modal-date');
    const modalAppointments = document.getElementById('time-slots');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editClient = document.getElementById('edit-client');
    const editDate = document.getElementById('edit-date');
    const editStartTime = document.getElementById('edit-start-time');
    const editEndTime = document.getElementById('edit-end-time');
    const cancelEdit = document.getElementById('cancel-edit');
    const editClose = document.getElementById('edit-close');
    let currentAppt = null;

    function saveAppointments() {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    function saveAppointments() {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentAppt) return;
      const client = editClient.value.trim();
      const date = editDate.value;
      const startTime = editStartTime.value;
      const endTime = editEndTime.value;
      if (!client || !date || !startTime || !endTime) {
        showMessage('Todos los campos son obligatorios.');
        return;
      }
      if (new Date(date + 'T00:00:00') < new Date(new Date().toDateString())) {
        showMessage('No puedes agendar turnos en fechas pasadas.');
        return;
      }
      if (startTime >= endTime) {
        showMessage('La hora de fin debe ser posterior a la de inicio.');
        return;
      }
      if (startTime < '08:00' || endTime > '22:00') {
        showMessage('Los turnos deben estar entre 08:00 y 22:00.');
        return;
      }
      const dayAppointments = appointments.filter(a => a.date === date && a !== currentAppt);
      const overlap = dayAppointments.some(a => (startTime < a.endTime && endTime > a.startTime));
      if (overlap) {
        showMessage('Hay un conflicto de horario con otro turno.');
        return;
      }
      // update
      currentAppt.client = client;
      currentAppt.date = date;
      currentAppt.startTime = startTime;
      currentAppt.endTime = endTime;
      localStorage.setItem('appointments', JSON.stringify(appointments));
      updateStats();
      renderCalendar();
      renderAppointments();
      // refresh day modal
      showDayAppointments(date);
      editModal.style.display = 'none';
      modal.style.display = 'none';
      showMessage('Turno actualizado correctamente.');
      currentAppt = null;
    });

    cancelEdit.addEventListener('click', () => {
      editModal.style.display = 'none';
    });

    editClose.addEventListener('click', () => {
      editModal.style.display = 'none';
    });

    editStartTime.addEventListener('change', () => {
      const start = editStartTime.value;
      if (start) {
        const [h, m] = start.split(':').map(Number);
        const endH = h + Math.floor((m + 30) / 60);
        const endM = (m + 30) % 60;
        editEndTime.value = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      }
    });
    const closeModal = document.querySelector('.close');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const messageModal = document.getElementById('message-modal');
    const messageText = document.getElementById('message-text');
    const messageClose = document.querySelector('.message-close');
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let filteredAppointments = [];
    let editingIndex = null;
    let isFiltered = true;
    let currentFilter = 'all';

    startTimeInput.addEventListener('change', () => {
      if (startTimeInput.value) {
        const [hours, minutes] = startTimeInput.value.split(':').map(Number);
        const endDate = new Date();
        endDate.setHours(hours, minutes + 30);
        endTimeInput.value = endDate.toTimeString().slice(0, 5);
      }
    });

    function showMessage(message) {
      messageText.textContent = message;
      messageModal.style.display = 'block';
    }

    function renderAppointments(list = filteredAppointments) {
      if (!isFiltered) {
        appointmentsList.style.display = 'none';
        return;
      }
      appointmentsList.style.display = 'block';
      const ul = appointmentsList.querySelector('ul') || document.createElement('ul');
      ul.innerHTML = '';
      if (list.length === 0) {
        appointmentsList.innerHTML = '<h2>Turnos Agendados</h2><p>No hay turnos que coincidan con la búsqueda.</p>';
        return;
      }
      list.forEach((appt, index) => {
        const li = document.createElement('li');
        li.className = 'appointment';
        li.innerHTML = `
          <span>${appt.client} - ${appt.date} ${appt.startTime} - ${appt.endTime}</span>
        `;
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          // Ocultar menú anterior si existe
          const existingMenu = document.querySelector('.action-menu');
          if (existingMenu) existingMenu.remove();
          // Crear menú
          const menu = document.createElement('div');
          menu.className = 'action-menu';
          menu.style.left = e.clientX + 'px';
          menu.style.top = e.clientY + 'px';
          const isPast = new Date(appt.date + 'T00:00:00') < new Date(new Date().toDateString());
          menu.innerHTML = `
            ${isPast ? '' : '<button id="edit-btn">Editar</button>'}
            <button id="delete-btn">Eliminar</button>
          `;
          document.body.appendChild(menu);
          menu.style.display = 'block';
          // Event listeners
          if (!isPast) {
            menu.querySelector('#edit-btn').addEventListener('click', () => {
              currentAppt = appt;
              editClient.value = appt.client;
              editDate.value = appt.date;
              editStartTime.value = appt.startTime;
              editEndTime.value = appt.endTime;
              editModal.style.display = 'block';
              menu.remove();
            });
          }
          menu.querySelector('#delete-btn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
              deleteAppointment(appointments.indexOf(appt));
            }
            menu.remove();
          });
          // Cerrar al hacer clic fuera
          const closeMenu = (event) => {
            if (!menu.contains(event.target)) {
              menu.remove();
              document.removeEventListener('click', closeMenu);
            }
          };
          setTimeout(() => document.addEventListener('click', closeMenu), 0);
        });
        ul.appendChild(li);
      });
      appointmentsList.innerHTML = '<h2>Turnos Agendados</h2>';
      appointmentsList.appendChild(ul);
    }

    function updateStats() {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const total = appointments.filter(appt => appt.date >= today).length;
      const todayCount = appointments.filter(appt => appt.date === today).length;
      const weekStart = new Date(now);
      const dayOfWeek = now.getDay();
      weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekStartStr = weekStart.toISOString().slice(0, 10);
      const weekEndStr = weekEnd.toISOString().slice(0, 10);
      const weekCount = appointments.filter(appt => appt.date >= weekStartStr && appt.date <= weekEndStr).length;
      statsTotal.textContent = `Total de turnos: ${total}`;
      statsToday.textContent = `Turnos hoy: ${todayCount}`;
      statsWeek.textContent = `Turnos esta semana: ${weekCount}`;
    }

    function renderCalendar() {
      calendar.innerHTML = '';
      const now = new Date();
      const year = currentYear;
      const month = currentMonth;
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      calendarTitle.textContent = `${new Date(year, month).toLocaleString('es', { month: 'long', year: 'numeric' })}`;

      // Días de la semana
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day';
        header.textContent = day;
        calendar.appendChild(header);
      });

      // Espacios vacíos
      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day';
        calendar.appendChild(empty);
      }

      // Días del mes
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasAppointments = appointments.some(appt => appt.date === dateStr);
        const isPast = new Date(dateStr) < new Date(now.toDateString());
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        if (isToday) {
          const activeAppointments = appointments.filter(appt => appt.date === dateStr && new Date(`${dateStr}T${appt.endTime}`) > now);
          if (activeAppointments.length > 0) {
            dayDiv.classList.add('today-active');
          } else if (hasAppointments) {
            dayDiv.classList.add('today-past');
          } else {
            dayDiv.classList.add('today-no');
          }
        } else if (hasAppointments) {
          dayDiv.classList.add('has-appointments');
        }
        if (isPast && hasAppointments && !isToday) {
          dayDiv.classList.add('past');
        }
        dayDiv.addEventListener('click', () => {
          showDayAppointments(dateStr);
        });
        calendar.appendChild(dayDiv);
      }
    }

    function filterAppointments(filter = 'all') {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      if (filter === 'today') {
        filteredAppointments = appointments.filter(appt => appt.date === todayStr);
        isFiltered = true;
      } else if (filter === 'week') {
        const weekStart = new Date(now);
        const dayOfWeek = now.getDay();
        weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const weekStartStr = weekStart.toISOString().slice(0, 10);
        const weekEndStr = weekEnd.toISOString().slice(0, 10);
        filteredAppointments = appointments.filter(appt => appt.date >= weekStartStr && appt.date <= weekEndStr);
        isFiltered = true;
      } else {
        filteredAppointments = appointments.filter(appt => appt.date >= todayStr);
        isFiltered = true;
      }
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filteredAppointments = filteredAppointments.filter(appt => appt.client.toLowerCase().startsWith(searchTerm));
      }
      renderAppointments();
    }

    function showDayAppointments(dateStr) {
      if (!modalDate) {
        return;
      }
      const dayAppointments = appointments.filter(appt => appt.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
      const date = new Date(dateStr + 'T00:00:00');
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      modalDate.textContent = `Turnos para ${day}/${month}/${year}`;
      modalAppointments.innerHTML = '';
      const timelineDiv = document.createElement('div');
      timelineDiv.className = 'timeline';
      // Horas
      for (let hour = 8; hour <= 22; hour++) {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'timeline-hour';
        hourDiv.innerHTML = `<div class="hour-label">${String(hour).padStart(2, '0')}:00</div><div class="hour-line"></div>`;
        timelineDiv.appendChild(hourDiv);
      }
      // Turnos
      dayAppointments.forEach(appt => {
        const [startH, startM] = appt.startTime.split(':').map(Number);
        const [endH, endM] = appt.endTime.split(':').map(Number);
        const startMinutes = (startH - 8) * 60 + startM;
        const endMinutes = (endH - 8) * 60 + endM;
        const top = (startMinutes / 60) * 40;
        const height = ((endMinutes - startMinutes) / 60) * 40;
        const apptDiv = document.createElement('div');
        apptDiv.className = 'timeline-appointment';
        apptDiv.style.top = `${top}px`;
        apptDiv.style.height = `${height}px`;
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const isPast = appt.date < todayStr || (appt.date === todayStr && now > new Date(`${appt.date}T${appt.endTime}`));
        if (isPast) {
          apptDiv.classList.add('past-appointment');
        }
        apptDiv.innerHTML = `
          <div class="appt-content">${appt.startTime} - ${appt.endTime} ${appt.client}</div>
        `;
        apptDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          // Ocultar menú anterior si existe
          const existingMenu = document.querySelector('.action-menu');
          if (existingMenu) existingMenu.remove();
          // Crear menú
          const menu = document.createElement('div');
          menu.className = 'action-menu';
          menu.style.left = e.clientX + 'px';
          menu.style.top = e.clientY + 'px';
          menu.innerHTML = `
            ${isPast ? '' : '<button id="edit-btn">Editar</button>'}
            <button id="delete-btn">Eliminar</button>
          `;
          document.body.appendChild(menu);
          menu.style.display = 'block';
          // Event listeners
          if (!isPast) {
            menu.querySelector('#edit-btn').addEventListener('click', () => {
              currentAppt = appt;
              editClient.value = appt.client;
              editDate.value = appt.date;
              editStartTime.value = appt.startTime;
              editEndTime.value = appt.endTime;
              editModal.style.display = 'block';
              menu.remove();
            });
          }
          menu.querySelector('#delete-btn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
              deleteAppointment(appointments.indexOf(appt));
              modal.style.display = 'none';
            }
            menu.remove();
          });
          // Cerrar al hacer clic fuera
          const closeMenu = (event) => {
            if (!menu.contains(event.target)) {
              menu.remove();
              document.removeEventListener('click', closeMenu);
            }
          };
          setTimeout(() => document.addEventListener('click', closeMenu), 0);
        });
        timelineDiv.appendChild(apptDiv);
      });
      modalAppointments.appendChild(timelineDiv);
      modal.style.display = 'block';
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
      if (event.target === editModal) {
        editModal.style.display = 'none';
      }
    };
      console.log('Modal displayed');
    }

    messageClose.addEventListener('click', () => messageModal.style.display = 'none');
    window.addEventListener('click', (e) => {
      if (e.target === messageModal) messageModal.style.display = 'none';
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (editModal.style.display === 'block') {
          editModal.style.display = 'none';
        } else if (modal.style.display === 'block') {
          modal.style.display = 'none';
        }
      }
    });

    prevMonth.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = document.getElementById('client').value;
      const date = document.getElementById('date').value;
      const startTime = document.getElementById('start-time').value;
      const endTime = document.getElementById('end-time').value;
      const now = new Date();
      const selectedStart = new Date(`${date}T${startTime}`);
      const selectedEnd = new Date(`${date}T${endTime}`);
      if (startTime < '08:00' || endTime < '08:00') {
        showMessage('Los turnos deben comenzar y terminar entre las 08:00 y 22:00.');
        return;
      }
      if (startTime > '22:00' || endTime > '22:00') {
        showMessage('Los turnos no pueden superar las 22:00.');
        return;
      }
      if (selectedStart <= now) {
        startTimeInput.setCustomValidity('No se pueden agendar turnos en fechas u horas pasadas.');
        startTimeInput.reportValidity();
        return;
      }
      if (selectedEnd <= selectedStart) {
        showMessage('La hora de fin debe ser posterior a la hora de inicio.');
        return;
      }
      if (editingIndex !== null) {
        appointments[editingIndex] = { client, date, startTime, endTime };
        editingIndex = null;
        document.getElementById('submit-btn').textContent = 'Agregar Turno';
      } else {
        appointments.push({ client, date, startTime, endTime });
      }
      saveAppointments();
      form.reset();
      startTimeInput.setCustomValidity('');
      filterAppointments();
      updateStats();
      renderCalendar();
    });

    searchInput.addEventListener('input', () => filterAppointments(currentFilter));
    filterToday.addEventListener('click', () => { currentFilter = 'today'; filterAppointments('today'); });
    filterWeek.addEventListener('click', () => { currentFilter = 'week'; filterAppointments('week'); });
    filterAll.addEventListener('click', () => { currentFilter = 'all'; filterAppointments('all'); });

    function deleteAppointment(index) {
      appointments.splice(index, 1);
      saveAppointments();
      filterAppointments();
      updateStats();
      renderCalendar();
    }

    function editAppointment(index) {
      const appt = appointments[index];
      document.getElementById('client').value = appt.client;
      document.getElementById('date').value = appt.date;
      document.getElementById('start-time').value = appt.startTime;
      document.getElementById('end-time').value = appt.endTime;
      editingIndex = index;
      document.getElementById('submit-btn').textContent = 'Actualizar Turno';
    }

    function editAppointmentFromModal(dateStr, index) {
      const dayAppointments = appointments.filter(appt => appt.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
      const appt = dayAppointments[index];
      const globalIndex = appointments.indexOf(appt);
      editAppointment(globalIndex);
      modal.style.display = 'none';
    }

    function deleteAppointmentFromModal(dateStr, index) {
      const dayAppointments = appointments.filter(appt => appt.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
      const appt = dayAppointments[index];
      const globalIndex = appointments.indexOf(appt);
      deleteAppointment(globalIndex);
      modal.style.display = 'none';
    }

    // Inicializar
    updateStats();
    renderCalendar();
    });