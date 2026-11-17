/* =========================================
   CARGA DEL HEADER ADMINISTRATIVO
   TULA'S CRANE
========================================= */

(function () {
    "use strict";

    const HEADER_FILE = "DiseñoAdmin.html";
    const CSS_FILE = "css/DiseñoAdmin.css";

    /* =========================================
       CARGAR LOS ESTILOS
    ========================================= */

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

    /* =========================================
       RESUMEN DEL DASHBOARD
    ========================================= */

    async function cargarResumenDashboard() {
        const cotizaciones = document.getElementById("statCotizaciones");
        const maniobras = document.getElementById("statManiobras");
        const maquinaria = document.getElementById("statMaquinaria");
        const empleados = document.getElementById("statEmpleados");

        if (!cotizaciones || !maniobras || !maquinaria || !empleados) {
            return;
        }

        try {
            const respuesta = await fetch("/api/Dashboard/Resumen", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!respuesta.ok) {
                const errorApi = await respuesta.text();
                throw new Error("Error HTTP " + respuesta.status + ": " + errorApi);
            }

            const datos = await respuesta.json();

            cotizaciones.textContent = formatNumber(datos.totalCotizaciones);
            maniobras.textContent = formatNumber(datos.totalManiobras);
            maquinaria.textContent = formatNumber(datos.totalMaquinaria);
            empleados.textContent = formatNumber(datos.totalEmpleados);

        } catch (error) {
            console.error("Error al cargar el resumen del Dashboard:", error);
            cotizaciones.textContent = "0";
            maniobras.textContent = "0";
            maquinaria.textContent = "0";
            empleados.textContent = "0";
        }
    }

    function formatNumber(num) {
        const numero = Number(num) || 0;
        return numero < 10 ? "0" + numero : numero.toString();
    }

    /* =========================================
       CONFIGURAR EL HEADER Y NAVEGACIÓN MÓVIL
    ========================================= */

    function activarHeader(contenedor) {
        const header = contenedor.querySelector("#adminHeader");

        if (!header) {
            console.error("No se encontró el header administrativo.");
            return;
        }

        const nav = header.querySelector("#adminNav");
        const logoutButton = header.querySelector("#adminLogoutButton");

        /* INYECTAR BARRA INFERIOR MÓVIL SINCRONIZADA */
        if (!document.querySelector(".mobile-bottom-nav")) {
            const mobileNavHTML = `
                <nav class="mobile-bottom-nav" aria-label="Navegación móvil">
                    <a href="Dashboard.html" class="mobile-nav-item" aria-label="Inicio">
                        <i class="bi bi-house-fill"></i>
                        <span>Inicio</span>
                    </a>
                    <a href="Maquinaria.html" class="mobile-nav-item" aria-label="Maquinaria">
                        <i class="bi bi-truck-front"></i>
                        <span>Maquinaria</span>
                    </a>
                    <a href="Empleados.html" class="mobile-nav-item" aria-label="Empleados">
                        <i class="bi bi-people"></i>
                        <span>Personal</span>
                    </a>
                    <a href="Calendario.html" class="mobile-nav-item" aria-label="Calendario">
                        <i class="bi bi-calendar3"></i>
                        <span>Agenda</span>
                    </a>
                    <a href="Finanzas.html" class="mobile-nav-item" aria-label="Finanzas">
                        <i class="bi bi-cash-coin"></i>
                        <span>Finanzas</span>
                    </a>
                </nav>
            `;
            document.body.insertAdjacentHTML("beforeend", mobileNavHTML);
        }

        /* IDENTIFICAR LA PÁGINA ACTUAL (PC Y MÓVIL) */
        const paginaActual = (
            window.location.pathname.split("/").pop() || "dashboard.html"
        ).toLowerCase();

        // 1. Sincronizar enlaces de PC
        if (nav) {
            nav.querySelectorAll(".admin-nav-link").forEach(function (link) {
                const destino = (link.getAttribute("href") || "").toLowerCase();
                const coincide = destino === paginaActual;

                link.classList.toggle("is-active", coincide);
                if (coincide) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }

        // 2. Sincronizar enlaces de Teléfono
        document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item").forEach(function (link) {
            const destino = (link.getAttribute("href") || "").toLowerCase();
            const coincide = destino === paginaActual;

            link.classList.toggle("active", coincide);
            if (coincide) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        /* CERRAR SESIÓN */
        if (logoutButton) {
            logoutButton.addEventListener("click", async function (e) {
                e.preventDefault();

                if (typeof cerrarSesion === "function") {
                    cerrarSesion();
                    return;
                }

                try {
                    await fetch("/api/Auth/salir", { method: "POST" });
                } catch (error) {
                    // Continuar con limpieza local si el endpoint no responde
                }

                sessionStorage.clear();
                localStorage.removeItem("empleados_usuario");
                window.location.href = "index.html"; 
            });
        }
    }

    /* =========================================
       INSERTAR EL HEADER EN LA PÁGINA
    ========================================= */

    async function cargarLayoutAdmin() {
        const contenedor = document.getElementById("admin-header-placeholder");

        if (!contenedor) {
            console.error("No existe el elemento #admin-header-placeholder.");
            return;
        }

        cargarEstilos();

        try {
            const respuesta = await fetch(HEADER_FILE, { cache: "no-cache" });

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo cargar " + HEADER_FILE + ". Código: " + respuesta.status
                );
            }

            const html = await respuesta.text();
            contenedor.innerHTML = html;
            activarHeader(contenedor);

        } catch (error) {
            console.error("Error al cargar el header:", error);
            contenedor.innerHTML = `
                <p style="padding: 12px; color: #f4c542; background: #111; font-family: Arial, sans-serif;">
                    No se pudo cargar el header. Revisa las rutas de los archivos y abre el proyecto desde el servidor local.
                </p>
            `;
        }
    }

    /* =========================================
       INICIALIZACIÓN
    ========================================= */

    async function inicializar() {
        await cargarLayoutAdmin();
        await cargarResumenDashboard();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar);
    } else {
        inicializar();
    }

    /* =========================================
       FUNCIÓN COMPARTIDA PARA BAJA LÓGICA
    ========================================= */
    window.ejecutarBajaLogica = async function ({ endpoint, nombreEntidad, urlRedireccion, boton }) {
        const confirmado = window.confirm(
            `¿Estás seguro de dar de baja a ${nombreEntidad}?\n\nDejará de aparecer en los catálogos y conteos, pero su historial se conservará en la base de datos.`
        );

        if (!confirmado) return;

        const textoOriginal = boton.innerHTML;
        try {
            boton.disabled = true;
            boton.innerHTML = '<i class="bi bi-hourglass-split"></i> Procesando...';

            const respuesta = await fetch(endpoint, { method: "DELETE" });
            const resultado = await respuesta.json().catch(() => ({}));

            if (respuesta.ok) {
                alert(resultado.mensaje || "Registro dado de baja correctamente.");
                window.location.href = urlRedireccion;
            } else {
                alert("No se pudo completar la baja: " + (resultado.mensaje || "Error del servidor"));
            }
        } catch (error) {
            console.error("Error en baja lógica:", error);
            alert("Error de conexión al intentar dar de baja el registro.");
        } finally {
            boton.disabled = false;
            boton.innerHTML = textoOriginal;
        }
    };

})();