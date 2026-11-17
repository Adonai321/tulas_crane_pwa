
"use strict";

document.addEventListener("DOMContentLoaded", function() {

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
    const eventDescriptionInput = document.getElementById("eventDescription");

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

    // ==========================================
    // ESTADO DEL CALENDARIO
    // ==========================================

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let selectedDate = new Date(today);
    let cursorDate = new Date(today);
    let currentView = "month";
    let selectedType = "maniobra";

    const activeCategories = new Set([
        "maniobra",
        "pago",
        "cotizacion",
        "mantenimiento",
        "personal",
        "reunion",
        "otro"
    ]);

    const monthFormatter = new Intl.DateTimeFormat("es-MX", {
        month: "long"
    });

const fullDateFormatter = new Intl.DateTimeFormat("es-MX", {

    day: "numeric",
    month: "long",
    year: "numeric"
    });

const shortDateFormatter = new Intl.DateTimeFormat("es-MX", {

    day: "numeric",
    month: "short"
    });

const weekdayFormatter = new Intl.DateTimeFormat("es-MX", {

    weekday: "short"
    });

const weekdayNames = [
    "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"
];

const eventTypes = {
        maniobra: { label: "Maniobra", icon: "bi-cone-striped" },
        pago: { label: "Pago", icon: "bi-currency-dollar" },
        cotizacion: { label: "Cotización", icon: "bi-file-earmark-text" },
        mantenimiento: { label: "Mantenimiento", icon: "bi-wrench-adjustable" },
        personal: { label: "Personal", icon: "bi-people-fill" },
        reunion: { label: "Reuniones y visitas", icon: "bi-people" },
        otro: { label: "Otro evento", icon: "bi-calendar-event" }
    };

// Solo estas categorías se pueden crear manualmente desde el calendario.
// Pagos y cotizaciones se integrarán automáticamente desde sus módulos.
const manualTypes = new Set([
    "maniobra", "mantenimiento", "personal", "reunion", "otro"
]);

const statusesByType = {
        maniobra: ["Pendiente", "Urgente", "En curso", "Concluida", "Cancelada"],
        mantenimiento: ["Pendiente", "Urgente", "En curso", "Realizado", "Cancelado"],
        reunion: ["Pendiente", "En curso", "Realizada", "Concluida", "Cancelada"],
        personal: ["Próximo", "Pendiente", "En curso", "Realizado", "Cancelado"],
        otro: ["Pendiente", "Urgente", "En curso", "Realizado", "Concluido", "Cancelado"],
        pago: ["Pendiente", "Próximo a vencer", "Vencido", "Pagado"],
        cotizacion: ["Pendiente de envío", "Enviada a tiempo", "Enviada con retraso"]
    };

function statusClass(status)
{
    const value = (status || "Pendiente").toLowerCase();
    if (value.includes("urgente") || value.includes("vencido") || value.includes("retraso")) return "status-danger";
    if (value.includes("curso")) return "status-progress";
    if (value.includes("realizado") || value.includes("concluid") || value.includes("pagado") || value.includes("enviada a tiempo")) return "status-done";
    if (value.includes("cancel")) return "status-cancelled";
    return "status-pending";
}

// ==========================================
// ALMACENAMIENTO DE DEMOSTRACIÓN
// ==========================================

const STORAGE_KEY = "tulasCraneCalendarEvents";

function loadEvents()
{
    try
    {
        const data = localStorage.getItem(STORAGE_KEY);
        const parsed = data ? JSON.parse(data) : [];

        if (!Array.isArray(parsed))
        {
            return [];
        }

        return parsed.filter(event =>
                event &&
            typeof event.id === "string" &&
            typeof event.title === "string" &&
            typeof event.date === "string" &&
            eventTypes[event.type]
        ).map(event => ({
            ...event,
                status: event.status || (event.type === "maniobra" ? "Pendiente" : "Pendiente")
            }));
    }
    catch (error)
    {
        console.error("No se pudieron cargar los eventos:", error);
        return [];
    }
}

let events = loadEvents();

function saveEvents()
{
    try
    {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        return true;
    }
    catch (error)
    {
        console.error("No se pudieron guardar los eventos:", error);
        return false;
    }
}

// ==========================================
// FUNCIONES DE FECHA
// ==========================================

function dateKey(date)
{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${ year}
    -${ month}
    -${ day}`;
}

function parseDate(value)
{
    const parts = value.split("-").map(Number);

    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );
}

function sameDate(a, b)
{
    return dateKey(a) === dateKey(b);
}

function addDays(date, amount)
{
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
}

function startOfWeek(date)
{
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay());
    result.setHours(0, 0, 0, 0);
    return result;
}

function getPeriodDates()
{
    if (currentView === "day")
    {
        return [new Date(selectedDate)];
    }

    if (currentView === "week")
    {
        const start = startOfWeek(cursorDate);

        return Array.from(
                { length: 7 },
                (_, index) => addDays(start, index)
            );
    }

    const year = cursorDate.getFullYear();
    const month = cursorDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const start = addDays(firstDay, -firstDay.getDay());

    return Array.from(
            { length: 42 },
            (_, index) => addDays(start, index)
        );
}

// ==========================================
// NAVEGACIÓN ENTRE PERIODOS
// ==========================================

function movePeriod(amount)
{
    if (currentView === "month")
    {
        cursorDate = new Date(
            cursorDate.getFullYear(),
            cursorDate.getMonth() + amount,
            1
        );

        selectedDate = new Date(cursorDate);
    }
    else if (currentView === "week")
    {
        cursorDate = addDays(cursorDate, amount * 7);
        selectedDate = addDays(selectedDate, amount * 7);
    }
    else
    {
        selectedDate = addDays(selectedDate, amount);
        cursorDate = new Date(selectedDate);
    }

    renderCalendar();
}

previousPeriod.addEventListener("click", function() {
    movePeriod(-1);
});

nextPeriod.addEventListener("click", function() {
    movePeriod(1);
});

todayButton.addEventListener("click", function() {
    selectedDate = new Date(today);
    cursorDate = new Date(today);
    renderCalendar();
});

// ==========================================
// CAMBIAR VISTA
// ==========================================

document.querySelectorAll(".view-button").forEach(button => {
button.addEventListener("click", function() {
    currentView = this.dataset.view;

    cursorDate = new Date(selectedDate);

    document.querySelectorAll(".view-button").forEach(item => {
        item.classList.toggle("active", item === this);
    });

    renderCalendar();
});
    });

// ==========================================
// GENERAR CALENDARIO MENSUAL
// ==========================================

function renderMonth()
{
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

        if (index === 0)
        {
            weekday.style.color = "var(--calendar-gold)";
        }

        grid.appendChild(weekday);
    });

    for (let i = 0; i < 42; i++)
    {
        const date = addDays(start, i);
        const key = dateKey(date);

        const dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.className = "calendar-day";
        dayButton.setAttribute(
            "aria-label",
            fullDateFormatter.format(date)
        );

        if (date.getMonth() !== month)
        {
            dayButton.classList.add("outside-month");
        }

        if (date.getDay() === 0)
        {
            dayButton.classList.add("sunday");
        }

        if (sameDate(date, today))
        {
            dayButton.classList.add("today");
        }

        if (sameDate(date, selectedDate))
        {
            dayButton.classList.add("selected");
        }

        const number = document.createElement("span");
        number.textContent = date.getDate();
        dayButton.appendChild(number);

        const dots = document.createElement("span");
        dots.className = "day-event-dots";

        const dayEvents = events.filter(event =>
                event.date === key &&
            activeCategories.has(event.type)
        );

        [...new Set(dayEvents.map(event => event.type))]
                .slice(0, 4)
                .forEach(type => {
                    const dot = document.createElement("span");
                    dot.className = `event-dot ${ type}`;
                    dots.appendChild(dot);
                });

        dayButton.appendChild(dots);

        dayButton.addEventListener("click", function() {
            selectedDate = new Date(date);
            cursorDate = new Date(date);
            renderCalendar();
        });

    grid.appendChild(dayButton);
}

calendarContainer.appendChild(grid);
    }

    // ==========================================
    // GENERAR VISTA SEMANAL Y DIARIA
    // ==========================================

    function renderPeriodView()
{
    const wrapper = document.createElement("div");

    wrapper.className =
        currentView === "week" ? "week-view" : "day-view";

    getPeriodDates().forEach(date => {
    const key = dateKey(date);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "period-day";

    if (sameDate(date, today))
    {
        button.classList.add("today");
    }

    if (sameDate(date, selectedDate))
    {
        button.classList.add("selected");
    }

    const number = document.createElement("div");
    number.className = "period-day-number";

    const weekday = document.createElement("span");
    weekday.textContent = weekdayFormatter
        .format(date)
        .replace(".", "");

    const dayNumber = document.createElement("strong");
    dayNumber.textContent = date.getDate();

    number.append(weekday, dayNumber);

    const eventArea = document.createElement("div");
    eventArea.className = "period-day-events";

    const dayEvents = events.filter(event =>
                event.date === key &&
        activeCategories.has(event.type)
    );

    if (dayEvents.length === 0)
    {
        const empty = document.createElement("span");
        empty.style.color = "#777";
        empty.style.fontSize = "12px";
        empty.textContent = "Sin eventos";
        eventArea.appendChild(empty);
    }
    else
    {
        dayEvents.forEach(event => {
            const item = document.createElement("div");
            item.className = `period -event ${event.type}`;

            const time = document.createElement("strong");
            time.textContent = event.time || "Sin hora";

            const title = document.createElement("span");
            title.textContent = ` · ${event.title}`;

            item.append(time, title);
            eventArea.appendChild(item);
        });
}

button.append(number, eventArea);

button.addEventListener("click", function() {
    selectedDate = new Date(date);
    cursorDate = new Date(date);
    renderCalendar();
});

wrapper.appendChild(button);
        });

calendarContainer.appendChild(wrapper);
    }

    // ==========================================
    // ENCABEZADO Y RENDERIZADO GENERAL
    // ==========================================

    function renderCalendar()
{
    const titleDate =
        currentView === "month" ? cursorDate : selectedDate;

    calendarTitle.textContent =
        monthFormatter.format(titleDate).toUpperCase();

    calendarYear.textContent = titleDate.getFullYear();

    selectedDateLabel.textContent =
        fullDateFormatter.format(selectedDate);

    calendarContainer.replaceChildren();

    if (currentView === "month")
    {
        renderMonth();
    }
    else
    {
        renderPeriodView();
    }

    renderEvents();
}

// ==========================================
// FILTRAR EVENTOS POR PERIODO
// ==========================================

function getVisibleEvents()
{
    let start;
    let end;

    if (currentView === "day")
    {
        start = dateKey(selectedDate);
        end = start;
    }
    else if (currentView === "week")
    {
        start = dateKey(startOfWeek(cursorDate));
        end = dateKey(addDays(startOfWeek(cursorDate), 6));
    }
    else
    {
        start = dateKey(
            new Date(
                cursorDate.getFullYear(),
                cursorDate.getMonth(),
                1
            )
        );

        end = dateKey(
            new Date(
                cursorDate.getFullYear(),
                cursorDate.getMonth() + 1,
                0
            )
        );
    }

    return events
        .filter(event =>
                event.date >= start &&
                event.date <= end &&
            activeCategories.has(event.type)
        )
        .sort((a, b) =>
            a.date.localeCompare(b.date) ||
            (a.time || "").localeCompare(b.time || "")
        );
}

// ==========================================
// MOSTRAR EVENTOS EN EL PANEL
// ==========================================

function renderEvents()
{
    const visibleEvents = getVisibleEvents();

    eventsList.replaceChildren();
    eventCount.textContent = visibleEvents.length;

    if (currentView === "day")
    {
        eventsDateHeading.textContent =
            fullDateFormatter.format(selectedDate);
    }
    else if (currentView === "week")
    {
        eventsDateHeading.textContent =
                `${ shortDateFormatter.format(startOfWeek(cursorDate))} – ` +
                `${ shortDateFormatter.format(addDays(startOfWeek(cursorDate), 6))}`;
    }
    else
    {
        eventsDateHeading.textContent =
                `${ monthFormatter.format(cursorDate)} ${ cursorDate.getFullYear()}`;
    }

    if (visibleEvents.length === 0)
    {
        const empty = document.createElement("div");
        empty.className = "empty-events";

        const icon = document.createElement("i");
        icon.className = "bi bi-calendar2-x";

        const text = document.createElement("p");
        text.textContent = "No hay eventos registrados en este periodo.";

        empty.append(icon, text);
        eventsList.appendChild(empty);
        return;
    }

    visibleEvents.forEach(event => {
        const card = document.createElement("article");
        card.className = "event-card";

        const icon = document.createElement("div");
        icon.className = `event-card - icon ${event.type}`;

        const iconElement = document.createElement("i");
        iconElement.className = `bi ${ eventTypes[event.type].icon}`;
        icon.appendChild(iconElement);

        const info = document.createElement("div");
        info.className = "event-card-info";

        const title = document.createElement("h3");
        title.textContent = event.title;

        const date = document.createElement("p");
        date.textContent =
                `${ fullDateFormatter.format(parseDate(event.date))} · ` +
                `${event.time || "Sin hora"}`;

        info.append(title, date);

        const statusBadge = document.createElement("span");
        statusBadge.className = `event-status ${ statusClass(event.status)}`;
        statusBadge.textContent = event.status || "Pendiente";
        info.appendChild(statusBadge);

        if (event.subtype) {
            const subtype = document.createElement("p");
            subtype.textContent = event.type === "otro"
                ? `Tipo: ${event.subtype}`
                    : event.subtype;
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
financialDetails.textContent = `Cobro: ${ money(event.financials.totalToCharge)} · Anticipo: ${ money(event.financials.advanceReceived)} · Por cobrar: ${ money(event.financials.remainingToCollect)} · Traslado: ${ money(event.financials.transportBudget)} · Operador: ${ money(event.financials.operatorPayment)}`;
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

            const canEditStatus = manualTypes.has(event.type);
            if (canEditStatus) {
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-event-status";
    editButton.setAttribute("aria-label", "Editar estatus del evento");
    editButton.title = "Editar estatus";
    const editIcon = document.createElement("i");
    editIcon.className = "bi bi-pencil-square";
    editButton.appendChild(editIcon);
    editButton.addEventListener("click", () => openStatusModal(event));
    actions.appendChild(editButton);
}

            const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.className = "delete-event";
deleteButton.setAttribute("aria-label", "Eliminar evento");
deleteButton.title = "Eliminar evento";

            const deleteIcon = document.createElement("i");
deleteIcon.className = "bi bi-trash3";
deleteButton.appendChild(deleteIcon);
actions.appendChild(deleteButton);

deleteButton.addEventListener("click", function () {
    const confirmed = window.confirm(
                    `¿Deseas eliminar el evento "${event.title}" ?`
                );

    if (!confirmed) return;

    const previousEvents = events;
    events = events.filter(item => item.id !== event.id);

    if (!saveEvents())
    {
        events = previousEvents;
        alert("No se pudo guardar el cambio.");
        return;
    }

    renderCalendar();
});

card.append(icon, info, actions);
eventsList.appendChild(card);
});
    }

    // ==========================================
    // ACTUALIZAR ÚNICAMENTE EL ESTATUS DEL EVENTO
    // ==========================================

    function openStatusModal(event)
{
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

function closeStatusModalWindow()
{
    statusModal.classList.remove("open");
    statusModal.setAttribute("aria-hidden", "true");
    editingStatusEventId = null;
    statusFormMessage.textContent = "";
}

closeStatusModal.addEventListener("click", closeStatusModalWindow);
cancelStatusEdit.addEventListener("click", closeStatusModalWindow);
statusModal.addEventListener("click", event => {
    if (event.target === statusModal) closeStatusModalWindow();
});

statusForm.addEventListener("submit", function(event) {
        event.preventDefault();
    const target = events.find(item => item.id === editingStatusEventId);
    if (!target)
    {
        statusFormMessage.textContent = "No se encontró el evento seleccionado.";
        return;
    }

    const previousStatus = target.status;
    target.status = eventStatusSelect.value;
    if (!saveEvents())
    {
        target.status = previousStatus;
        statusFormMessage.textContent = "No se pudo guardar el estatus. Inténtalo nuevamente.";
        return;
    }

    closeStatusModalWindow();
    renderCalendar();
});

// ==========================================
// FILTROS POR CATEGORÍA
// ==========================================

document.querySelectorAll(".category-filter").forEach(button => {
button.addEventListener("click", function() {
    const category = this.dataset.category;

    if (activeCategories.has(category))
    {
        activeCategories.delete(category);
        this.classList.remove("active");
    }
    else
    {
        activeCategories.add(category);
        this.classList.add("active");
    }

    renderCalendar();
});
    });

// ==========================================
// ABRIR Y CERRAR FORMULARIO
// ==========================================

function updateConditionalFields()
{
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

    machineryField.hidden = !isMaintenance;
    meetingDetailsField.hidden = !isMeeting;
}

function openEventModal()
{
    eventForm.reset();
    formMessage.textContent = "";

    selectedType = "maniobra";
    eventTypeInput.value = selectedType;
    eventDateInput.value = dateKey(selectedDate);
    updateConditionalFields();

    document.querySelectorAll(".event-type-option").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.type === selectedType
        );
    });

    eventModal.classList.add("open");
    eventModal.setAttribute("aria-hidden", "false");

    eventTitleInput.focus();
}

function closeEventModal()
{
    eventModal.classList.remove("open");
    eventModal.setAttribute("aria-hidden", "true");
    formMessage.textContent = "";
}

addEventButton.addEventListener("click", openEventModal);
closeModal.addEventListener("click", closeEventModal);
cancelEvent.addEventListener("click", closeEventModal);

eventModal.addEventListener("click", function(event) {
    if (event.target === eventModal) {
        closeEventModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && eventModal.classList.contains("open")) {
        closeEventModal();
    }
    if (event.key === "Escape" && statusModal.classList.contains("open")) {
        closeStatusModalWindow();
    }
});

// ==========================================
// SELECCIONAR TIPO DE EVENTO
// ==========================================

document.querySelectorAll(".event-type-option").forEach(button => {
button.addEventListener("click", function() {
    selectedType = this.dataset.type;
    eventTypeInput.value = selectedType;
    updateConditionalFields();

    document.querySelectorAll(".event-type-option").forEach(option => {
        option.classList.toggle("selected", option === this);
    });
});
    });

// ==========================================
// REGISTRAR EVENTO
// ==========================================

eventForm.addEventListener("submit", function(event) {
        event.preventDefault();

    const title = eventTitleInput.value.trim();
    const date = eventDateInput.value;
    const time = eventTimeInput.value;

    if (!title || !date || !time)
    {
        formMessage.textContent = "Completa el título, la fecha y la hora.";
        return;
    }

    if (!manualTypes.has(selectedType))
    {
        formMessage.textContent =
            "Los pagos y las cotizaciones se registran desde sus módulos correspondientes.";
        return;
    }

    if (selectedType === "maniobra")
    {
        const financialInputs = [
            maniobraTotalInput,
                maniobraAdvanceInput,
                maniobraTransportInput,
                maniobraOperatorPayInput
        ];
        const invalidAmount = financialInputs.find(input =>
            input.value === "" || !Number.isFinite(Number(input.value)) || Number(input.value) < 0
        );

        if (invalidAmount)
        {
            formMessage.textContent = "Completa los cuatro importes de la maniobra con cantidades iguales o mayores a cero.";
            invalidAmount.focus();
            return;
        }

        if (Number(maniobraAdvanceInput.value) > Number(maniobraTotalInput.value))
        {
            formMessage.textContent = "El anticipo recibido no puede ser mayor que el importe total a cobrar.";
            maniobraAdvanceInput.focus();
            return;
        }
    }

    if (selectedType === "otro" && !otherEventTypeInput.value.trim())
    {
        formMessage.textContent = "Especifica cuál es el evento.";
        otherEventTypeInput.focus();
        return;
    }

    if (selectedType === "personal" && !personalEventTypeInput.value)
    {
        formMessage.textContent = "Selecciona el tipo de evento de personal.";
        personalEventTypeInput.focus();
        return;
    }

    if (selectedType === "mantenimiento" && !maintenanceTypeInput.value)
    {
        formMessage.textContent = "Selecciona el tipo de mantenimiento.";
        maintenanceTypeInput.focus();
        return;
    }

    const newEvent = {
            id: (
                window.crypto &&
                typeof window.crypto.randomUUID === "function"
            )
                ? window.crypto.randomUUID()
                : `${ Date.now()}
    -${ Math.random().toString(36).slice(2)}`,

            type: selectedType,
            title: title,
            date: date,
            time: time,
            description: eventDescriptionInput.value.trim(),
            employee: document.getElementById("eventEmployee").value,
            subtype: selectedType === "otro" ? otherEventTypeInput.value.trim()
                : selectedType === "personal" ? personalEventTypeInput.value
                : selectedType === "mantenimiento" ? maintenanceTypeInput.value
                : "",
            machinery: machineryInput.value.trim(),
            place: meetingPlaceInput.value.trim(),
            contact: meetingContactInput.value.trim(),
            financials: selectedType === "maniobra" ? {
    totalToCharge: Number(maniobraTotalInput.value),
                advanceReceived: Number(maniobraAdvanceInput.value),
                transportBudget: Number(maniobraTransportInput.value),
                operatorPayment: Number(maniobraOperatorPayInput.value),
                remainingToCollect: Number(maniobraTotalInput.value) - Number(maniobraAdvanceInput.value),
                estimatedMargin: Number(maniobraTotalInput.value) - Number(maniobraOperatorPayInput.value) - Number(maniobraTransportInput.value)
            } : null,
            source: "manual",
            status: "Pendiente"
        }
;

events.push(newEvent);

if (!saveEvents())
{
    events.pop();
    formMessage.textContent =
        "No se pudo guardar. Revisa el almacenamiento del navegador.";
    return;
}

selectedDate = parseDate(date);
cursorDate = new Date(selectedDate);
currentView = "month";

document.querySelectorAll(".view-button").forEach(button => {
    button.classList.toggle(
        "active",
        button.dataset.view === "month"
    );
});

activeCategories.add(selectedType);

document.querySelectorAll(".category-filter").forEach(button => {
    if (button.dataset.category === selectedType)
    {
        button.classList.add("active");
    }
});

closeEventModal();
renderCalendar();
    });

// ==========================================
// INICIALIZACIÓN
// ==========================================

renderCalendar();

});