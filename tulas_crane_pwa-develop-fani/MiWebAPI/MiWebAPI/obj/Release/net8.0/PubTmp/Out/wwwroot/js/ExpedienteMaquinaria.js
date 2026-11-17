
"use strict";

// =========================================
// CARGAR DATOS DESDE LA API
// =========================================
async function cargarDatosExpediente() {
    const urlParams = new URLSearchParams(window.location.search);
    const idMaquina = urlParams.get('id');

    if (!idMaquina) {
        console.error("No se proporcionó un ID de maquinaria.");
        document.getElementById("nombreMaquinaria").textContent = "Máquina no seleccionada";
        return;
    }

    try {
        const respuesta = await fetch(`/api/ExpedienteMaquina/${idMaquina}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la información del servidor.");
        }

        const maquina = await respuesta.json();

        // Llenar el encabezado
        document.getElementById("nombreMaquinaria").textContent = `${maquina.tipo} ${maquina.marca}`;
        document.getElementById("capacidadMaquinaria").textContent = maquina.capacidad;

        // Actualizar el estado visual
        const estadoSpan = document.getElementById("estadoMaquinaria");

        if (maquina.estadoActividad) {
            estadoSpan.className = "estado-disponible";
            estadoSpan.innerHTML = '<i class="bi bi-check-circle-fill"></i> Disponible';
        } else {
            estadoSpan.className = "estado-documentacion";
            estadoSpan.innerHTML = '<i class="bi bi-cone-striped"></i> En maniobra';
            estadoSpan.style.color = "#edb83f";
        }

        // Llenar los inputs del formulario
        document.getElementById("marca").value = maquina.marca;
        document.getElementById("modelo").value = maquina.modelo;
        document.getElementById("capacidad").value = maquina.capacidad;
        document.getElementById("alcance").value = maquina.alcance || "N/A";
        document.getElementById("tipo").value = maquina.tipo;
        document.getElementById("anio").value = maquina.anio;

    } catch (error) {
        console.error("Error al cargar expediente:", error);
        document.getElementById("nombreMaquinaria").textContent = "Error al cargar datos";
    }
}

// Ejecutar al cargar la página
cargarDatosExpediente();

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

    const imagenPrincipal = document.getElementById("imagenPrincipal");
    const miniaturas = document.getElementById("miniaturas");

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
    // AGREGAR FOTOGRAFÍAS (VISTA LOCAL)
    // =========================================

    const btnAgregarImagen = document.getElementById("btnAgregarImagen");
    const inputImagen = document.getElementById("inputImagen");

    if (btnAgregarImagen && inputImagen && miniaturas && imagenPrincipal) {

        btnAgregarImagen.addEventListener("click", function () {
            inputImagen.click();
        });

        inputImagen.addEventListener("change", function () {
            const archivos = Array.from(inputImagen.files || []);
            if (!archivos.length) return;

            for (const archivo of archivos) {
                if (!archivo.type.startsWith("image/")) continue;

                // Crear una vista previa local de la imagen.
                const urlTemporal = URL.createObjectURL(archivo);

                const boton = document.createElement("button");
                boton.type = "button";
                boton.className = "miniatura";
                boton.setAttribute("aria-label", "Ver " + archivo.name);

                const imagen = document.createElement("img");
                imagen.src = urlTemporal;
                imagen.alt = archivo.name;

                boton.appendChild(imagen);
                miniaturas.appendChild(boton);

                boton.addEventListener("click", function () {
                    imagenPrincipal.src = urlTemporal;

                    miniaturas.querySelectorAll(".miniatura").forEach(function (item) {
                        item.classList.remove("activa");
                    });

                    boton.classList.add("activa");
                });
            }

            // Permitir volver a seleccionar el mismo archivo.
            inputImagen.value = "";
        });
    }

    // =========================================
    // EDITAR INFORMACIÓN
    // =========================================

    const formInformacion = document.getElementById("formInformacion");
    const btnEditar = document.getElementById("btnEditar");
    const btnCancelar = document.getElementById("btnCancelar");
    const accionesEdicion = document.getElementById("accionesEdicion");

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

        formInformacion.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const idMaquina = urlParams.get('id');

            if (!idMaquina) return;

            const marca = document.getElementById("marca").value.trim();
            const modelo = document.getElementById("modelo").value.trim();
            const capacidad = document.getElementById("capacidad").value.trim();
            const alcance = document.getElementById("alcance").value.trim();
            const tipo = document.getElementById("tipo").value.trim();
            const anio = parseInt(document.getElementById("anio").value.trim()) || new Date().getFullYear();

            const datosActualizados = {
                id: parseInt(idMaquina),
                marca: marca,
                modelo: modelo,
                capacidad: capacidad,
                alcance: alcance,
                tipo: tipo,
                anio: anio
            };

            const btnGuardar = formInformacion.querySelector(".btn-guardar");
            const textoOriginal = btnGuardar.textContent;

            try {
                btnGuardar.disabled = true;
                btnGuardar.textContent = "Guardando...";

                const respuesta = await fetch(`/api/ExpedienteMaquina/${idMaquina}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosActualizados)
                });

                if (respuesta.ok) {

                    document.getElementById("nombreMaquinaria").textContent = `${tipo} ${marca}`;
                    document.getElementById("capacidadMaquinaria").textContent = capacidad || "Capacidad por registrar";

                    activarEdicion(false);
                    alert("Los cambios se han guardado en la base de datos.");

                } else {
                    const errorData = await respuesta.json();
                    const errorReal = errorData.mensaje || errorData.title || JSON.stringify(errorData.errors) || "Desconocido";
                    alert("Error al guardar: " + errorReal);
                }

            } catch (error) {
                console.error("Fallo la conexión:", error);
                alert("Ocurrió un error de conexión al servidor.");

            } finally {
                btnGuardar.disabled = false;
                btnGuardar.textContent = textoOriginal;
            }
        });
    }

});
