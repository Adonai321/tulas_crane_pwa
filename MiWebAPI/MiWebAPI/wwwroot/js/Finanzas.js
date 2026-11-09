document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const STORAGE_KEY = "tulasCraneFinanceRecords_v1";
  const $ = (id) => document.getElementById(id);
  const today = new Date();
  const localISO = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  const currentMonth = localISO().slice(0,7);
  $("periodFilter").value = currentMonth;
  $("movementDate").value = localISO();
  $("dueDate").value = localISO();

  const categoryOptions = {
    gasto: ["Operadores","Traslados","Mantenimiento","Proveedores","Servicios y renta","Impuestos","Otros"],
    ingreso: ["Maniobra / servicio","Anticipo de cliente","Liquidación de cliente","Renta de maquinaria","Otro ingreso"]
  };
  let activeTab = "movimientos";
  let records = loadRecords();

  function loadRecords() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
  function money(value) {
    return new Intl.NumberFormat("es-MX", {style:"currency",currency:"MXN"}).format(Number(value)||0);
  }
  function escapeHTML(value="") {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function formatDate(date) {
    if (!date) return "Sin fecha";
    const d = new Date(`${date}T12:00:00`);
    return d.toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});
  }
  function monthRecords() {
    const month = $("periodFilter").value;
    return records.filter(r => (r.date || r.dueDate || "").slice(0,7) === month);
  }
  function openModal(type="gasto") {
    $("registerMenu").classList.add("hidden");
    $("financeModal").classList.add("is-open");
    $("financeModal").setAttribute("aria-hidden","false");
    $("financeForm").reset();
    $("movementDate").value = localISO();
    $("dueDate").value = localISO();
    $("financeFormMessage").textContent = "";
    setFormType(type);
    $("concept").focus();
  }
  function closeModal() {
    $("financeModal").classList.remove("is-open");
    $("financeModal").setAttribute("aria-hidden","true");
  }
  function setFormType(type) {
    $("recordType").value = type;
    document.querySelectorAll("[data-form-type]").forEach(btn => btn.classList.toggle("active",btn.dataset.formType===type));
    const movement = type === "gasto" || type === "ingreso";
    $("movementFields").classList.toggle("hidden",!movement);
    $("obligationFields").classList.toggle("hidden",movement);
    $("modalTitle").textContent = ({gasto:"Registrar gasto",ingreso:"Registrar pago recibido / ingreso",factura:"Registrar factura",impuesto:"Registrar impuesto"})[type];
    $("modalSubtitle").textContent = movement ? "Registra el movimiento de dinero." : "Registra la obligación y su fecha límite.";
    $("receivedByField").classList.toggle("hidden",!movement);
    $("receivedByLabel").textContent = type==="gasto" ? "¿Quién tuvo el gasto? *" : "¿Quién recibió el pago? *";
    $("receivedBy").required = movement;
    $("concept").required = movement;
    $("amount").required = movement;
    $("movementDate").required = movement;
    $("category").required = movement;
    $("obligationConcept").required = !movement;
    $("dueDate").required = !movement;
    $("obligationStatus").required = !movement;
    const cat = $("category");
    cat.innerHTML = (categoryOptions[type] || []).map(v=>`<option value="${escapeHTML(v)}">${escapeHTML(v)}</option>`).join("");
    $("obligationConcept").placeholder = type==="factura" ? "Ej. Factura de maniobra 005" : "Ej. Pago provisional de ISR";
  }
  function render() {
    const list = monthRecords();
    const incomes = list.filter(r=>r.type==="ingreso").reduce((s,r)=>s+Number(r.amount||0),0);
    const expenses = list.filter(r=>r.type==="gasto").reduce((s,r)=>s+Number(r.amount||0),0);
    const obligations = records.filter(r=>["factura","impuesto"].includes(r.type) && !["Cumplida","Cancelada"].includes(r.status));
    $("incomeTotal").textContent = money(incomes);
    $("expenseTotal").textContent = money(expenses);
    $("balanceTotal").textContent = money(incomes-expenses);
    $("balanceCaption").textContent = incomes-expenses < 0 ? "Balance negativo" : "Ingresos menos gastos";
    $("obligationsCount").textContent = obligations.length;
    $("flowPeriodLabel").textContent = $("periodFilter").value || "Todos";
    renderChart(list);
    renderUpcoming(obligations);
    renderDistribution(list);
    renderMovements();
    renderSecondary();
  }
  function renderChart(list) {
    const month = $("periodFilter").value || currentMonth;
    const weeks = [[],[],[],[]];
    list.forEach(r => {
      if (!r.date) return;
      const day = Number(r.date.slice(8,10));
      const index = Math.min(3,Math.floor((day-1)/7));
      weeks[index].push(r);
    });
    const max = Math.max(1,...weeks.flatMap(w=>[w.filter(r=>r.type==="ingreso").reduce((s,r)=>s+Number(r.amount),0),w.filter(r=>r.type==="gasto").reduce((s,r)=>s+Number(r.amount),0)]));
    $("flowChart").innerHTML = weeks.map((week,i)=>{
      const inc=week.filter(r=>r.type==="ingreso").reduce((s,r)=>s+Number(r.amount),0);
      const exp=week.filter(r=>r.type==="gasto").reduce((s,r)=>s+Number(r.amount),0);
      const hi=Math.max(3,inc/max*90), he=Math.max(3,exp/max*90);
      return `<div class="week-column" title="Semana ${i+1}: ingresos ${money(inc)}, gastos ${money(exp)}"><div class="bar income-bar" style="height:${inc?hi:2}%"></div><div class="bar expense-bar" style="height:${exp?he:2}%"></div><span class="week-label">Sem ${i+1}</span></div>`;
    }).join("");
  }
  function renderUpcoming(obligations) {
    const upcoming = obligations.slice().sort((a,b)=>(a.dueDate||"").localeCompare(b.dueDate||"")).slice(0,5);
    if (!upcoming.length) {
      $("upcomingList").innerHTML = '<div class="empty-small">No hay vencimientos pendientes registrados.</div>';
      return;
    }
    $("upcomingList").innerHTML = upcoming.map(r=>{
      const diff = r.dueDate ? Math.ceil((new Date(`${r.dueDate}T00:00:00`) - new Date(`${localISO()}T00:00:00`))/86400000) : null;
      const overdue = diff !== null && diff < 0;
      const when = diff === null ? "Sin fecha" : overdue ? `Vencido hace ${Math.abs(diff)} d` : diff===0 ? "Vence hoy" : `En ${diff} días`;
      return `<div class="upcoming-item"><span class="status-dot ${overdue?"overdue":""}"></span><div><div class="upcoming-name">${escapeHTML(r.concept)}</div><div class="upcoming-sub">${r.type==="factura"?"Factura":"Impuesto"} · ${escapeHTML(r.period||r.description||"Compromiso")}</div></div><span class="due-date">${formatDate(r.dueDate)}</span><span class="due-amount">${money(r.amount)}</span></div>`;
    }).join("");
  }
  function renderDistribution(list) {
    const expenses=list.filter(r=>r.type==="gasto");
    const totals={};
    expenses.forEach(r=>totals[r.category||"Otros"]=(totals[r.category||"Otros"]||0)+Number(r.amount||0));
    const items=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
    const total=expenses.reduce((s,r)=>s+Number(r.amount||0),0);
    if (!items.length) { $("expenseDistribution").innerHTML='<div class="empty-small">Registra gastos para ver su distribución.</div>'; return; }
    $("expenseDistribution").innerHTML=items.map(([name,val])=>`<div class="distribution-row"><span class="distribution-label"><i class="distribution-swatch"></i>${escapeHTML(name)}</span><div class="distribution-track"><div class="distribution-fill" style="width:${total?val/total*100:0}%"></div></div><span class="distribution-value">${total?Math.round(val/total*100):0}%</span></div>`).join("");
  }
  function renderMovements() {
    let list=monthRecords().filter(r=>r.type==="gasto"||r.type==="ingreso");
    const search=$("movementSearch").value.trim().toLowerCase();
    const type=$("movementTypeFilter").value;
    if(search) list=list.filter(r=>`${r.concept} ${r.category} ${r.description} ${r.receivedBy}`.toLowerCase().includes(search));
    if(type!=="todos") list=list.filter(r=>r.type===type);
    list.sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    $("movementCount").textContent=`${list.length} registro${list.length===1?"":"s"}`;
    $("tableTitle").textContent=activeTab==="maniobras"?"Movimientos relacionados con maniobras":"Movimientos recientes";
    if(activeTab==="maniobras") list=list.filter(r=>r.relatedManeuver);
    $("movementRows").innerHTML=list.map(r=>`<tr><td>${formatDate(r.date)}</td><td>${escapeHTML(r.concept)}${r.relatedManeuver?`<div class="muted">${escapeHTML(r.relatedManeuver)}</div>`:""}</td><td><span class="type-pill ${r.type}">${r.type==="ingreso"?"Ingreso":"Gasto"}</span></td><td>${money(r.amount)}</td><td>${escapeHTML(r.type==="ingreso"?(r.receivedBy||"—"):`${r.receivedBy||"Sin responsable"} · ${r.category||"Sin categoría"}`)}</td><td><button class="row-actions" data-delete-record="${r.id}" title="Eliminar registro" aria-label="Eliminar registro"><i class="bi bi-trash"></i></button></td></tr>`).join("");
    $("tableEmpty").classList.toggle("hidden",list.length!==0);
  }
  function renderSecondary() {
    const section=$("secondarySection");
    const shouldShow=["obligaciones","facturacion","impuestos","reportes"].includes(activeTab);
    section.classList.toggle("hidden",!shouldShow);
    if(!shouldShow)return;
    const title={obligaciones:"Pagos y compromisos",facturacion:"Facturación",impuestos:"Impuestos",reportes:"Reportes del periodo"}[activeTab];
    $("secondaryTitle").textContent=title;
    let list=records.filter(r=>{
      if(activeTab==="obligaciones") return ["factura","impuesto"].includes(r.type);
      if(activeTab==="facturacion") return r.type==="factura";
      if(activeTab==="impuestos") return r.type==="impuesto";
      return false;
    }).sort((a,b)=>(a.dueDate||"").localeCompare(b.dueDate||""));
    if(activeTab==="reportes"){
      const m=monthRecords(),inc=m.filter(r=>r.type==="ingreso").reduce((s,r)=>s+Number(r.amount||0),0),exp=m.filter(r=>r.type==="gasto").reduce((s,r)=>s+Number(r.amount||0),0);
      $("secondaryContent").innerHTML=`<div class="secondary-card-grid"><article class="secondary-card"><h3>Ingresos</h3><p>${money(inc)}</p></article><article class="secondary-card"><h3>Gastos</h3><p>${money(exp)}</p></article><article class="secondary-card"><h3>Balance</h3><p>${money(inc-exp)}</p></article></div><p class="chart-note">Resumen calculado con los movimientos del mes seleccionado. No sustituye un reporte contable oficial.</p>`;
      return;
    }
    if(!list.length){$("secondaryContent").innerHTML='<div class="empty-small">No hay registros en esta sección.</div>';return;}
    $("secondaryContent").innerHTML=`<div class="table-scroll"><table><thead><tr><th>Tipo</th><th>Concepto</th><th>Vencimiento</th><th>Importe</th><th>Estatus</th><th>Acción</th></tr></thead><tbody>${list.map(r=>`<tr><td>${r.type==="factura"?"Factura":"Impuesto"}</td><td>${escapeHTML(r.concept)}<div class="muted">${escapeHTML(r.period||r.description||"")}</div></td><td>${formatDate(r.dueDate)}</td><td>${money(r.amount)}</td><td><span class="status-pill">${escapeHTML(r.status)}</span></td><td><button class="text-button" data-cycle-status="${r.id}">Cambiar estatus</button> <button class="row-actions" data-delete-record="${r.id}" title="Eliminar"><i class="bi bi-trash"></i></button></td></tr>`).join("")}</tbody></table></div>`;
  }
  function registerRecord(event) {
    event.preventDefault();
    const type=$("recordType").value;
    const id=crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    let record;
    if(type==="gasto"||type==="ingreso"){
      const amount=Number($("amount").value);
      if(!Number.isFinite(amount)||amount<=0){$("financeFormMessage").textContent="Ingresa un importe mayor que cero.";return;}
      if(! $("receivedBy").value){$("financeFormMessage").textContent = type==="gasto" ? "Selecciona quién tuvo el gasto." : "Selecciona quién recibió el pago.";return;}
      record={id,type,concept:$("concept").value.trim(),amount,date:$("movementDate").value,category:$("category").value,receivedBy:$("receivedBy").value,relatedManeuver:$("relatedManeuver").value.trim(),description:$("description").value.trim(),createdAt:new Date().toISOString()};
    } else {
      const amount=Number($("obligationAmount").value||0);
      record={id,type,concept:$("obligationConcept").value.trim(),amount,dueDate:$("dueDate").value,status:$("obligationStatus").value,period:$("fiscalPeriod").value.trim(),description:$("obligationDescription").value.trim(),createdAt:new Date().toISOString()};
    }
    if(!record.concept){$("financeFormMessage").textContent="Escribe un concepto.";return;}
    records.push(record); saveRecords(); closeModal(); render();
  }
  $("registerMenuButton").addEventListener("click",()=> $("registerMenu").classList.toggle("hidden"));
  $("registerMenu").addEventListener("click",e=>{const btn=e.target.closest("[data-open-form]");if(btn)openModal(btn.dataset.openForm);});
  document.querySelectorAll("[data-form-type]").forEach(btn=>btn.addEventListener("click",()=>setFormType(btn.dataset.formType)));
  $("closeFinanceModal").addEventListener("click",closeModal);
  $("cancelFinanceForm").addEventListener("click",closeModal);
  $("financeModal").addEventListener("click",e=>{if(e.target===$("financeModal"))closeModal();});
  $("financeForm").addEventListener("submit",registerRecord);
  $("periodFilter").addEventListener("change",render);
  $("movementSearch").addEventListener("input",renderMovements);
  $("movementTypeFilter").addEventListener("change",renderMovements);
  document.querySelectorAll("[data-tab-target]").forEach(btn=>btn.addEventListener("click",()=>{
    activeTab=btn.dataset.tabTarget;
    document.querySelectorAll(".finance-tab").forEach(tab=>tab.classList.toggle("active",tab.dataset.tabTarget===activeTab));
    render();
    if(["obligaciones","facturacion","impuestos","reportes"].includes(activeTab)) $("secondarySection").scrollIntoView({behavior:"smooth",block:"start"});
  }));
  $("backToMovements").addEventListener("click",()=>{activeTab="movimientos";document.querySelectorAll(".finance-tab").forEach(tab=>tab.classList.toggle("active",tab.dataset.tabTarget===activeTab));render();});
  document.addEventListener("click",e=>{
    if(!e.target.closest(".register-menu-wrap")) $("registerMenu").classList.add("hidden");
    const del=e.target.closest("[data-delete-record]");
    if(del){
      const id=del.dataset.deleteRecord;
      if(confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")){records=records.filter(r=>r.id!==id);saveRecords();render();}
    }
    const cycle=e.target.closest("[data-cycle-status]");
    if(cycle){
      const r=records.find(item=>item.id===cycle.dataset.cycleStatus);
      if(r){const states=["Pendiente","En proceso","Cumplida","Cancelada"];r.status=states[(states.indexOf(r.status)+1)%states.length];saveRecords();render();}
    }
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();$("registerMenu").classList.add("hidden");}});
  render();
});
