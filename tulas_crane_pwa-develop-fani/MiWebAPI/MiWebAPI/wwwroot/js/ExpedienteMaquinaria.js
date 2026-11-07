
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // PESTAÑAS
    // =========================================

    const tabs = document.querySelectorAll(".expediente-tab");
    const panels = document.querySelectorAll(".expediente-panel");

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const nombrePanel = tab.dataset.tab;

            tabs.forEach(function (otraTab) {
                otraTab.classList.remove("activa");
                otraTab.setAttribute("aria-selected", "false");
            });

            panels.forEach(function (panel) {
                panel.classList.remove("activo");
                panel.hidden = true;
            });

            tab.classList.add("activa");
            tab.setAttribute("aria-selected", "true");

            const panelSeleccionado =
                document.getElementById("panel" +
                    nombrePanel.charAt(0).toUpperCase() +
                    nombrePanel.slice(1));

            if (panelSeleccionado) {
                panelSeleccionado.classList.add("activo");
                panelSeleccionado.hidden = false;
            }
        });
    });

    // =========================================
    // CAMBIAR IMAGEN PRINCIPAL
    // =========================================

    const imagenPrincipal =
        document.getElementById("imagenPrincipal");

    const miniaturas =
        document.getElementById("miniaturas");

    if (miniaturas && imagenPrincipal) {

        miniaturas.addEventListener("click", function (evento) {

            const miniatura = evento.target.closest(".miniatura");

            if (!miniatura) return;

            const ruta = miniatura.dataset.imagen;

            if (!ruta) return;

            imagenPrincipal.src = ruta;

            miniaturas.querySelectorAll(".miniatura").forEach(function (item) {
                item.classList.remove("activa");
            });

            miniatura.classList.add("activa");
        });
    }

    // =========================================
    // AGREGAR FOTOGRAFÍAS
    // =========================================

    const btnAgregarImagen =
        document.getElementById("btnAgregarImagen");

    const inputImagen =
        document.getElementById("inputImagen");

    const avisoGaleria =
        document.getElementById("avisoGaleria");

    if (btnAgregarImagen && inputImagen) {

        btnAgregarImagen.addEventListener("click", function () {
            inputImagen.click();
        });

        inputImagen.addEventListener("change", function () {

            const archivos = Array.from(inputImagen.files || []);

            if (!archivos.length) return;

            archivos.forEach(function (archivo) {

                if (!archivo.type.startsWith("image/")) return;

                const urlTemporal = URL.createObjectURL(archivo);

                const boton = document.createElement("button");
                boton.type = "button";
                boton.className = "miniatura";
                boton.setAttribute(
                    "aria-label",
                    "Ver " + archivo.name
                );

                const imagen = document.createElement("img");
                imagen.src = urlTemporal;
                imagen.alt = archivo.name;

                boton.appendChild(imagen);
                miniaturas.appendChild(boton);

                boton.addEventListener("click", function () {

                    imagenPrincipal.src = urlTemporal;

                    miniaturas.querySelectorAll(".miniatura")
                        .forEach(function (item) {
                            item.classList.remove("activa");
                        });

                    boton.classList.add("activa");
                });

            });

            if (avisoGaleria) {
                avisoGaleria.hidden = false;
                avisoGaleria.textContent =
                    "Las fotografías se muestran temporalmente. " +
                    "Para conservarlas, será necesario conectarlas " +
                    "al servidor.";
            }

            inputImagen.value = "";
        });
    }

    // =========================================
    // EDITAR INFORMACIÓN
    // =========================================

    const formInformacion =
        document.getElementById("formInformacion");

    const btnEditar =
        document.getElementById("btnEditar");

    const btnCancelar =
        document.getElementById("btnCancelar");

    const accionesEdicion =
        document.getElementById("accionesEdicion");

    const campos = formInformacion
        ? Array.from(formInformacion.querySelectorAll("input"))
        : [];

    let valoresOriginales = {};

    function guardarValoresOriginales() {

        valoresOriginales = {};

        campos.forEach(function (campo) {
            valoresOriginales[campo.name] = campo.value;
        });
    }

    function activarEdicion(activar) {

        campos.forEach(function (campo) {
            campo.readOnly = !activar;
        });

        accionesEdicion.hidden = !activar;
        btnEditar.hidden = activar;

        if (activar) {
            guardarValoresOriginales();
        }
    }

    if (btnEditar && formInformacion) {

        btnEditar.addEventListener("click", function () {
            activarEdicion(true);
        });

        btnCancelar.addEventListener("click", function () {

            campos.forEach(function (campo) {
                campo.value = valoresOriginales[campo.name] ?? campo.value;
            });

            activarEdicion(false);
        });

        formInformacion.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const marca = document.getElementById("marca").value.trim();
            const capacidad = document.getElementById("capacidad").value.trim();

            document.getElementById("nombreMaquinaria").textContent =
                "Grúa " + (marca || "Sin marca registrada");

            document.getElementById("capacidadMaquinaria").textContent =
                capacidad || "Capacidad por registrar";

            activarEdicion(false);

            alert(
                "Los cambios se muestran en esta página. " +
                "Para conservarlos después de recargar, " +
                "será necesario conectarlos a la API."
            );
        });
    }

    // =========================================
    // DOCUMENTACIÓN
    // =========================================

    const btnAgregarDocumento =
        document.getElementById("btnAgregarDocumento");

    const inputDocumento =
        document.getElementById("inputDocumento");

    const listaDocumentos =
        document.getElementById("listaDocumentos");

    if (btnAgregarDocumento && inputDocumento) {

        btnAgregarDocumento.addEventListener("click", function () {
            inputDocumento.click();
        });

        inputDocumento.addEventListener("change", function () {

            const archivos = Array.from(inputDocumento.files || []);

            if (!archivos.length) return;

            const mensajeVacio =
                listaDocumentos.querySelector(".documento-vacio");

            if (mensajeVacio) {
                mensajeVacio.remove();
            }

            archivos.forEach(function (archivo) {

                const urlTemporal = URL.createObjectURL(archivo);

                const elemento = document.createElement("div");
                elemento.className = "documento-item";

                const icono = document.createElement("i");
                icono.className = "bi bi-file-earmark-text";

                const enlace = document.createElement("a");
                enlace.href = urlTemporal;
                enlace.target = "_blank";
                enlace.rel = "noopener noreferrer";
                enlace.textContent = archivo.name;

                const detalle = document.createElement("div");
                const tamano = document.createElement("small");

                tamano.textContent =
                    (archivo.size / 1024).toFixed(1) + " KB";

                detalle.appendChild(enlace);
                detalle.appendChild(tamano);

                elemento.appendChild(icono);
                elemento.appendChild(detalle);

                listaDocumentos.appendChild(elemento);
            });

            inputDocumento.value = "";
        });
    }

});
