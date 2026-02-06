document.addEventListener('DOMContentLoaded', () => {
    // Tutorial elements
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeTutorialBtn = document.getElementById('close-tutorial');
    const closeTutorialX = document.getElementById('tutorial-close');
    const prevStepBtn = document.getElementById('prev-step');
    const nextStepBtn = document.getElementById('next-step');
    const steps = document.querySelectorAll('.step');
    const indicators = document.querySelectorAll('.indicator');
    let currentStep = 0;

    // Mode selector elements
    const modeBtns = document.querySelectorAll('.mode-btn');
    const clientView = document.getElementById('client-view');
    const adminView = document.getElementById('admin-view');
    let currentMode = 'admin';

    // Client form elements
    const clientForm = document.getElementById('client-appointment-form');
    const clientName = document.getElementById('client-name');
    const clientPhone = document.getElementById('client-phone');
    const serviceSelect = document.getElementById('service-select');
    const clientDate = document.getElementById('client-date');
    const clientTime = document.getElementById('client-time');
    const clientNotes = document.getElementById('client-notes');

    // Availability checker
    const availabilityDate = document.getElementById('availability-date');
    const checkAvailabilityBtn = document.getElementById('check-availability');
    const availabilityResults = document.getElementById('availability-results');
    
    // Set today's date as default for availability checker
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    if (availabilityDate) {
        availabilityDate.value = todayStr;
    }

    // Pending appointments
    const pendingList = document.getElementById('pending-appointments-list');

    // Existing admin elements
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
    const adminService = document.getElementById('admin-service');
    let currentAppt = null;
    
    // Service prices
    const servicePrices = {
        'Corte de Cabello': 12000,
        'Corte y Barba': 18000,
        'Coloración': 35000,
        'Alisado': 50000,
        'Tratamiento Capilar': 28000
    };

    // Tutorial functionality
    function showTutorial() {
        console.log('showTutorial called, tutorialCompleted:', localStorage.getItem('tutorialCompleted'));
        // Temporarily always show tutorial for testing
        // if (!localStorage.getItem('tutorialCompleted')) {
            console.log('Opening tutorial modal');
            tutorialModal.style.display = 'flex';
            document.body.classList.add('tutorial-active');
            // Initialize: hide prev arrow on first step
            prevStepBtn.style.display = 'none';
        // }
    }

    function closeTutorial() {
        tutorialModal.style.display = 'none';
        document.body.classList.remove('tutorial-active');
        // localStorage.setItem('tutorialCompleted', 'true');
    }

    function updateStep() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentStep);
        });
        
        // Hide/show arrows based on position
        if (currentStep === 0) {
            prevStepBtn.style.display = 'none';
        } else {
            prevStepBtn.style.display = 'flex';
        }
        
        if (currentStep === steps.length - 1) {
            nextStepBtn.style.display = 'none';
        } else {
            nextStepBtn.style.display = 'flex';
        }
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStep();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            updateStep();
        }
    }

    closeTutorialBtn.addEventListener('click', closeTutorial);
    closeTutorialX.addEventListener('click', closeTutorial);
    nextStepBtn.addEventListener('click', nextStep);
    prevStepBtn.addEventListener('click', prevStep);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentStep = index;
            updateStep();
        });
    });

    // Mode switching
    function switchMode(mode) {
        currentMode = mode;
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        if (mode === 'client') {
            clientView.style.display = 'block';
            adminView.style.display = 'none';
        } else {
            clientView.style.display = 'none';
            adminView.style.display = 'block';
        }
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchMode(btn.dataset.mode);
        });
    });

    // Client form submission
    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = clientName.value.trim();
        const phone = clientPhone.value.trim();
        const service = serviceSelect.value;
        const date = clientDate.value;
        const time = clientTime.value;
        const notes = clientNotes.value.trim();

        if (!name || !phone || !service || !date || !time) {
            showMessage('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Validate date is not in the past
        if (new Date(date + 'T00:00:00') < new Date(new Date().toDateString())) {
            showMessage('No puedes solicitar turnos en fechas pasadas.');
            return;
        }

        // Get service duration
        const serviceDurations = {
            'Corte de Cabello': 30,
            'Corte y Barba': 45,
            'Coloración': 90,
            'Alisado': 120,
            'Tratamiento Capilar': 60
        };
        
        const duration = serviceDurations[service];
        const [hours, minutes] = time.split(':').map(Number);
        const endDate = new Date();
        endDate.setHours(hours, minutes + duration);
        const endTime = endDate.toTimeString().slice(0, 5);

        // Validate that appointment doesn't exceed 22:00
        if (endTime > '22:00') {
            showMessage('El turno excedería el horario de atención (hasta 22:00). Por favor elige un horario más temprano.');
            return;
        }

        // Check for conflicts with confirmed appointments only
        const confirmedAppointments = appointments.filter(a => 
            a.date === date && a.status === 'confirmed'
        );
        const overlap = confirmedAppointments.some(a => 
            (time < a.endTime && endTime > a.startTime)
        );

        if (overlap) {
            showMessage('Lo sentimos, ese horario no está disponible. Por favor elige otro horario.');
            return;
        }

        // Create pending appointment
        const pendingAppointment = {
            client: name,
            phone: phone,
            service: service,
            date: date,
            startTime: time,
            endTime: endTime,
            notes: notes,
            status: 'pending',
            requestedAt: new Date().toISOString()
        };

        appointments.push(pendingAppointment);
        saveAppointments();
        
        showMessage('¡Solicitud enviada! El peluquero revisará tu solicitud y te confirmará el turno.');
        clientForm.reset();
        renderPendingAppointments();
    });

    // Availability checker
    checkAvailabilityBtn.addEventListener('click', () => {
        const selectedDate = availabilityDate.value;
        
        if (!selectedDate) {
            showMessage('Por favor selecciona una fecha para verificar disponibilidad.');
            return;
        }
        
        const dateObj = new Date(selectedDate + 'T00:00:00');
        const today = new Date(new Date().toDateString());
        
        if (dateObj < today) {
            showMessage('No puedes verificar disponibilidad de fechas pasadas.');
            return;
        }
        
        showAvailability(selectedDate);
    });

    function showAvailability(dateStr) {
        const dayAppointments = appointments.filter(a => a.date === dateStr && a.status === 'confirmed');
        
        // Generate time slots from 8:00 to 21:30 (last slot at 21:30)
        const timeSlots = [];
        for (let hour = 8; hour < 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timeSlots.push(time);
            }
        }
        
        // Check which slots are available
        const slotsStatus = timeSlots.map(time => {
            const isOccupied = dayAppointments.some(appt => {
                return time >= appt.startTime && time < appt.endTime;
            });
            
            return {
                time: time,
                available: !isOccupied
            };
        });
        
        // Format date for display
        const dateObj = new Date(dateStr + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('es-AR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Render availability
        let html = `
            <div class="availability-header">
                <h4>Disponibilidad para ${formattedDate}</h4>
                <p>${dayAppointments.length} turno${dayAppointments.length !== 1 ? 's' : ''} confirmado${dayAppointments.length !== 1 ? 's' : ''}</p>
            </div>
            <div class="time-slots-grid">
        `;
        
        slotsStatus.forEach(slot => {
            const className = slot.available ? 'available' : 'occupied';
            const icon = slot.available ? '✓' : '✗';
            html += `
                <div class="time-slot ${className}" ${slot.available ? `onclick="document.getElementById('client-time').value='${slot.time}'; document.getElementById('client-date').value='${dateStr}'; window.scrollTo({top: 0, behavior: 'smooth'});"` : ''}>
                    ${icon} ${slot.time}
                </div>
            `;
        });
        
        html += `
            </div>
            <div class="availability-legend">
                <div class="legend-item">
                    <div class="legend-color available"></div>
                    <span>Disponible (haz clic para seleccionar)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color occupied"></div>
                    <span>Ocupado</span>
                </div>
            </div>
        `;
        
        availabilityResults.innerHTML = html;
        availabilityResults.classList.add('show');
    }

    // Render pending appointments for admin
    function renderPendingAppointments() {
        const pending = appointments.filter(a => a.status === 'pending');
        
        if (pending.length === 0) {
            pendingList.innerHTML = '<div class="no-pending">No hay solicitudes pendientes</div>';
            return;
        }

        pendingList.innerHTML = pending.map((appt, index) => `
            <div class="pending-appointment">
                <div class="pending-appointment-header">
                    <div class="pending-client-info">
                        <h4>${appt.client}</h4>
                        <p>📞 ${appt.phone}</p>
                    </div>
                    <div class="pending-actions">
                        <button class="btn-confirm" onclick="confirmAppointment(${appointments.indexOf(appt)})">
                            ✓ Confirmar
                        </button>
                        <button class="btn-reject" onclick="rejectAppointment(${appointments.indexOf(appt)})">
                            ✗ Rechazar
                        </button>
                    </div>
                </div>
                <div class="pending-details">
                    <strong>Servicio:</strong> ${appt.service}<br>
                    <strong>Fecha:</strong> ${appt.date}<br>
                    <strong>Horario:</strong> ${appt.startTime} - ${appt.endTime}<br>
                    ${appt.notes ? `<strong>Notas:</strong> ${appt.notes}<br>` : ''}
                    <strong>Solicitado:</strong> ${new Date(appt.requestedAt).toLocaleString('es-AR')}
                </div>
            </div>
        `).join('');
    }

    // Confirm appointment (make it global for onclick)
    window.confirmAppointment = function(index) {
        appointments[index].status = 'confirmed';
        saveAppointments();
        showMessage('Turno confirmado exitosamente.');
        renderPendingAppointments();
        updateStats();
        renderCalendar();
        renderAppointments();
    };

    // Reject appointment (make it global for onclick)
    window.rejectAppointment = function(index) {
        if (confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) {
            appointments.splice(index, 1);
            saveAppointments();
            showMessage('Solicitud rechazada.');
            renderPendingAppointments();
            updateStats();
            renderCalendar();
            renderAppointments();
        }
    };

    function saveAppointments() {
      // Only save user appointments (not demo appointments)
      const userAppointments = appointments.filter(appt => !appt.isDemo);
      localStorage.setItem('appointments', JSON.stringify(userAppointments));
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
      const dayAppointments = appointments.filter(a => a.date === date && a !== currentAppt && a.status === 'confirmed');
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
      saveAppointments();
      updateStats();
      renderCalendar();
      renderAppointments();
      renderPendingAppointments();
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
    
    // Function to generate demo appointments with relative dates
    function generateDemoAppointments() {
        const today = new Date();
        const demoData = [
            // Confirmed appointments
            { client: 'Juan Pérez', service: 'Corte de Cabello', dayOffset: 0, startTime: '10:00', endTime: '10:30', status: 'confirmed' },
            { client: 'María García', service: 'Coloración', dayOffset: 0, startTime: '14:00', endTime: '15:30', status: 'confirmed' },
            { client: 'Carlos López', service: 'Corte y Barba', dayOffset: 1, startTime: '09:00', endTime: '09:45', status: 'confirmed' },
            { client: 'Ana Martínez', service: 'Tratamiento Capilar', dayOffset: 1, startTime: '16:00', endTime: '17:00', status: 'confirmed' },
            { client: 'Roberto Silva', service: 'Corte de Cabello', dayOffset: 2, startTime: '11:00', endTime: '11:30', status: 'confirmed' },
            { client: 'Laura Fernández', service: 'Alisado', dayOffset: 2, startTime: '15:00', endTime: '17:00', status: 'confirmed' },
            { client: 'Diego Romero', service: 'Corte y Barba', dayOffset: 3, startTime: '10:30', endTime: '11:15', status: 'confirmed' },
            { client: 'Sofía Morales', service: 'Coloración', dayOffset: 4, startTime: '13:00', endTime: '14:30', status: 'confirmed' },
            { client: 'Martín González', service: 'Corte de Cabello', dayOffset: 5, startTime: '09:30', endTime: '10:00', status: 'confirmed' },
            { client: 'Valentina Ruiz', service: 'Tratamiento Capilar', dayOffset: 6, startTime: '17:00', endTime: '18:00', status: 'confirmed' },
            // Pending appointments (with requestedDaysAgo for relative requestedAt date)
            { client: 'Lucas Díaz', phone: '11-2345-6789', service: 'Corte de Cabello', dayOffset: 3, startTime: '15:00', endTime: '15:30', status: 'pending', requestedDaysAgo: 2 },
            { client: 'Camila Torres', phone: '11-3456-7890', service: 'Alisado', dayOffset: 5, startTime: '10:00', endTime: '12:00', status: 'pending', requestedDaysAgo: 1 },
        ];
        
        return demoData.map(demo => {
            const appointmentDate = new Date(today);
            appointmentDate.setDate(today.getDate() + demo.dayOffset);
            const dateStr = appointmentDate.toISOString().slice(0, 10);
            
            const appointment = {
                client: demo.client,
                service: demo.service,
                date: dateStr,
                startTime: demo.startTime,
                endTime: demo.endTime,
                status: demo.status,
                isDemo: true
            };
            
            // Add phone for pending appointments
            if (demo.phone) {
                appointment.phone = demo.phone;
            }
            
            // Calculate requestedAt date for pending appointments
            if (demo.status === 'pending' && demo.requestedDaysAgo !== undefined) {
                const requestedDate = new Date(today);
                requestedDate.setDate(today.getDate() - demo.requestedDaysAgo);
                requestedDate.setHours(14, 30, 0, 0); // Set to 14:30 as example time
                appointment.requestedAt = requestedDate.toISOString();
            }
            
            return appointment;
        });
    }
    
    // Load appointments from localStorage
    let userAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Migrate old appointments to include status
    userAppointments = userAppointments.map(appt => {
        if (!appt.status) {
            appt.status = 'confirmed';
        }
        return appt;
    });
    
    // Combine demo appointments with user appointments
    const demoAppointments = generateDemoAppointments();
    let appointments = [...demoAppointments, ...userAppointments];
    
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
      
      if (list.length === 0) {
        appointmentsList.innerHTML = '<p class="no-appointments">No hay turnos que coincidan con la búsqueda.</p>';
        return;
      }
      
      // Create table
      const table = document.createElement('table');
      table.className = 'appointments-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      
      const tbody = table.querySelector('tbody');
      
      list.forEach((appt) => {
        const tr = document.createElement('tr');
        const isPast = new Date(appt.date + 'T00:00:00') < new Date(new Date().toDateString());
        if (isPast) tr.classList.add('past-appointment-row');
        
        tr.innerHTML = `
          <td>${appt.client}</td>
          <td>${appt.date}</td>
          <td>${appt.startTime} - ${appt.endTime}</td>
          <td class="actions-cell">
            ${!isPast ? '<button class="action-btn edit-action" title="Editar">✏️</button>' : ''}
            <button class="action-btn delete-action" title="Eliminar">🗑️</button>
          </td>
        `;
        
        // Edit button
        if (!isPast) {
          const editBtn = tr.querySelector('.edit-action');
          editBtn.addEventListener('click', () => {
            currentAppt = appt;
            editClient.value = appt.client;
            editDate.value = appt.date;
            editStartTime.value = appt.startTime;
            editEndTime.value = appt.endTime;
            editModal.style.display = 'block';
          });
        }
        
        // Delete button
        const deleteBtn = tr.querySelector('.delete-action');
        deleteBtn.addEventListener('click', () => {
          if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
            deleteAppointment(appointments.indexOf(appt));
          }
        });
        
        tbody.appendChild(tr);
      });
      
      appointmentsList.innerHTML = '';
      appointmentsList.appendChild(table);
    }

    function updateStats() {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const confirmedAppointments = appointments.filter(appt => appt.status === 'confirmed');
      const total = confirmedAppointments.filter(appt => appt.date >= today).length;
      const todayCount = confirmedAppointments.filter(appt => appt.date === today).length;
      const weekStart = new Date(now);
      const dayOfWeek = now.getDay();
      weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekStartStr = weekStart.toISOString().slice(0, 10);
      const weekEndStr = weekEnd.toISOString().slice(0, 10);
      const weekCount = confirmedAppointments.filter(appt => appt.date >= weekStartStr && appt.date <= weekEndStr).length;
      
      // Calculate revenue
      let totalRevenue = 0;
      const serviceCount = {};
      
      confirmedAppointments.forEach(appt => {
        const service = appt.service || 'Corte de Cabello';
        const price = servicePrices[service] || 0;
        totalRevenue += price;
        serviceCount[service] = (serviceCount[service] || 0) + 1;
      });
      
      // Update stats
      document.getElementById('stats-total').textContent = total;
      document.getElementById('stats-today').textContent = todayCount;
      document.getElementById('stats-week').textContent = weekCount;
      document.getElementById('stats-revenue').textContent = `$${totalRevenue.toLocaleString('es-AR')}`;
      
      // Render services breakdown
      const servicesBreakdown = document.getElementById('services-breakdown');
      if (Object.keys(serviceCount).length === 0) {
        servicesBreakdown.innerHTML = '<p class="no-services">No hay servicios registrados</p>';
      } else {
        let html = '';
        Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).forEach(([service, count]) => {
          const revenue = count * servicePrices[service];
          const icons = {
            'Corte de Cabello': '✂️',
            'Corte y Barba': '💈',
            'Coloración': '🎨',
            'Alisado': '🌊',
            'Tratamiento Capilar': '💆'
          };
          html += `
            <div class="service-item">
              <span class="service-icon">${icons[service] || '✨'}</span>
              <span class="service-name">${service}</span>
              <span class="service-count">${count} vez${count !== 1 ? 'es' : ''}</span>
              <span class="service-revenue">$${revenue.toLocaleString('es-AR')}</span>
            </div>
          `;
        });
        servicesBreakdown.innerHTML = html;
      }
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
        const confirmedAppointments = appointments.filter(appt => appt.status === 'confirmed');
        const hasAppointments = confirmedAppointments.some(appt => appt.date === dateStr);
        const isPast = new Date(dateStr) < new Date(now.toDateString());
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        if (isToday) {
          const activeAppointments = confirmedAppointments.filter(appt => appt.date === dateStr && new Date(`${dateStr}T${appt.endTime}`) > now);
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
      const confirmedAppointments = appointments.filter(appt => appt.status === 'confirmed');
      
      if (filter === 'today') {
        filteredAppointments = confirmedAppointments.filter(appt => appt.date === todayStr);
        isFiltered = true;
      } else if (filter === 'week') {
        const weekStart = new Date(now);
        const dayOfWeek = now.getDay();
        weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const weekStartStr = weekStart.toISOString().slice(0, 10);
        const weekEndStr = weekEnd.toISOString().slice(0, 10);
        filteredAppointments = confirmedAppointments.filter(appt => appt.date >= weekStartStr && appt.date <= weekEndStr);
        isFiltered = true;
      } else {
        filteredAppointments = confirmedAppointments.filter(appt => appt.date >= todayStr);
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
      const dayAppointments = appointments.filter(appt => appt.date === dateStr && appt.status === 'confirmed').sort((a, b) => a.startTime.localeCompare(b.startTime));
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
        if (messageModal.style.display === 'block') {
          messageModal.style.display = 'none';
        } else if (editModal.style.display === 'block') {
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
      const service = adminService.value;
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
        appointments[editingIndex] = { client, service, date, startTime, endTime, status: 'confirmed' };
        editingIndex = null;
        document.getElementById('submit-btn').textContent = 'Agregar Turno';
      } else {
        appointments.push({ client, service, date, startTime, endTime, status: 'confirmed' });
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
    showTutorial();
    renderPendingAppointments();
    updateStats();
    renderCalendar();
    filterAppointments('all');
    
    // Show availability for today by default in client mode
    if (availabilityDate && availabilityDate.value) {
        showAvailability(availabilityDate.value);
    }

    // Global keyboard navigation for tutorial
    document.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key, 'Modal display:', tutorialModal?.style.display);
        if (tutorialModal && tutorialModal.style.display === 'flex') {
            console.log('Inside tutorial modal, currentStep:', currentStep);
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Going to previous step');
                prevStep();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Going to next step');
                nextStep();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Closing tutorial');
                closeTutorial();
            }
        }
    });
    });