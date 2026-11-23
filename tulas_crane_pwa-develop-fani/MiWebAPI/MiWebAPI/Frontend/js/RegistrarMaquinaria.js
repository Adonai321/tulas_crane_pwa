"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrarMaquinariaForm");
    const paso1 = document.getElementById("step-1");
    const paso2 = document.getElementById("step-2");
    const indicador1 = document.getElementById("step-indicator-1");
    const indicador2 = document.getElementById("step-indicator-2");
    const btnContinuar = document.getElementById("btnContinuar");
    const btnRegresar = document.getElementById("btnRegresar");

    function mostrarPaso(numero) {
        const mostrarDatos = numero === 1;

        paso1.classList.toggle("active", mostrarDatos);
        paso2.classList.toggle("active", !mostrarDatos);
        indicador1.classList.toggle("active", mostrarDatos);
        indicador2.classList.toggle("active", !mostrarDatos);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    btnContinuar.addEventListener("click", function () {
        const inputsPaso1 = paso1.querySelectorAll("input[required], select[required]");
        let isValid = true;

        inputsPaso1.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.reportValidity();
            }
        });

        if (isValid) {
            mostrarPaso(2);
        } else {
            form.reportValidity();
        }
    });

    btnRegresar.addEventListener("click", function () {
        mostrarPaso(1);
    });

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        // 1. Recolectar datos del Paso 1
        const maquinariaData = {
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value,
            capacidad: document.getElementById("capacidad").value.trim(),
            alcance: document.getElementById("alcance").value.trim(),
            tipo: document.getElementById("tipo").value,
            anio: parseInt(document.getElementById("anio").value, 10),
            placas: document.getElementById("placas").value.trim()
        };

        try {
            // 2. Enviar datos de la máquina por POST (JSON)
            const response = await fetch('/api/Maquinaria/Registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maquinariaData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const idMaquinaNueva = result.idMaquina;

                // 3. Verificar si el usuario seleccionó archivos opcionales en el Paso 2
                const certificado = document.getElementById("certificado").files[0];
                const tarjetaCirculacion = document.getElementById("tarjetaCirculacion").files[0];
                const tenencia = document.getElementById("tenencia").files[0];
                const otros = document.getElementById("otros").files[0];

                if ((certificado || tarjetaCirculacion || tenencia || otros) && idMaquinaNueva) {
                    const formDataFiles = new FormData();
                    formDataFiles.append("idMaquina", idMaquinaNueva);

                    if (certificado) formDataFiles.append("certificado", certificado);
                    if (tarjetaCirculacion) formDataFiles.append("tarjetaCirculacion", tarjetaCirculacion);
                    if (tenencia) formDataFiles.append("tenencia", tenencia);
                    if (otros) formDataFiles.append("otros", otros);

                    // Enviar archivos mediante FormData a la API
                    await fetch('/api/Archivos/SubirDocumentoMaquina', {
                        method: 'POST',
                        body: formDataFiles
                    });
                }

                alert("¡Maquinaria y documentación registradas exitosamente!");
                window.location.href = '/Maquinaria.html';
            } else {
                alert("Error al registrar la maquinaria: " + (result.message || "Verifique los datos"));
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        }
    });
});