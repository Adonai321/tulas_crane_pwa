
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    let maquinaria = [];
    const contenedor = document.getElementById("maquinariaGrid");
    const buscador = document.getElementById("buscarMaquinaria");
    const botonBuscar = document.getElementById("btnBuscarMaquinaria");
    const botonAgregar = document.getElementById("btnAgregarMaquinaria");
    const mensajeVacio = document.getElementById("maquinariaEmpty");
    const botonesFiltro = document.querySelectorAll(".filter-btn");

    let filtroActual = "todos";

    async function cargarMaquinariaDesdeDB() {
        try {
            const respuesta = await fetch("/api/Maquinaria/Catalogo");

            if (!respuesta.ok) {
                throw new Error("Error al obtener los datos del servidor");
            }

            // Asignamos la respuesta a nuestro arreglo global
            maquinaria = await respuesta.json();

            // Renderizamos las tarjetas una vez obtenidos los datos
            renderizarMaquinaria();
        } catch (error) {
            console.error("Fallo la conexión con la API:", error);
            contenedor.innerHTML = `<p style="color: #ff7b7b;">Error al cargar la maquinaria. Verifica tu conexión.</p>`;
        }
    }

    function crearTarjeta(maquina) {

        const tarjeta = document.createElement("article");

        tarjeta.className = "maquinaria-card";
        tarjeta.tabIndex = 0;
        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute(
            "aria-label",
            `Consultar ${maquina.nombre}, ${maquina.capacidad}`
        );

        const estadoDisponible = maquina.estado === "disponible";
        const estadoManiobra = maquina.estado === "maniobra";

        const claseEstado = estadoDisponible
            ? "status-available"
            : estadoManiobra
                ? "status-busy"
                : "status-unavailable";

        const claseTexto = estadoDisponible
            ? "status-text-available"
            : estadoManiobra
                ? "status-text-busy"
                : "status-text-unavailable";

        const iconoEstado = estadoDisponible
            ? "bi-check-lg"
            : estadoManiobra
                ? "bi-check-lg"
                : "bi-x-lg";

        const iconoDocumentacion = maquina.documentosCompletos
            ? "bi-check-lg"
            : "bi-exclamation-lg";

        tarjeta.innerHTML = `
            <div class="maquinaria-photo">
                <div class="maquinaria-photo-placeholder"
                     aria-hidden="true">
                    <i class="bi bi-truck-front"></i>
                </div>

                <img
                    src="${maquina.imagen}"
                    alt="${maquina.nombre}"
                    loading="lazy">
            </div>

            <div class="maquinaria-info">

                <h2 class="maquinaria-name">
                    ${maquina.nombre}
                </h2>

                <p class="maquinaria-capacity">
                    ${maquina.capacidad}
                </p>

                ${maquina.alcance ? `
                    <p class="maquinaria-reach">
                        ${maquina.alcance}
                    </p>
                ` : ""}

                <p class="maquinaria-status">
                    <span class="status-icon ${claseEstado}">
                        <i class="bi ${iconoEstado}"></i>
                    </span>

                    <span class="${claseTexto}">
                        ${maquina.disponibilidad}
                    </span>
                </p>

                <p class="maquinaria-doc-status">
                    <span class="status-icon ${maquina.documentosCompletos
                ? "status-available"
                : "status-busy"
            }">
                        <i class="bi ${iconoDocumentacion}"></i>
                    </span>

                    <span>
                        ${maquina.documentacion}
                    </span>
                </p>

            </div>

            <button
                type="button"
                class="maquinaria-arrow"
                aria-label="Consultar ${maquina.nombre}">
                <i class="bi bi-arrow-right"></i>
            </button>
        `;

        // Si todavía no existe la fotografía,
        // se conserva el icono provisional.
        const imagen = tarjeta.querySelector("img");

        imagen.addEventListener("error", function () {
            imagen.style.display = "none";
        });

        // La tarjeta y su flecha realizan la misma acción.
        function consultarMaquinaria() {
            window.location.href =
                `ExpedienteMaquinaria.html?id=${maquina.id}`;
        }

        tarjeta.addEventListener("click", consultarMaquinaria);

        tarjeta.addEventListener("keydown", function (evento) {
            if (
                evento.target === tarjeta &&
                (evento.key === "Enter" || evento.key === " ")
            ) {
                evento.preventDefault();
                consultarMaquinaria();
            }
        });

        tarjeta.querySelector(".maquinaria-arrow")
            .addEventListener("click", function (evento) {
                evento.stopPropagation();
                consultarMaquinaria();
            });

        return tarjeta;
    }

    function renderizarMaquinaria() {

        const texto = buscador.value
            .trim()
            .toLocaleLowerCase("es-MX");

        const resultados = maquinaria.filter(function (maquina) {

            const coincideTexto = [
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

        contenedor.replaceChildren();

        resultados.forEach(function (maquina) {
            contenedor.appendChild(crearTarjeta(maquina));
        });

        mensajeVacio.hidden = resultados.length > 0;
    }

    buscador.addEventListener("input", renderizarMaquinaria);
    botonBuscar.addEventListener("click", renderizarMaquinaria);

    buscador.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            renderizarMaquinaria();
        }
    });

    botonesFiltro.forEach(function (boton) {

        boton.addEventListener("click", function () {

            filtroActual = boton.dataset.filter;

            botonesFiltro.forEach(otroBoton => otroBoton.classList.toggle("active", otroBoton === boton));
            renderizarMaquinaria();
        });

    });


    botonAgregar.addEventListener("click", function () {
        window.location.href = "RegistrarMaquinaria.html";
    });

    cargarMaquinariaDesdeDB();

});
