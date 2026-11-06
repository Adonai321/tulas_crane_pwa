
document.addEventListener("DOMContentLoaded", async function () {

    // ========================================
    // CARGAR DISEÑO GENERAL
    // ========================================

    async function cargarDisenoGeneral() {
        try {
            const respuesta = await fetch("DiseñoGeneral.html");

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo cargar DiseñoGeneral.html"
                );
            }

            const html = await respuesta.text();

            // Convertir el HTML en un documento temporal
            const documento = new DOMParser().parseFromString(
                html,
                "text/html"
            );

            // Obtener encabezado y footer
            const header = documento.querySelector(".tc-header");
            const footer = documento.querySelector(".tc-footer");

            // Insertar encabezado
            const headerPlaceholder = document.getElementById(
                "header-placeholder"
            );

            if (headerPlaceholder && header) {
                headerPlaceholder.replaceChildren(
                    document.importNode(header, true)
                );
            }

            // Insertar footer
            const footerPlaceholder = document.getElementById(
                "footer-placeholder"
            );

            if (footerPlaceholder && footer) {
                footerPlaceholder.replaceChildren(
                    document.importNode(footer, true)
                );
            }

            // Activar funcionalidades después de insertar el HTML
            configurarMenu();
            actualizarAnio();
            marcarPaginaActual();

        } catch (error) {
            console.error(
                "Error al cargar el diseño general:",
                error
            );
        }
    }


    // ========================================
    // CONFIGURAR MENÚ DE HAMBURGUESA
    // ========================================

    function configurarMenu() {
        const botonMenu = document.getElementById("tcMenuToggle");
        const navegacion = document.getElementById("tcNavigation");

        if (!botonMenu || !navegacion) {
            console.warn(
                "No se encontró el botón o la navegación del menú."
            );
            return;
        }

        // Evitar registrar eventos duplicados
        if (botonMenu.dataset.initialized === "true") {
            return;
        }

        botonMenu.dataset.initialized = "true";

        // Cerrar el menú
        function cerrarMenu() {
            navegacion.classList.remove("tc-menu-open");
            botonMenu.classList.remove("tc-menu-active");

            botonMenu.setAttribute("aria-expanded", "false");
            botonMenu.setAttribute("aria-label", "Abrir menú");
        }

        // Abrir o cerrar el menú
        function alternarMenu() {
            const menuAbierto =
                navegacion.classList.contains("tc-menu-open");

            if (menuAbierto) {
                cerrarMenu();
            } else {
                navegacion.classList.add("tc-menu-open");
                botonMenu.classList.add("tc-menu-active");

                botonMenu.setAttribute("aria-expanded", "true");
                botonMenu.setAttribute("aria-label", "Cerrar menú");
            }
        }

        // Evento del botón
        botonMenu.addEventListener("click", alternarMenu);

        // Cerrar al seleccionar una opción
        navegacion.querySelectorAll("a").forEach(function (enlace) {
            enlace.addEventListener("click", cerrarMenu);
        });

        // Cerrar al presionar Escape
        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape") {
                cerrarMenu();
            }
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener("click", function (evento) {
            if (
                navegacion.classList.contains("tc-menu-open") &&
                !navegacion.contains(evento.target) &&
                !botonMenu.contains(evento.target)
            ) {
                cerrarMenu();
            }
        });

        // Cerrar si la pantalla vuelve al tamaño de escritorio
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                cerrarMenu();
            }
        });
    }


    // ========================================
    // ACTUALIZAR AÑO DEL FOOTER
    // ========================================

    function actualizarAnio() {
        const elementoAnio = document.getElementById(
            "tcCurrentYear"
        );

        if (elementoAnio) {
            elementoAnio.textContent = new Date().getFullYear();
        }
    }


    // ========================================
    // MARCAR PÁGINA ACTUAL
    // ========================================

    function marcarPaginaActual() {
        const paginaActual =
            window.location.pathname.split("/").pop().toLowerCase() ||
            "index.html";

        document.querySelectorAll(".tc-nav-link").forEach(
            function (enlace) {
                const destino = enlace.getAttribute("href");

                if (!destino) {
                    return;
                }

                const nombreDestino = destino
                    .split("#")[0]
                    .toLowerCase();

                if (nombreDestino === paginaActual) {
                    enlace.classList.add("active");
                    enlace.setAttribute("aria-current", "page");
                } else {
                    enlace.classList.remove("active");
                    enlace.removeAttribute("aria-current");
                }
            }
        );
    }


    // ========================================
    // INICIALIZAR COMPONENTES
    // ========================================

    await cargarDisenoGeneral();

});
