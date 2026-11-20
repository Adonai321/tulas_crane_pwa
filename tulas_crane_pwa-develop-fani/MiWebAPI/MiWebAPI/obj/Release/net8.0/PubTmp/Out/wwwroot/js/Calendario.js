"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTOS DEL DOM
    // ==========================================

    const calendarTitle = document.getElementById("calendarTitle");
    const calendarYear = document.getElementById("calendarYear");
    const calendarContainer = document.getElementById("calendarContainer");
    const previousPeriod = document.getElementById("previousPeriod");
    const nextPeriod = document.getElementById("nextPeriod");
    const todayButton = document.getElementById("todayButton");
    const selectedDateLabel = document.getElementById("selectedDateLabel");
    const eventsDateHeading = document.getElementById("eventsDateHeading");
    const eventsList = document.getElementById("eventsList");
    const eventCount = document.getElementById("eventCount");

    const addEventButton = document.getElementById("addEventButton");
    const eventModal = document.getElementById("eventModal");
    const closeModal = document.getElementById("closeModal");
    const cancelEvent = document.getElementById("cancelEvent");
    const eventForm = document.getElementById("eventForm");
    const formMessage = document.getElementById("formMessage");

    const eventTypeInput = document.getElementById("eventType");
    const eventTitleInput = document.getElementById("eventTitle");
    const eventDateInput = document.getElementById("eventDate");
    const eventTimeInput = document.getElementById("eventTime");
    const eventEndDateInput = document.getElementById("eventEndDate");
    const eventEndTimeInput = document.getElementById("eventEndTime");
    const eventDescriptionInput = document.getElementById("eventDescription");
    const eventEmployeeSelect = document.getElementById("eventEmployee");

    const otherEventField = document.getElementById("otherEventField");
    const otherEventTypeInput = document.getElementById("otherEventType");
    const personalEventField = document.getElementById("personalEventField");
    const personalEventTypeInput = document.getElementById("personalEventType");
    const maintenanceField = document.getElementById("maintenanceField");
    const maintenanceTypeInput = document.getElementById("maintenanceType");
    const machineryField = document.getElementById("machineryField");
    const machineryInput = document.getElementById("eventMachinery");
    const meetingDetailsField = document.getElementById("meetingDetailsField");
    const meetingPlaceInput = document.getElementById("meetingPlace");
    const meetingContactInput = document.getElementById("meetingContact");
    const maniobraFinancialsField = document.getElementById("maniobraFinancialsField");
    const maniobraTotalInput = document.getElementById("maniobraTotal");
    const maniobraAdvanceInput = document.getElementById("maniobraAdvance");
    const maniobraTransportInput = document.getElementById("maniobraTransport");
    const maniobraOperatorPayInput = document.getElementById("maniobraOperatorPay");

    const statusModal = document.getElementById("statusModal");
    const closeStatusModal = document.getElementById("closeStatusModal");
    const cancelStatusEdit = document.getElementById("cancelStatusEdit");
    const statusForm = document.getElementById("statusForm");
    const eventStatusSelect = document.getElementById("eventStatusSelect");
    const statusEventTitle = document.getElementById("statusEventTitle");
    const statusFormMessage = document.getElementById("statusFormMessage");
    let editingStatusEventId = null;

    const lapsoModal = document.getElementById("lapsoModal");
    const closeLapsoModal = document.getElementById("closeLapsoModal");
    const cancelLapsoEdit = document.getElementById("cancelLapsoEdit");
    const lapsoForm = document.getElementById("lapsoForm");
    const lapsoEventTitle = document.getElementById("lapsoEventTitle");
    const editEndDateInput = document.getElementById("editEndDate");
    const editEndTimeInput = document.getElementById("editEndTime");
    const lapsoFormMessage = document.getElementById("lapsoFormMessage");
    let editingLapsoEventId = null;

    // ==========================================
    // ESTADO DEL CALENDARIO
    // ==========================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let selectedDate = new Date(today);
    let cursorDate = new Date(today);
    let currentView = "month";
    let selectedType = "maniobra";
    let events = [];

    const activeCategories = new Set([
        "maniobra", "pago", "cotizacion", "mantenimiento", "personal", "reunion", "otro"
    ]);

    const monthFormatter = new Intl.DateTimeFormat("es-MX", { month: "long" });
    const fullDateFormatter = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });
    const shortDateFormatter = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
    const weekdayFormatter = new Intl.DateTimeFormat("es-MX", { weekday: "short" });
    const weekdayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

    const eventTypes = {
        maniobra: { label: "Maniobra", icon: "bi-cone-striped" },
        pago: { label: "Pago", icon: "bi-currency-dollar" },
        cotizacion: { label: "Cotización", icon: "bi-file-earmark-text" },
        mantenimiento: { label: "Mantenimiento", icon: "bi-wrench-adjustable" },
        personal: { label: "Personal", icon: "bi-people-fill" },
        reunion: { label: "Reuniones y visitas", icon: "bi-people" },
        otro: { label: "Otro evento", icon: "bi-calendar-event" }
    };

    const manualTypes = new Set(["maniobra", "mantenimiento", "personal", "reunion", "otro"]);

    const statusesByType = {
        maniobra: ["Pendiente", "Urgente", "En curso", "Concluida", "Cancelada"],
        mantenimiento: ["Pendiente", "Urgente", "En curso", "Realizado", "Cancelado"],
        reunion: ["Pendiente", "En curso", "Realizada", "Concluida", "Cancelada"],
        personal: ["Próximo", "Pendiente", "En curso", "Realizado", "Cancelado"],
        otro: ["Pendiente", "Urgente", "En curso", "Realizado", "Concluido", "Cancelado"],
        pago: ["Pendiente", "Próximo a vencer", "Vencido", "Pagado"],
        cotizacion: ["Pendiente de envío", "Enviada a tiempo", "Enviada con retraso"]
    };

    function statusClass(status) {
        const value = (status || "Pendiente").toLowerCase();
        if (value.includes("urgente") || value.includes("vencido") || value.includes("retraso")) return "status-danger";
        if (value.includes("curso")) return "status-progress";
        if (value.includes("realizado") || value.includes("concluid") || value.includes("pagado") || value.includes("enviada a tiempo")) return "status-done";
        if (value.includes("cancel")) return "status-cancelled";
        return "status-pending";
    }

    function calcularPlazoTexto(fechaInicio, horaInicio, fechaFin, horaFin) {
        const inicio = new Date(`${fechaInicio}T${horaInicio}`);
        const fin = new Date(`${fechaFin}T${horaFin}`);
        const diffHoras = Math.round((fin - inicio) / (1000 * 60 * 60));
        if (diffHoras <= 0) return "1 hora";
        if (diffHoras < 24) return `${diffHoras} hora${diffHoras === 1 ? "" : "s"}`;
        const dias = Math.ceil(diffHoras / 24);
        return `${dias} día${dias === 1 ? "" : "s"}`;
    }

    // ==========================================
    // CONEXIÓN CON LA API (SQL SERVER)
    // ==========================================

    async function cargarCatalogosModal() {
        try {
            const resEmp = await fetch("/api/Empleados/Catalogo");
            if (resEmp.ok) {
                const empleados = await resEmp.json();
                eventEmployeeSelect.innerHTML = '<option value="">Seleccionar empleado (opcional)</option>';
                empleados.forEach(emp => {
                    const opt = document.createElement("option");
                    opt.value = emp.id;
                    const nombre = emp.nombreCompleto || `${emp.nombre} ${emp.apellidoPaterno}`;
                    const estado = emp.disponibilidad ? ` — ${emp.disponibilidad}` : "";
                    opt.textContent = `${nombre} (${emp.puesto || "Personal"}${estado})`;
                    eventEmployeeSelect.appendChild(opt);
                });
            }
        } catch (error) {
            console.error("No se pudo cargar el catálogo de empleados:", error);
        }

        try {
            const resMaq = await fetch("/api/Maquinaria/Catalogo");
            if (resMaq.ok) {
                const maquinas = await resMaq.json();
                machineryInput.innerHTML = '<option value="">Seleccionar maquinaria (opcional)</option>';
                maquinas.forEach(maq => {
                    const opt = document.createElement("option");
                    opt.value = maq.id;
                    opt.textContent = maq.nombre || `${maq.tipo} ${maq.marca}`;
                    machineryInput.appendChild(opt);
                });
            }
        } catch (error) {
            console.error("No se pudo cargar el catálogo de maquinaria:", error);
        }
    }

    async function cargarEventosDesdeAPI() {
        try {
            const respuesta = await fetch("/api/Calendario/Eventos");
            if (!respuesta.ok) throw new Error("Error al obtener eventos.");
            const data = await respuesta.json();
            events = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error al cargar eventos:", error);
            events = [];
        }
        renderCalendar();
    }

    // ==========================================
    // FUNCIONES DE FECHA
    // ==========================================

    function dateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function parseDate(value) {
        const parts = value.split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    function sameDate(a, b) {
        return dateKey(a) === dateKey(b);
    }

    function addDays(date, amount) {
        const result = new Date(date);
        result.setDate(result.getDate() + amount);
        return result;
    }

    function startOfWeek(date) {
        const result = new Date(date);
        result.setDate(result.getDate() - result.getDay());
        result.setHours(0, 0, 0, 0);
        return result;
    }

    function eventCoversDay(event, dayStr) {
        const start = event.date;
        const end = event.endDate || event.date;
        return dayStr >= start && dayStr <= end;
    }

    function getPeriodDates() {
        if (currentView === "day") return [new Date(selectedDate)];
        if (currentView === "week") {
            const start = startOfWeek(cursorDate);
            return Array.from({ length: 7 }, (_, index) => addDays(start, index));
        }
        const year = cursorDate.getFullYear();
        const month = cursorDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const start = addDays(firstDay, -firstDay.getDay());
        return Array.from({ length: 42 }, (_, index) => addDays(start, index));
    }

    // ==========================================
    // NAVEGACIÓN Y VISTAS
    // ==========================================

    function movePeriod(amount) {
        if (currentView === "month") {
            cursorDate = new Date(cursorDate.getFullYear(), cursorDate.getMonth() + amount, 1);
            selectedDate = new Date(cursorDate);
        } else if (currentView === "week") {
            cursorDate = addDays(cursorDate, amount * 7);
            selectedDate = addDays(selectedDate, amount * 7);
        } else {
            selectedDate = addDays(selectedDate, amount);
            cursorDate = new Date(selectedDate);
        }
        renderCalendar();
    }

    previousPeriod.addEventListener("click", () => movePeriod(-1));
    nextPeriod.addEventListener("click", () => movePeriod(1));
    todayButton.addEventListener("click", () => {
        selectedDate = new Date(today);
        cursorDate = new Date(today);
        renderCalendar();
    });

    document.querySelectorAll(".view-button").forEach(button => {
        button.addEventListener("click", function () {
            currentView = this.dataset.view;
            cursorDate = new Date(selectedDate);
            document.querySelectorAll(".view-button").forEach(item => {
                item.classList.toggle("active", item === this);
            });
            renderCalendar();
        });
    });

    function renderMonth() {
        const year = cursorDate.getFullYear();
        const month = cursorDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const start = addDays(firstDay, -firstDay.getDay());

        const grid = document.createElement("div");
        grid.className = "calendar-grid";

        weekdayNames.forEach((name, index) => {
            const weekday = document.createElement("div");
            weekday.className = "weekday";
            weekday.textContent = name;
            if (index === 0) weekday.style.color = "var(--calendar-gold)";
            grid.appendChild(weekday);
        });

        for (let i = 0; i < 42; i++) {
            const date = addDays(start, i);
            const key = dateKey(date);

            const dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "calendar-day";
            dayButton.setAttribute("aria-label", fullDateFormatter.format(date));

            if (date.getMonth() !== month) dayButton.classList.add("outside-month");
            if (date.getDay() === 0) dayButton.classList.add("sunday");
            if (sameDate(date, today)) dayButton.classList.add("today");
            if (sameDate(date, selectedDate)) dayButton.classList.add("selected");

            const number = document.createElement("span");
            number.textContent = date.getDate();
            dayButton.appendChild(number);

            const dots = document.createElement("span");
            dots.className = "day-event-dots";

            const dayEvents = events.filter(event =>
                eventCoversDay(event, key) && activeCategories.has(event.type)
            );

            [...new Set(dayEvents.map(event => event.type))]
                .slice(0, 4)
                .forEach(type => {
                    const dot = document.createElement("span");
                    dot.className = `event-dot ${type}`;
                    dots.appendChild(dot);
                });

            dayButton.appendChild(dots);

            dayButton.addEventListener("click", function () {
                selectedDate = new Date(date);
                cursorDate = new Date(date);
                renderCalendar();
            });

            grid.appendChild(dayButton);
        }

        calendarContainer.appendChild(grid);
    }

    function renderPeriodView() {
        const wrapper = document.createElement("div");
        wrapper.className = currentView === "week" ? "week-view" : "day-view";

        getPeriodDates().forEach(date => {
            const key = dateKey(date);
            const button = document.createElement("button");
            button.type = "button";
            button.className = "period-day";

            if (sameDate(date, today)) button.classList.add("today");
            if (sameDate(date, selectedDate)) button.classList.add("selected");

            const number = document.createElement("div");
            number.className = "period-day-number";

            const weekday = document.createElement("span");
            weekday.textContent = weekdayFormatter.format(date).replace(".", "");

            const dayNumber = document.createElement("strong");
            dayNumber.textContent = date.getDate();

            number.append(weekday, dayNumber);

            const eventArea = document.createElement("div");
            eventArea.className = "period-day-events";

            const dayEvents = events.filter(event =>
                eventCoversDay(event, key) && activeCategories.has(event.type)
            );

            if (dayEvents.length === 0) {
                const empty = document.createElement("span");
                empty.style.color = "#777";
                empty.style.fontSize = "12px";
                empty.textContent = "Sin eventos";
                eventArea.appendChild(empty);
            } else {
                dayEvents.forEach(event => {
                    const item = document.createElement("div");
                    item.className = `period-event ${event.type}`;

                    const time = document.createElement("strong");
                    time.textContent = `${event.time || ""} - ${event.endTime || ""}`;

                    const title = document.createElement("span");
                    title.textContent = ` · ${event.title}`;

                    item.append(time, title);
                    eventArea.appendChild(item);
                });
            }

            button.append(number, eventArea);
            button.addEventListener("click", function () {
                selectedDate = new Date(date);
                cursorDate = new Date(date);
                renderCalendar();
            });

            wrapper.appendChild(button);
        });

        calendarContainer.appendChild(wrapper);
    }

    function renderCalendar() {
        const titleDate = currentView === "month" ? cursorDate : selectedDate;
        calendarTitle.textContent = monthFormatter.format(titleDate).toUpperCase();
        calendarYear.textContent = titleDate.getFullYear();
        selectedDateLabel.textContent = fullDateFormatter.format(selectedDate);

        calendarContainer.replaceChildren();
        if (currentView === "month") renderMonth();
        else renderPeriodView();

        renderEvents();
    }

    function getVisibleEvents() {
        let start;
        let end;

        if (currentView === "day") {
            start = dateKey(selectedDate);
            end = start;
        } else if (currentView === "week") {
            start = dateKey(startOfWeek(cursorDate));
            end = dateKey(addDays(startOfWeek(cursorDate), 6));
        } else {
            start = dateKey(new Date(cursorDate.getFullYear(), cursorDate.getMonth(), 1));
            end = dateKey(new Date(cursorDate.getFullYear(), cursorDate.getMonth() + 1, 0));
        }

        const selectedKey = dateKey(selectedDate);
        const now = new Date();
        // Si el día seleccionado es hoy, tomamos la hora actual como referencia; si es otro día, tomamos el inicio de ese día
        const refTime = sameDate(selectedDate, today)
            ? now.getTime()
            : new Date(`${selectedKey}T00:00:00`).getTime();

        return events
            .filter(event => {
                const evEnd = event.endDate || event.date;
                return event.date <= end && evEnd >= start && activeCategories.has(event.type);
            })
            .sort((a, b) => {
                // 1. Priorizar eventos que ocurren o abarcan la fecha seleccionada
                const aEnSeleccionado = eventCoversDay(a, selectedKey) ? 0 : 1;
                const bEnSeleccionado = eventCoversDay(b, selectedKey) ? 0 : 1;
                if (aEnSeleccionado !== bEnSeleccionado) {
                    return aEnSeleccionado - bEnSeleccionado;
                }

                // 2. Ordenar del más cercano al más lejano respecto a la fecha/hora de referencia
                const aStart = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
                const bStart = new Date(`${b.date}T${b.time || "00:00"}`).getTime();

                const distA = Math.abs(aStart - refTime);
                const distB = Math.abs(bStart - refTime);

                if (distA !== distB) {
                    return distA - distB;
                }

                // 3. Desempate cronológico directo
                return aStart - bStart;
            });
    }

    function renderEvents() {
        const visibleEvents = getVisibleEvents();
        eventsList.replaceChildren();
        eventCount.textContent = visibleEvents.length;

        if (currentView === "day") {
            eventsDateHeading.textContent = fullDateFormatter.format(selectedDate);
        } else if (currentView === "week") {
            eventsDateHeading.textContent =
                `${shortDateFormatter.format(startOfWeek(cursorDate))} – ${shortDateFormatter.format(addDays(startOfWeek(cursorDate), 6))}`;
        } else {
            eventsDateHeading.textContent = `${monthFormatter.format(cursorDate)} ${cursorDate.getFullYear()}`;
        }

        if (visibleEvents.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-events";
            empty.innerHTML = '<i class="bi bi-calendar2-x"></i><p>No hay eventos registrados en este periodo.</p>';
            eventsList.appendChild(empty);
            return;
        }

        visibleEvents.forEach(event => {
            const card = document.createElement("article");
            card.className = "event-card";

            const icon = document.createElement("div");
            icon.className = `event-card-icon ${event.type}`;
            icon.innerHTML = `<i class="bi ${eventTypes[event.type].icon}"></i>`;

            const info = document.createElement("div");
            info.className = "event-card-info";

            const title = document.createElement("h3");
            title.textContent = event.title;

            const sameDay = !event.endDate || event.date === event.endDate;
            const dateText = sameDay
                ? `${fullDateFormatter.format(parseDate(event.date))} · ${event.time} a ${event.endTime || event.time}`
                : `Del ${shortDateFormatter.format(parseDate(event.date))} (${event.time}) al ${shortDateFormatter.format(parseDate(event.endDate))} (${event.endTime})`;

            const date = document.createElement("p");
            date.textContent = dateText;
            info.append(title, date);

            const statusBadge = document.createElement("span");
            statusBadge.className = `event-status ${statusClass(event.status)}`;
            statusBadge.textContent = event.status || "Pendiente";
            info.appendChild(statusBadge);

            if (event.plazo) {
                const plazoP = document.createElement("p");
                plazoP.textContent = `Duración estimada: ${event.plazo}`;
                info.appendChild(plazoP);
            }

            if (event.subtype) {
                const subtype = document.createElement("p");
                subtype.textContent = event.type === "otro" ? `Tipo: ${event.subtype}` : event.subtype;
                info.appendChild(subtype);
            }

            if (event.machinery) {
                const machinery = document.createElement("p");
                machinery.textContent = `Maquinaria: ${event.machinery}`;
                info.appendChild(machinery);
            }

            if (event.place) {
                const place = document.createElement("p");
                place.textContent = `Lugar: ${event.place}`;
                info.appendChild(place);
            }

            if (event.type === "maniobra" && event.financials) {
                const money = value => new Intl.NumberFormat("es-MX", {
                    style: "currency", currency: "MXN", maximumFractionDigits: 2
                }).format(Number(value) || 0);
                const financialDetails = document.createElement("p");
                financialDetails.className = "event-card-financials";
                financialDetails.textContent = `Cobro: ${money(event.financials.totalToCharge)} · Anticipo: ${money(event.financials.advanceReceived)} · Por cobrar: ${money(event.financials.remainingToCollect)} · Traslado: ${money(event.financials.transportBudget)} · Operador: ${money(event.financials.operatorPayment)}`;
                info.appendChild(financialDetails);
            }

            if (event.contact) {
                const contact = document.createElement("p");
                contact.textContent = `Contacto: ${event.contact}`;
                info.appendChild(contact);
            }

            if (event.employee) {
                const employee = document.createElement("p");
                employee.textContent = `Responsable: ${event.employee}`;
                info.appendChild(employee);
            }

            if (event.description) {
                const description = document.createElement("p");
                description.className = "event-card-description";
                description.textContent = event.description;
                info.appendChild(description);
            }

            const actions = document.createElement("div");
            actions.className = "event-card-actions";

            if (manualTypes.has(event.type)) {
                // Botón editar lapso de trabajo
                const lapsoBtn = document.createElement("button");
                lapsoBtn.type = "button";
                lapsoBtn.className = "edit-event-status";
                lapsoBtn.title = "Editar lapso de trabajo";
                lapsoBtn.setAttribute("aria-label", "Editar lapso de trabajo");
                lapsoBtn.innerHTML = '<i class="bi bi-clock-history"></i>';
                lapsoBtn.addEventListener("click", () => openLapsoModal(event));
                actions.appendChild(lapsoBtn);

                // Botón editar estatus
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "edit-event-status";
                editButton.title = "Editar estatus";
                editButton.setAttribute("aria-label", "Editar estatus del evento");
                editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
                editButton.addEventListener("click", () => openStatusModal(event));
                actions.appendChild(editButton);
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-event";
            deleteButton.title = "Eliminar evento";
            deleteButton.setAttribute("aria-label", "Eliminar evento");
            deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
            actions.appendChild(deleteButton);

            deleteButton.addEventListener("click", async function () {
                const confirmed = window.confirm(`¿Deseas eliminar el evento "${event.title}"?`);
                if (!confirmed) return;

                try {
                    const res = await fetch(`/api/Calendario/${event.type}/${event.idNumerico}`, { method: "DELETE" });
                    if (!res.ok) {
                        const err = await res.json();
                        alert(err.mensaje || "No se pudo eliminar el evento.");
                        return;
                    }
                    await cargarCatalogosModal();
                    await cargarEventosDesdeAPI();
                } catch (error) {
                    console.error("Error al eliminar evento:", error);
                    alert("Error de conexión al eliminar el evento.");
                }
            });

            card.append(icon, info, actions);
            eventsList.appendChild(card);
        });
    }

    // ==========================================
    // MODAL DE EDITAR LAPSO DE TRABAJO
    // ==========================================

    function openLapsoModal(event) {
        editingLapsoEventId = event.id;
        lapsoEventTitle.textContent = `${event.title} (Inicia: ${event.date} ${event.time})`;
        lapsoFormMessage.textContent = "";
        editEndDateInput.value = event.endDate || event.date;
        editEndTimeInput.value = event.endTime || "18:00";
        lapsoModal.classList.add("open");
        lapsoModal.setAttribute("aria-hidden", "false");
    }

    function closeLapsoModalWindow() {
        lapsoModal.classList.remove("open");
        lapsoModal.setAttribute("aria-hidden", "true");
        editingLapsoEventId = null;
        lapsoFormMessage.textContent = "";
    }

    closeLapsoModal.addEventListener("click", closeLapsoModalWindow);
    cancelLapsoEdit.addEventListener("click", closeLapsoModalWindow);
    lapsoModal.addEventListener("click", e => { if (e.target === lapsoModal) closeLapsoModalWindow(); });

    lapsoForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const target = events.find(item => item.id === editingLapsoEventId);
        if (!target) return;

        const nuevaFechaFin = editEndDateInput.value;
        const nuevaHoraFin = editEndTimeInput.value;
        const plazoActualizado = calcularPlazoTexto(target.date, target.time, nuevaFechaFin, nuevaHoraFin);

        try {
            const res = await fetch("/api/Calendario/Lapso", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: target.type,
                    idNumerico: target.idNumerico,
                    endDate: nuevaFechaFin,
                    endTime: nuevaHoraFin,
                    plazo: plazoActualizado
                })
            });

            const data = await res.json();
            if (!res.ok) {
                lapsoFormMessage.textContent = data.mensaje || "No se pudo actualizar el lapso.";
                return;
            }

            closeLapsoModalWindow();
            await cargarCatalogosModal();
            await cargarEventosDesdeAPI();
        } catch (error) {
            console.error("Error al actualizar lapso:", error);
            lapsoFormMessage.textContent = "Error de conexión con el servidor.";
        }
    });

    // ==========================================
    // MODAL DE ESTATUS
    // ==========================================

    function openStatusModal(event) {
        if (!manualTypes.has(event.type)) return;
        editingStatusEventId = event.id;
        statusEventTitle.textContent = event.title;
        statusFormMessage.textContent = "";
        eventStatusSelect.replaceChildren();

        (statusesByType[event.type] || statusesByType.otro).forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            eventStatusSelect.appendChild(option);
        });
        eventStatusSelect.value = event.status || "Pendiente";
        statusModal.classList.add("open");
        statusModal.setAttribute("aria-hidden", "false");
    }

    function closeStatusModalWindow() {
        statusModal.classList.remove("open");
        statusModal.setAttribute("aria-hidden", "true");
        editingStatusEventId = null;
        statusFormMessage.textContent = "";
    }

    closeStatusModal.addEventListener("click", closeStatusModalWindow);
    cancelStatusEdit.addEventListener("click", closeStatusModalWindow);
    statusModal.addEventListener("click", e => { if (e.target === statusModal) closeStatusModalWindow(); });

    statusForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const target = events.find(item => item.id === editingStatusEventId);
        if (!target) return;

        try {
            const res = await fetch("/api/Calendario/Estatus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: target.type,
                    idNumerico: target.idNumerico,
                    status: eventStatusSelect.value
                })
            });

            const data = await res.json();
            if (!res.ok) {
                statusFormMessage.textContent = data.mensaje || "No se pudo actualizar el estatus.";
                return;
            }

            closeStatusModalWindow();
            await cargarCatalogosModal();
            await cargarEventosDesdeAPI();
        } catch (error) {
            console.error("Error al actualizar estatus:", error);
            statusFormMessage.textContent = "Error de conexión con el servidor.";
        }
    });

    // ==========================================
    // FILTROS Y MODAL DE ALTA
    // ==========================================

    document.querySelectorAll(".category-filter").forEach(button => {
        button.addEventListener("click", function () {
            const category = this.dataset.category;
            if (activeCategories.has(category)) {
                activeCategories.delete(category);
                this.classList.remove("active");
            } else {
                activeCategories.add(category);
                this.classList.add("active");
            }
            renderCalendar();
        });
    });

    function updateConditionalFields() {
        const isOther = selectedType === "otro";
        const isPersonal = selectedType === "personal";
        const isMaintenance = selectedType === "mantenimiento";
        const isMeeting = selectedType === "reunion";
        const isManiobra = selectedType === "maniobra";

        maniobraFinancialsField.hidden = !isManiobra;
        maniobraTotalInput.required = isManiobra;
        maniobraAdvanceInput.required = isManiobra;
        maniobraTransportInput.required = isManiobra;
        maniobraOperatorPayInput.required = isManiobra;

        otherEventField.hidden = !isOther;
        otherEventTypeInput.required = isOther;

        personalEventField.hidden = !isPersonal;
        personalEventTypeInput.required = isPersonal;

        maintenanceField.hidden = !isMaintenance;
        maintenanceTypeInput.required = isMaintenance;

        machineryField.hidden = !(isMaintenance || isManiobra);
        meetingDetailsField.hidden = !isMeeting;
    }

    function openEventModal() {
        eventForm.reset();
        formMessage.textContent = "";

        selectedType = "maniobra";
        eventTypeInput.value = selectedType;
        const fechaBase = dateKey(selectedDate);
        eventDateInput.value = fechaBase;
        eventEndDateInput.value = fechaBase;
        eventTimeInput.value = "08:00";
        eventEndTimeInput.value = "17:00";
        updateConditionalFields();

        document.querySelectorAll(".event-type-option").forEach(button => {
            button.classList.toggle("selected", button.dataset.type === selectedType);
        });

        eventModal.classList.add("open");
        eventModal.setAttribute("aria-hidden", "false");
        eventTitleInput.focus();
    }

    function closeEventModal() {
        eventModal.classList.remove("open");
        eventModal.setAttribute("aria-hidden", "true");
        formMessage.textContent = "";
    }

    eventDateInput.addEventListener("change", () => {
        if (!eventEndDateInput.value || eventEndDateInput.value < eventDateInput.value) {
            eventEndDateInput.value = eventDateInput.value;
        }
    });

    addEventButton.addEventListener("click", openEventModal);
    closeModal.addEventListener("click", closeEventModal);
    cancelEvent.addEventListener("click", closeEventModal);
    eventModal.addEventListener("click", e => { if (e.target === eventModal) closeEventModal(); });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (eventModal.classList.contains("open")) closeEventModal();
            if (statusModal.classList.contains("open")) closeStatusModalWindow();
            if (lapsoModal.classList.contains("open")) closeLapsoModalWindow();
        }
    });

    document.querySelectorAll(".event-type-option").forEach(button => {
        button.addEventListener("click", function () {
            selectedType = this.dataset.type;
            eventTypeInput.value = selectedType;
            updateConditionalFields();
            document.querySelectorAll(".event-type-option").forEach(option => {
                option.classList.toggle("selected", option === this);
            });
        });
    });

    eventForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = eventTitleInput.value.trim();
        const date = eventDateInput.value;
        const time = eventTimeInput.value;
        const endDate = eventEndDateInput.value;
        const endTime = eventEndTimeInput.value;

        if (!title || !date || !time || !endDate || !endTime) {
            formMessage.textContent = "Completa el título y el lapso completo (fecha y hora de inicio y término).";
            return;
        }

        if (new Date(`${endDate}T${endTime}`) <= new Date(`${date}T${time}`)) {
            formMessage.textContent = "La fecha y hora de término deben ser posteriores al inicio.";
            eventEndTimeInput.focus();
            return;
        }

        if (selectedType === "maniobra") {
            const financialInputs = [maniobraTotalInput, maniobraAdvanceInput, maniobraTransportInput, maniobraOperatorPayInput];
            const invalidAmount = financialInputs.find(input =>
                input.value === "" || !Number.isFinite(Number(input.value)) || Number(input.value) < 0
            );
            if (invalidAmount) {
                formMessage.textContent = "Completa los cuatro importes de la maniobra con cantidades iguales o mayores a cero.";
                invalidAmount.focus();
                return;
            }
            if (Number(maniobraAdvanceInput.value) > Number(maniobraTotalInput.value)) {
                formMessage.textContent = "El anticipo recibido no puede ser mayor que el importe total a cobrar.";
                maniobraAdvanceInput.focus();
                return;
            }
        }

        if (selectedType === "otro" && !otherEventTypeInput.value.trim()) {
            formMessage.textContent = "Especifica cuál es el evento.";
            otherEventTypeInput.focus();
            return;
        }
        if (selectedType === "personal" && !personalEventTypeInput.value) {
            formMessage.textContent = "Selecciona el tipo de evento de personal.";
            personalEventTypeInput.focus();
            return;
        }
        if (selectedType === "mantenimiento" && !maintenanceTypeInput.value) {
            formMessage.textContent = "Selecciona el tipo de mantenimiento.";
            maintenanceTypeInput.focus();
            return;
        }

        const idEmpleadoVal = eventEmployeeSelect.value;
        const idMaquinaVal = machineryInput.value;
        const plazoCalculado = calcularPlazoTexto(date, time, endDate, endTime);

        const payload = {
            type: selectedType,
            subtype: selectedType === "otro" ? otherEventTypeInput.value.trim()
                : selectedType === "personal" ? personalEventTypeInput.value
                    : selectedType === "mantenimiento" ? maintenanceTypeInput.value
                        : null,
            title: title,
            date: date,
            time: time,
            endDate: endDate,
            endTime: endTime,
            plazo: plazoCalculado,
            description: eventDescriptionInput.value.trim(),
            idEmpleado: idEmpleadoVal ? Number(idEmpleadoVal) : null,
            idMaquina: (!machineryField.hidden && idMaquinaVal) ? Number(idMaquinaVal) : null,
            place: selectedType === "reunion" ? meetingPlaceInput.value.trim() : null,
            contact: selectedType === "reunion" ? meetingContactInput.value.trim() : null,
            financials: selectedType === "maniobra" ? {
                totalToCharge: Number(maniobraTotalInput.value),
                advanceReceived: Number(maniobraAdvanceInput.value),
                transportBudget: Number(maniobraTransportInput.value),
                operatorPayment: Number(maniobraOperatorPayInput.value)
            } : null
        };

        try {
            const res = await fetch("/api/Calendario/Registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) {
                formMessage.textContent = data.mensaje || "No se pudo guardar el evento.";
                return;
            }

            selectedDate = parseDate(date);
            cursorDate = new Date(selectedDate);
            currentView = "month";

            document.querySelectorAll(".view-button").forEach(button => {
                button.classList.toggle("active", button.dataset.view === "month");
            });

            activeCategories.add(selectedType);
            document.querySelectorAll(".category-filter").forEach(button => {
                if (button.dataset.category === selectedType) button.classList.add("active");
            });

            eventForm.reset();
            closeEventModal();
            await cargarCatalogosModal();
            await cargarEventosDesdeAPI();
        } catch (error) {
            console.error("Error al registrar evento:", error);
            formMessage.textContent = "Error de conexión al guardar el evento.";
        }
    });

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    cargarCatalogosModal();
    cargarEventosDesdeAPI();

});