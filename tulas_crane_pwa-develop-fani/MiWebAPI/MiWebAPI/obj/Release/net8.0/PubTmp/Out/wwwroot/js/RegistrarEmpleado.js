
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. ELEMENTOS DEL HTML
    // ==========================================

    const formulario = document.getElementById("formRegistrarEmpleado");
    const divMensaje = document.getElementById("mensajeRespuesta");
    const btnGuardar = document.getElementById("btnGuardar");

    const nombre = document.getElementById("nombre");
    const apellidoPaterno = document.getElementById("apellidoPaterno");
    const apellidoMaterno = document.getElementById("apellidoMaterno");
    const puesto = document.getElementById("puesto");
    const salario = document.getElementById("salario");
    const rfc = document.getElementById("rfc");
    const domicilio = document.getElementById("domicilio");


    // ==========================================
    // 2. MOSTRAR MENSAJES
    // ==========================================

    function mostrarMensaje(tipo, mensaje) {

        divMensaje.replaceChildren();

        const icono = document.createElement("i");

        if (tipo === "success") {
            divMensaje.className = "alert-mensaje alert-success";
            icono.className = "bi bi-check-circle-fill";
        } else {
            divMensaje.className = "alert-mensaje alert-danger";
            icono.className = "bi bi-exclamation-triangle-fill";
        }

        const texto = document.createElement("span");
        texto.textContent = " " + mensaje;

        divMensaje.append(icono, texto);
        divMensaje.style.display = "block";
    }


    // ==========================================
    // 3. VALIDAR FORMULARIO
    // ==========================================

    function validarFormulario() {

        const nombreVal = nombre.value.trim();
        const apellidoPaternoVal = apellidoPaterno.value.trim();
        const apellidoMaternoVal = apellidoMaterno.value.trim();
        const puestoVal = puesto.value;
        const salarioVal = Number(salario.value);
        const rfcVal = rfc.value.trim().toUpperCase();
        const domicilioVal = domicilio.value.trim();

        if (!nombreVal || !apellidoPaternoVal || !puestoVal ||
            !salario.value || !rfcVal || !domicilioVal) {

            mostrarMensaje("error", "Completa todos los campos obligatorios.");
            return false;
        }

        if (!Number.isFinite(salarioVal) || salarioVal <= 0) {

            mostrarMensaje("error", "El salario debe ser mayor a cero.");
            salario.focus();
            return false;
        }

        // RFC de persona física (13 caracteres)
        // o persona moral (12 caracteres).
        const formatoRFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

        if (!formatoRFC.test(rfcVal)) {

            mostrarMensaje("error", "El RFC no tiene un formato válido. Verifica sus 12 o 13 caracteres.");
            rfc.focus();
            return false;
        }

        return true;
    }


    // ==========================================
    // 4. NORMALIZAR RFC
    // ==========================================

    rfc.addEventListener("input", function () {

        rfc.value = rfc.value.toUpperCase().replace(/\s/g, "");
    });


    // ==========================================
    // 5. REGISTRAR EMPLEADO
    // ==========================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        divMensaje.style.display = "none";

        if (!validarFormulario()) {
            return;
        }

        // Datos que recibirá EmpleadoModel.
        const empleadoData = {

            nombre: nombre.value.trim(),
            apellidoPaterno: apellidoPaterno.value.trim(),
            apellidoMaterno: apellidoMaterno.value.trim() || null,

            puesto: puesto.value,

            salario: Number(salario.value),

            direccion: domicilio.value.trim(),

            rfcEmpleado: rfc.value.trim().toUpperCase()
        };


        // Evitar envíos duplicados.
        btnGuardar.disabled = true;
        btnGuardar.textContent = "Guardando...";


        try {

            const respuesta = await fetch("/api/Empleados/Registrar", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(empleadoData)
            });


            // Leer respuesta sin asumir que siempre será JSON.
            const textoRespuesta = await respuesta.text();

            let resultado = {};

            if (textoRespuesta) {

                try {
                    resultado = JSON.parse(textoRespuesta);
                } catch {
                    resultado = {};
                }
            }


            // ==========================================
            // 6. RESPUESTA EXITOSA
            // ==========================================

            if (respuesta.ok && resultado.success === true) {

                mostrarMensaje(
                    "success",
                    resultado.message || "Empleado registrado correctamente."
                );

                formulario.reset();

                return;
            }


            // ==========================================
            // 7. RESPUESTA CON ERROR
            // ==========================================

            const mensajeError =
                resultado.message ||
                resultado.title ||
                "No se pudo registrar al empleado.";

            mostrarMensaje("error", mensajeError);


        } catch (error) {

            console.error("Error al registrar empleado:", error);

            mostrarMensaje(
                "error",
                "No fue posible conectar con el servidor. Verifica tu conexión e inténtalo nuevamente."
            );

        } finally {

            // Restaurar botón.
            btnGuardar.disabled = false;

            btnGuardar.innerHTML =
                'Guardar Empleado <i class="bi bi-arrow-right"></i>';
        }

    });

});
