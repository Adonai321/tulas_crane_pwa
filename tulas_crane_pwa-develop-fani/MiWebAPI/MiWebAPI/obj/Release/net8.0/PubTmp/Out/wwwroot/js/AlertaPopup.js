/* =========================================
   TARJETA DE AVISO GLOBAL (POP-UP)
   TULA'S CRANE
========================================= */
(function () {
    "use strict";

    function inyectarEstilosPopup() {
        if (document.getElementById("tc-popup-styles")) return;

        const style = document.createElement("style");
        style.id = "tc-popup-styles";
        style.textContent = `
            .tc-popup-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(3px);
                animation: tcFadeIn 0.18s ease-out;
            }

            .tc-popup-overlay.abierto {
                display: flex;
            }

            .tc-popup-card {
                position: relative;
                width: 100%;
                max-width: 410px;
                padding: 30px 24px 24px;
                background: #141414;
                border: 1px solid #333333;
                border-radius: 14px;
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.65);
                color: #f8f8f8;
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
                animation: tcPopScale 0.2s ease-out;
            }

            .tc-popup-card.exito {
                border-top: 4px solid #28a745;
            }

            .tc-popup-card.error {
                border-top: 4px solid #dc3545;
            }

            .tc-popup-card.advertencia {
                border-top: 4px solid #f4c542;
            }

            .tc-popup-cerrar {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                display: grid;
                place-items: center;
                background: transparent;
                border: 1px solid transparent;
                border-radius: 8px;
                color: #aaaaaa;
                font-size: 18px;
                cursor: pointer;
                transition: color 0.15s ease, background 0.15s ease;
            }

            .tc-popup-cerrar:hover {
                color: #ffffff;
                background: #262626;
            }

            .tc-popup-icono {
                width: 56px;
                height: 56px;
                margin: 0 auto 14px;
                display: grid;
                place-items: center;
                border-radius: 50%;
                font-size: 28px;
            }

            .tc-popup-card.exito .tc-popup-icono {
                background: rgba(40, 167, 69, 0.15);
                color: #4cd964;
                border: 1px solid rgba(40, 167, 69, 0.4);
            }

            .tc-popup-card.error .tc-popup-icono {
                background: rgba(220, 53, 69, 0.15);
                color: #ff6b6b;
                border: 1px solid rgba(220, 53, 69, 0.4);
            }

            .tc-popup-card.advertencia .tc-popup-icono {
                background: rgba(244, 197, 66, 0.15);
                color: #f4c542;
                border: 1px solid rgba(244, 197, 66, 0.4);
            }

            .tc-popup-titulo {
                margin: 0 0 8px;
                font-size: 1.2rem;
                font-weight: 800;
                color: #ffffff;
            }

            .tc-popup-mensaje {
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.5;
                color: #d0d0d0;
                word-wrap: break-word;
            }

            .tc-popup-acciones {
                margin-top: 22px;
                display: none;
                gap: 10px;
                justify-content: center;
            }

            .tc-popup-acciones.visible {
                display: flex;
            }

            .tc-popup-btn {
                padding: 9px 18px;
                border-radius: 8px;
                font-family: inherit;
                font-size: 0.9rem;
                font-weight: 700;
                cursor: pointer;
                transition: background 0.15s ease, border-color 0.15s ease;
            }

            .tc-popup-btn-cancelar {
                background: #242424;
                border: 1px solid #444444;
                color: #e0e0e0;
            }

            .tc-popup-btn-cancelar:hover {
                background: #333333;
                color: #ffffff;
            }

            .tc-popup-btn-confirmar {
                background: #a83838;
                border: 1px solid #d9534f;
                color: #ffffff;
            }

            .tc-popup-btn-confirmar:hover {
                background: #c9302c;
            }

            @keyframes tcFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes tcPopScale {
                from { opacity: 0; transform: scale(0.92); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    let callbackCierre = null;
    let callbackConfirmar = null;

    function crearEstructuraPopup() {
        if (document.getElementById("tcPopupOverlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "tcPopupOverlay";
        overlay.className = "tc-popup-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");

        overlay.innerHTML = `
            <div class="tc-popup-card" id="tcPopupCard">
                <button type="button" class="tc-popup-cerrar" id="tcPopupCerrar" aria-label="Cerrar aviso">
                    <i class="bi bi-x-lg"></i>
                </button>
                <div class="tc-popup-icono" id="tcPopupIcono"></div>
                <h3 class="tc-popup-titulo" id="tcPopupTitulo">Aviso</h3>
                <p class="tc-popup-mensaje" id="tcPopupMensaje"></p>
                <div class="tc-popup-acciones" id="tcPopupAcciones">
                    <button type="button" class="tc-popup-btn tc-popup-btn-cancelar" id="tcPopupBtnCancelar">Cancelar</button>
                    <button type="button" class="tc-popup-btn tc-popup-btn-confirmar" id="tcPopupBtnConfirmar">Sí, continuar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById("tcPopupCerrar").addEventListener("click", cerrarAviso);
        document.getElementById("tcPopupBtnCancelar").addEventListener("click", cerrarAviso);

        document.getElementById("tcPopupBtnConfirmar").addEventListener("click", function () {
            const fn = callbackConfirmar;
            callbackConfirmar = null;
            callbackCierre = null;
            const ov = document.getElementById("tcPopupOverlay");
            if (ov) ov.classList.remove("abierto");
            if (typeof fn === "function") fn();
        });

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) cerrarAviso();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && overlay.classList.contains("abierto")) {
                cerrarAviso();
            }
        });
    }

    function cerrarAviso() {
        const overlay = document.getElementById("tcPopupOverlay");
        if (overlay) {
            overlay.classList.remove("abierto");
        }
        callbackConfirmar = null;
        if (typeof callbackCierre === "function") {
            const fn = callbackCierre;
            callbackCierre = null;
            fn();
        }
    }

    window.mostrarAviso = function (opciones) {
        inyectarEstilosPopup();
        crearEstructuraPopup();

        const {
            tipo = "exito", // "exito", "error" o "advertencia"
            titulo = tipo === "exito" ? "¡Operación exitosa!" : "Ocurrió un problema",
            mensaje = "",
            alCerrar = null,
            confirmar = false,
            textoConfirmar = "Sí, dar de baja",
            alConfirmar = null
        } = opciones;

        const overlay = document.getElementById("tcPopupOverlay");
        const card = document.getElementById("tcPopupCard");
        const icono = document.getElementById("tcPopupIcono");
        const elTitulo = document.getElementById("tcPopupTitulo");
        const elMensaje = document.getElementById("tcPopupMensaje");
        const elAcciones = document.getElementById("tcPopupAcciones");
        const btnConfirmar = document.getElementById("tcPopupBtnConfirmar");

        card.className = `tc-popup-card ${tipo}`;

        if (tipo === "exito") {
            icono.innerHTML = '<i class="bi bi-check-lg"></i>';
        } else if (tipo === "advertencia") {
            icono.innerHTML = '<i class="bi bi-trash3-fill"></i>';
        } else {
            icono.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>';
        }

        elTitulo.textContent = titulo;
        elMensaje.textContent = mensaje;
        callbackCierre = alCerrar;
        callbackConfirmar = alConfirmar;

        if (confirmar) {
            btnConfirmar.textContent = textoConfirmar;
            elAcciones.classList.add("visible");
        } else {
            elAcciones.classList.remove("visible");
        }

        overlay.classList.add("abierto");
        (confirmar ? btnConfirmar : document.getElementById("tcPopupCerrar")).focus();
    };
})();