"use strict";

document.addEventListener("DOMContentLoaded", function () {

    let maquinaria = [];
    const POR_PAGINA = 4;
    let paginaActual = 1;
    let filtroActual = "todos";

    const contenedor = document.getElementById("maquinariaGrid");
    const paginacion = document.getElementById("maquinariaPagination");
    const buscador = document.getElementById("buscarMaquinaria");
    const botonBuscar = document.getElementById("btnBuscarMaquinaria");
    const botonAgregar = document.getElementById("btnAgregarMaquinaria");
    const mensajeVacio = document.getElementById("maquinariaEmpty");
    const botonesFiltro = document.querySelectorAll(".filter-btn");

    async function cargarMaquinariaDesdeDB() {
        try {
            const respuesta = await fetch("/api/Maquinaria/Catalogo");

            if (!respuesta.ok) {
                throw new Error("El servidor no respondió correctamente al solicitar el catálogo.");
            }

            maquinaria = await respuesta.json();
            paginaActual = 1;
            renderizarMaquinaria();

        } catch (error) {
            console.error("Fallo la conexión con la API:", error);
            contenedor.innerHTML = "";

            if (typeof mostrarAviso === "function") {
                mostrarAviso({
                    tipo: "error",
                    titulo: "Error al cargar el catálogo",
                    mensaje: "No se pudo obtener el listado de maquinaria. Verifica tu conexión o que el servidor esté encendido."
                });
            }
        }
    }

    function crearTarjeta(maquina, indice) {
        const tarjeta = document.createElement("article");

        const tituloPrincipal = maquina.marca || maquina.nombre || maquina.tipo || "Sin marca";
        const tipoSecundario = maquina.tipo || "";
        const urlImagen = (maquina.imagen || maquina.rutaImagen || "").trim();

        tarjeta.className = "maquinaria-card";
        tarjeta.style.animationDelay = `${indice * 0.06}s`; // Entrada escalonada dinámica
        tarjeta.tabIndex = 0;
        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute("aria-label", `Consultar ${tituloPrincipal}, ${maquina.capacidad}`);

        const estadoDisponible = maquina.estado === "disponible";
        const estadoManiobra = maquina.estado === "maniobra";

        const claseTexto = estadoDisponible
            ? "status-text-available"
            : estadoManiobra
                ? "status-text-busy"
                : "status-text-unavailable";

        const iconoEstado = estadoDisponible
            ? "bi-check-circle-fill"
            : estadoManiobra
                ? "bi-cone-striped"
                : "bi-x-circle-fill";

        const iconoDocumentacion = maquina.documentosCompletos
            ? "bi-check-lg"
            : "bi-exclamation-lg";

        tarjeta.innerHTML = `
            <div class="maquinaria-photo">
                <span class="maquinaria-badge-estado ${claseTexto}">
                    <i class="bi ${iconoEstado}"></i> ${maquina.disponibilidad}
                </span>

                <div class="maquinaria-photo-placeholder" aria-hidden="true">
                    <i class="bi bi-truck-front"></i>
                    <span>Imagen pendiente</span>
                </div>

                ${urlImagen ? `
                    <img
                        src="${urlImagen}"
                        alt="${tituloPrincipal}"
                        loading="lazy">
                ` : ""}
            </div>

            <div class="maquinaria-info">
                <h2 class="maquinaria-name">${tituloPrincipal}</h2>

                ${tipoSecundario ? `
                    <p class="maquinaria-type" style="margin: 0; font-size: 0.88rem; color: #f4c542; font-weight: 600;">
                        ${tipoSecundario}
                    </p>
                ` : ""}

                <div class="maquinaria-specs-row">
                    ${maquina.capacidad ? `<span class="spec-pill"><i class="bi bi-speedometer2"></i> ${maquina.capacidad}</span>` : ""}
                    ${maquina.alcance ? `<span class="spec-pill"><i class="bi bi-arrows-expand"></i> ${maquina.alcance}</span>` : ""}
                </div>

                <p class="maquinaria-doc-status" style="margin-top: 4px; padding-right: 42px;">
                    <span class="status-icon ${maquina.documentosCompletos ? "status-available" : "status-busy"}">
                        <i class="bi ${iconoDocumentacion}"></i>
                    </span>
                    <span>${maquina.documentacion}</span>
                </p>
            </div>

            <button
                type="button"
                class="maquinaria-arrow"
                aria-label="Consultar ${tituloPrincipal}">
                <i class="bi bi-arrow-right"></i>
            </button>
        `;

        // Si la URL existe pero aún no carga en Azure Blob, ocultamos el <img> y queda el marco estilizado
        const imagen = tarjeta.querySelector("img");
        if (imagen) {
            imagen.addEventListener("error", function () {
                imagen.remove();
            });
        }

        function consultarMaquinaria() {
            window.location.href = `ExpedienteMaquinaria.html?id=${maquina.id}`;
        }

        tarjeta.addEventListener("click", consultarMaquinaria);

        tarjeta.addEventListener("keydown", function (evento) {
            if (evento.target === tarjeta && (evento.key === "Enter" || evento.key === " ")) {
                evento.preventDefault();
                consultarMaquinaria();
            }
        });

        tarjeta.querySelector(".maquinaria-arrow").addEventListener("click", function (evento) {
            evento.stopPropagation();
            consultarMaquinaria();
        });

        return tarjeta;
    }

    function renderizarControlesPaginacion(totalResultados) {
        if (!paginacion) return;

        const totalPaginas = Math.ceil(totalResultados / POR_PAGINA);
        paginacion.replaceChildren();

        // Si hay 4 o menos máquinas en total, no hace falta paginar
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

        // Botones numéricos: 1, 2, 3...
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
        renderizarMaquinaria();
        contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderizarMaquinaria() {
        const texto = buscador.value.trim().toLocaleLowerCase("es-MX");

        const resultados = maquinaria.filter(function (maquina) {
            const coincideTexto = [
                maquina.marca,
                maquina.tipo,
                maquina.nombre,
                maquina.capacidad,
                maquina.alcance,
                maquina.categoria,
                maquina.disponibilidad,
                maquina.documentacion
            ]
                .join(" ")
                .toLocaleLowerCase("es-MX")
                .includes(texto);

            const coincideCategoria =
                filtroActual === "todos" ||
                maquina.categoria === filtroActual;

            return coincideTexto && coincideCategoria;
        });

        const totalPaginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA));
        if (paginaActual > totalPaginas) {
            paginaActual = 1;
        }

        const inicio = (paginaActual - 1) * POR_PAGINA;
        const paginaItems = resultados.slice(inicio, inicio + POR_PAGINA);

        contenedor.replaceChildren();

        paginaItems.forEach(function (maquina, idx) {
            contenedor.appendChild(crearTarjeta(maquina, idx));
        });

        mensajeVacio.hidden = resultados.length > 0;
        renderizarControlesPaginacion(resultados.length);
    }

    // Al buscar o filtrar regresamos siempre a la página 1
    function reiniciarYRenderizar() {
        paginaActual = 1;
        renderizarMaquinaria();
    }

    buscador.addEventListener("input", reiniciarYRenderizar);
    botonBuscar.addEventListener("click", reiniciarYRenderizar);

    buscador.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            reiniciarYRenderizar();
        }
    });

    botonesFiltro.forEach(function (boton) {
        boton.addEventListener("click", function () {
            filtroActual = boton.dataset.filter;
            botonesFiltro.forEach(otroBoton => {
                const activo = otroBoton === boton;
                otroBoton.classList.toggle("active", activo);
                otroBoton.setAttribute("aria-pressed", activo ? "true" : "false");
            });
            reiniciarYRenderizar();
        });
    });

    botonAgregar.addEventListener("click", function () {
        window.location.href = "RegistrarMaquinaria.html";
    });

    cargarMaquinariaDesdeDB();

});