"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const idMaquina = new URLSearchParams(window.location.search).get("id");

    // 1. CARGAR DATOS DESDE LA API
    async function cargarDatosExpediente() {
        if (!idMaquina) {
            document.getElementById("nombreMaquinaria").textContent = "Máquina no seleccionada";
            return;
        }

        try {
            const respuesta = await fetch(`/api/Maquinaria/${idMaquina}`);
            if (!respuesta.ok) throw new Error("No se pudo cargar la información.");

            const maquina = await respuesta.json();

            document.getElementById("nombreMaquinaria").textContent = `${maquina.tipo} ${maquina.marca}`;
            document.getElementById("capacidadMaquinaria").textContent = maquina.capacidad;

            const estadoSpan = document.getElementById("estadoMaquinaria");
            if (maquina.estadoActividad) {
                estadoSpan.className = "estado-disponible";
                estadoSpan.innerHTML = '<i class="bi bi-check-circle-fill"></i> Disponible';
            } else {
                estadoSpan.className = "estado-documentacion";
                estadoSpan.innerHTML = '<i class="bi bi-cone-striped"></i> En maniobra';
                estadoSpan.style.color = "#edb83f";
            }

            document.getElementById("marca").value = maquina.marca || "";
            document.getElementById("modelo").value = maquina.modelo || "";
            document.getElementById("capacidad").value = maquina.capacidad || "";
            document.getElementById("alcance").value = maquina.alcance || "N/A";
            document.getElementById("tipo").value = maquina.tipo || "";
            document.getElementById("anio").value = maquina.anio || "";
        } catch (error) {
            console.error("Error al cargar expediente:", error);
            document.getElementById("nombreMaquinaria").textContent = "Error al cargar datos";
        }
    }

    // 2. PESTAÑAS
    const tabs = document.querySelectorAll(".expediente-tab");
    const panels = document.querySelectorAll(".expediente-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = "panel" + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
            tabs.forEach(t => {
                t.classList.toggle("activa", t === tab);
                t.setAttribute("aria-selected", String(t === tab));
            });
            panels.forEach(p => {
                const activo = p.id === targetId;
                p.classList.toggle("activo", activo);
                p.hidden = !activo;
            });
        });
    });

    // 3. GALERÍA LOCAL
    const imagenPrincipal = document.getElementById("imagenPrincipal");
    const miniaturas = document.getElementById("miniaturas");

    if (miniaturas && imagenPrincipal) {
        miniaturas.addEventListener("click", (e) => {
            const btn = e.target.closest(".miniatura");
            if (!btn || !btn.dataset.imagen) return;
            imagenPrincipal.src = btn.dataset.imagen;
            miniaturas.querySelectorAll(".miniatura").forEach(m => m.classList.remove("activa"));
            btn.classList.add("activa");
        });
    }

    // 4. EDITAR INFORMACIÓN
    const formInformacion = document.getElementById("formInformacion");
    const btnEditar = document.getElementById("btnEditar");
    const btnCancelar = document.getElementById("btnCancelar");
    const accionesEdicion = document.getElementById("accionesEdicion");
    const campos = formInformacion ? Array.from(formInformacion.querySelectorAll("input")) : [];
    let valoresOriginales = {};

    function toggleEdicion(activar) {
        if (activar) {
            valoresOriginales = Object.fromEntries(campos.map(c => [c.name, c.value]));
        }
        campos.forEach(c => c.readOnly = !activar);
        accionesEdicion.hidden = !activar;
        btnEditar.hidden = activar;
    }

    if (btnEditar && formInformacion) {
        btnEditar.addEventListener("click", () => toggleEdicion(true));
        btnCancelar.addEventListener("click", () => {
            campos.forEach(c => c.value = valoresOriginales[c.name] ?? c.value);
            toggleEdicion(false);
        });

        formInformacion.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!idMaquina) return;

            const datosActualizados = {
                id: parseInt(idMaquina),
                marca: document.getElementById("marca").value.trim(),
                modelo: document.getElementById("modelo").value.trim(),
                capacidad: document.getElementById("capacidad").value.trim(),
                alcance: document.getElementById("alcance").value.trim(),
                tipo: document.getElementById("tipo").value.trim(),
                anio: parseInt(document.getElementById("anio").value.trim()) || new Date().getFullYear()
            };

            const btnGuardar = formInformacion.querySelector(".btn-guardar");
            const textoOriginal = btnGuardar.textContent;

            try {
                btnGuardar.disabled = true;
                btnGuardar.textContent = "Guardando...";

                const respuesta = await fetch(`/api/Maquinaria/${idMaquina}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosActualizados)
                });

                if (respuesta.ok) {
                    document.getElementById("nombreMaquinaria").textContent = `${datosActualizados.tipo} ${datosActualizados.marca}`;
                    document.getElementById("capacidadMaquinaria").textContent = datosActualizados.capacidad || "Capacidad por registrar";
                    toggleEdicion(false);
                    alert("Los cambios se han guardado en la base de datos.");
                } else {
                    const err = await respuesta.json().catch(() => ({}));
                    alert("Error al guardar: " + (err.mensaje || "Error desconocido"));
                }
            } catch (error) {
                alert("Ocurrió un error de conexión al servidor.");
            } finally {
                btnGuardar.disabled = false;
                btnGuardar.textContent = textoOriginal;
            }
        });
    }

    // 5. DAR DE BAJA (BAJA LÓGICA)
    const btnBajaMaquina = document.getElementById("btnBajaMaquina");
    if (btnBajaMaquina && idMaquina) {
        btnBajaMaquina.addEventListener("click", () => {
            const nombre = document.getElementById("nombreMaquinaria").textContent.trim();
            window.ejecutarBajaLogica({
                endpoint: `/api/Maquinaria/${idMaquina}`,
                nombreEntidad: `la maquinaria "${nombre}"`,
                urlRedireccion: "Maquinaria.html",
                boton: btnBajaMaquina
            });
        });
    }

    cargarDatosExpediente();
});