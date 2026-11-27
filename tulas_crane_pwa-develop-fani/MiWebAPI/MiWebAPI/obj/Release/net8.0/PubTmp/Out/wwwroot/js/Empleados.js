"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("listaEmpleados");
    const paginacion = document.getElementById("empleadosPagination");
    const buscador = document.getElementById("buscarEmpleado");
    const filtros = document.querySelectorAll(".filtro-btn");
    const mensajeVacio = document.getElementById("empleadosVacio");

    const POR_PAGINA = 4;
    let paginaActual = 1;
    let listaEmpleadosGlobal = [];
    let filtroActual = "todos";

    async function cargarEmpleadosDesdeDB() {
        try {
            const respuesta = await fetch("/api/Empleados/Catalogo");
            if (!respuesta.ok) throw new Error("Error al obtener los empleados del servidor");

            listaEmpleadosGlobal = await respuesta.json();
            paginaActual = 1;
            renderizarEmpleados();
        } catch (error) {
            console.error("Fallo la conexión con la API de empleados:", error);
            contenedor.innerHTML = `<p style="color: #ff7b7b; padding: 20px;">Error al cargar los empleados desde la base de datos.</p>`;
        }
    }

    function normalizarTexto(texto) {
        return (texto || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function crearTarjetaEmpleado(emp, indice) {
        const article = document.createElement("article");
        article.className = "empleado-card";
        article.style.animationDelay = `${indice * 0.05}s`;
        article.setAttribute("data-categoria", emp.categoria);
        article.tabIndex = 0;
        article.setAttribute("role", "button");
        article.setAttribute("aria-label", `Ver expediente de ${emp.nombreCompleto}`);

        const urlFoto = (emp.foto || emp.imagen || emp.rutaFoto || "").trim();

        article.innerHTML = `
            <div class="empleado-foto">
                <div class="empleado-avatar-fallback" aria-hidden="true">${emp.iniciales || "TC"}</div>
                ${urlFoto ? `
                    <img
                        src="${urlFoto}"
                        alt="Foto de ${emp.nombreCompleto}"
                        loading="lazy">
                ` : ""}
            </div>

            <div class="empleado-info">
                <h2>${emp.nombreCompleto}</h2>
                <span class="empleado-puesto">${emp.puesto}</span>
                <div class="empleado-estados">
                    <p class="estado ${emp.estadoClase}">
                        <i class="bi bi-check-circle-fill"></i>
                        ${emp.disponibilidad}
                    </p>
                    <p class="estado documentacion-ok">
                        <i class="bi bi-check-circle-fill"></i>
                        ${emp.documentacion}
                    </p>
                </div>
            </div>

            <a href="ExpedienteEmpleado.html?id=${emp.id}" class="empleado-detalle" aria-label="Ver expediente de ${emp.nombreCompleto}">
                <i class="bi bi-arrow-right"></i>
            </a>
        `;

        // Si aún no hay foto en Azure Blob o falla la ruta, eliminamos el <img> y quedan las iniciales
        const img = article.querySelector("img");
        if (img) {
            img.addEventListener("error", function () {
                img.remove();
            });
        }

        function irAExpediente() {
            window.location.href = `ExpedienteEmpleado.html?id=${emp.id}`;
        }

        article.addEventListener("click", irAExpediente);
        article.addEventListener("keydown", function (e) {
            if (e.target === article && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                irAExpediente();
            }
        });

        article.querySelector(".empleado-detalle").addEventListener("click", function (e) {
            e.stopPropagation();
        });

        return article;
    }

    function renderizarControlesPaginacion(totalResultados) {
        if (!paginacion) return;

        const totalPaginas = Math.ceil(totalResultados / POR_PAGINA);
        paginacion.replaceChildren();

        if (totalPaginas <= 1) {
            paginacion.hidden = true;
            return;
        }

        paginacion.hidden = false;

        // Botón Anterior
        const btnAnterior = document.createElement("button");
        btnAnterior.type = "button";
        btnAnterior.className = "page-btn page-btn-nav";
        btnAnterior.innerHTML = `<i class="bi bi-chevron-left"></i> <span>Anterior</span>`;
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
        paginacion.appendChild(btnAnterior);

        // Números de página: 1, 2, 3...
        for (let i = 1; i <= totalPaginas; i++) {
            const btnNumero = document.createElement("button");
            btnNumero.type = "button";
            btnNumero.className = `page-btn ${i === paginaActual ? "active" : ""}`;
            btnNumero.textContent = i;
            btnNumero.setAttribute("aria-label", `Página ${i}`);
            if (i === paginaActual) btnNumero.setAttribute("aria-current", "page");

            btnNumero.addEventListener("click", () => cambiarPagina(i));
            paginacion.appendChild(btnNumero);
        }

        // Botón Siguiente
        const btnSiguiente = document.createElement("button");
        btnSiguiente.type = "button";
        btnSiguiente.className = "page-btn page-btn-nav";
        btnSiguiente.innerHTML = `<span>Siguiente</span> <i class="bi bi-chevron-right"></i>`;
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));
        paginacion.appendChild(btnSiguiente);
    }

    function cambiarPagina(nuevaPagina) {
        paginaActual = nuevaPagina;
        renderizarEmpleados();
        contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderizarEmpleados() {
        const busqueda = normalizarTexto(buscador.value.trim());

        const filtrados = listaEmpleadosGlobal.filter(emp => {
            const coincideCategoria = filtroActual === "todos" || emp.categoria === filtroActual;
            const textoCompleto = normalizarTexto(`${emp.nombreCompleto} ${emp.puesto} ${emp.disponibilidad}`);
            const coincideBusqueda = textoCompleto.includes(busqueda);
            return coincideCategoria && coincideBusqueda;
        });

        const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
        if (paginaActual > totalPaginas) {
            paginaActual = 1;
        }

        const inicio = (paginaActual - 1) * POR_PAGINA;
        const paginaItems = filtrados.slice(inicio, inicio + POR_PAGINA);

        contenedor.replaceChildren();
        paginaItems.forEach((emp, idx) => {
            contenedor.appendChild(crearTarjetaEmpleado(emp, idx));
        });

        mensajeVacio.hidden = filtrados.length > 0;
        renderizarControlesPaginacion(filtrados.length);
    }

    buscador.addEventListener("input", function () {
        paginaActual = 1;
        renderizarEmpleados();
    });

    filtros.forEach(boton => {
        boton.addEventListener("click", function () {
            filtros.forEach(f => f.classList.remove("activo"));
            boton.classList.add("activo");
            filtroActual = boton.dataset.filtro;
            paginaActual = 1;
            renderizarEmpleados();
        });
    });

    cargarEmpleadosDesdeDB();
});