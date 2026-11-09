/* ==========================================
   HEADER GENERAL - FUNCIONALIDAD DEL HEADER
   Funciona también si HeaderGeneral.html se carga con fetch().
   ========================================== */

(function () {
    "use strict";

    // Delegación de eventos: funciona aunque el header se inserte después.
    document.addEventListener("click", function (event) {
        const toggle = event.target.closest(".tc-menu-toggle");
        const header = event.target.closest(".tc-header");

        if (toggle && header) {
            const abierto = header.classList.toggle("menu-abierto");
            toggle.setAttribute("aria-expanded", String(abierto));
            toggle.setAttribute(
                "aria-label",
                abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            );
            return;
        }

        // Al seleccionar un enlace del menú, cerrarlo en móvil.
        const navLink = event.target.closest(".tc-nav-link");
        if (navLink) {
            const navHeader = navLink.closest(".tc-header");
            if (navHeader) {
                navHeader.classList.remove("menu-abierto");
                const menuButton = navHeader.querySelector(".tc-menu-toggle");
                if (menuButton) {
                    menuButton.setAttribute("aria-expanded", "false");
                    menuButton.setAttribute("aria-label", "Abrir menú de navegación");
                }
            }
        }
    });

    // Marcar como activo el enlace correspondiente a la página actual.
    function marcarPaginaActual() {
        const nombreArchivo = window.location.pathname.split("/").pop().toLowerCase();
        const enlaces = document.querySelectorAll(".tc-nav-link[data-page]");

        enlaces.forEach(function (enlace) {
            const href = enlace.getAttribute("href").split("/").pop().toLowerCase();
            const esInicio = !nombreArchivo || nombreArchivo === "/" || nombreArchivo === "index.html";
            const coincide = esInicio
                ? enlace.dataset.page === "index"
                : href === nombreArchivo;

            enlace.classList.toggle("is-active", coincide);

            if (coincide) {
                enlace.setAttribute("aria-current", "page");
            } else {
                enlace.removeAttribute("aria-current");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", marcarPaginaActual);
    } else {
        marcarPaginaActual();
    }

    // Si el header se inserta mediante fetch después de DOMContentLoaded,
    // la observación permite aplicar el estado activo al aparecer.
    const observador = new MutationObserver(function () {
        if (document.querySelector(".tc-header")) {
            marcarPaginaActual();
        }
    });

    if (document.documentElement) {
        observador.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
})();
