
/* =========================================
   CARGA DEL HEADER ADMINISTRATIVO
   TULA'S CRANE
========================================= */

(function () {
    "use strict";

    const HEADER_FILE = "DiseñoAdmin.html";
    const CSS_FILE = "css/DiseñoAdmin.css";

    /* CARGAR LOS ESTILOS */

    function cargarEstilos() {
        const yaExiste = Array.from(
            document.querySelectorAll('link[rel="stylesheet"]')
        ).some(function (link) {
            return link.getAttribute("href") === CSS_FILE;
        });

        if (!yaExiste) {
            const link = document.createElement("link");

            link.rel = "stylesheet";
            link.href = CSS_FILE;

            document.head.appendChild(link);
        }
    }

    /* CONFIGURAR EL HEADER */

    function activarHeader(contenedor) {
        const header = contenedor.querySelector("#adminHeader");

        if (!header) {
            console.error("No se encontró el header administrativo.");
            return;
        }

        const nav = header.querySelector("#adminNav");
        const menuToggle = header.querySelector("#adminMenuToggle");
        const extraMenu = header.querySelector("#adminExtraMenu");
        const logoutButton = header.querySelector("#adminLogoutButton");

        /* IDENTIFICAR LA PÁGINA ACTUAL */

        const paginaActual = (
            window.location.pathname.split("/").pop() || ""
        ).toLowerCase();

        nav.querySelectorAll(".admin-nav-link").forEach(function (link) {
            const destino = (
                link.getAttribute("href") || ""
            ).toLowerCase();

            const coincide = destino === paginaActual;

            link.classList.toggle("is-active", coincide);

            if (coincide) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        /* ABRIR Y CERRAR LOS MENÚS */

        menuToggle.addEventListener("click", function (event) {
            event.stopPropagation();

            const esMovil = window.matchMedia(
                "(max-width: 850px)"
            ).matches;

            if (esMovil) {
                const abierto = nav.classList.toggle("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(abierto)
                );

                menuToggle.setAttribute(
                    "aria-label",
                    abierto
                        ? "Cerrar navegación"
                        : "Abrir navegación"
                );

                extraMenu.hidden = true;
            } else {
                extraMenu.hidden = !extraMenu.hidden;

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(!extraMenu.hidden)
                );
            }
        });

        /* CERRAR AL HACER CLIC FUERA */

        document.addEventListener("click", function (event) {
            if (!header.contains(event.target)) {
                nav.classList.remove("is-open");
                extraMenu.hidden = true;

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menú de opciones"
                );
            }
        });

        /* CERRAR EL MENÚ MÓVIL AL ELEGIR UNA PÁGINA */

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("is-open");

                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        /* CERRAR SESIÓN */

        if (logoutButton) {
            logoutButton.addEventListener("click", function () {
                alert(
                    "El cierre de sesión se conectará cuando integremos la autenticación."
                );

                extraMenu.hidden = true;

                menuToggle.setAttribute("aria-expanded", "false");
            });
        }

        /* AJUSTAR AL CAMBIAR EL TAMAÑO DE LA VENTANA */

        window.addEventListener("resize", function () {
            if (
                !window.matchMedia("(max-width: 850px)").matches
            ) {
                nav.classList.remove("is-open");
            }

            menuToggle.setAttribute(
                "aria-expanded",
                String(
                    !extraMenu.hidden ||
                    nav.classList.contains("is-open")
                )
            );
        });
    }

    /* INSERTAR EL HEADER EN LA PÁGINA */

    async function cargarLayoutAdmin() {
        const contenedor = document.getElementById(
            "admin-header-placeholder"
        );

        if (!contenedor) {
            console.error(
                "No existe el elemento #admin-header-placeholder."
            );
            return;
        }

        cargarEstilos();

        try {
            const respuesta = await fetch(
                HEADER_FILE,
                { cache: "no-cache" }
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo cargar " +
                    HEADER_FILE +
                    ". Código: " +
                    respuesta.status
                );
            }

            const html = await respuesta.text();

            contenedor.innerHTML = html;

            activarHeader(contenedor);

        } catch (error) {
            console.error(
                "Error al cargar el header:",
                error
            );

            contenedor.innerHTML = `
                <p style="
                    padding: 12px;
                    color: #f4c542;
                    background: #111;
                    font-family: Arial, sans-serif;
                ">
                    No se pudo cargar el header.
                    Revisa las rutas de los archivos
                    y abre el proyecto desde el servidor local.
                </p>
            `;
        }
    }

    /* EJECUTAR CUANDO EL DOCUMENTO ESTÉ LISTO */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            cargarLayoutAdmin
        );
    } else {
        cargarLayoutAdmin();
    }

})();
