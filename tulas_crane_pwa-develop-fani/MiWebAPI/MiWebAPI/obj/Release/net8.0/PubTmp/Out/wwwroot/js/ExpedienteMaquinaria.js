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

            document.getElementById("nombreMaquinaria").textContent = maquina.marca || `${maquina.tipo} ${maquina.marca}`;
            document.getElementById("capacidadMaquinaria").textContent = `${maquina.tipo || ""} • ${maquina.capacidad || ""}`.replace(/^ • | • $/g, "");

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
            document.getElementById("alcance").value = maquina.alcance || "";
            document.getElementById("tipo").value = maquina.tipo || "";
            document.getElementById("anio").value = maquina.anio || "";
        } catch (error) {
            console.error("Error al cargar expediente:", error);
            document.getElementById("nombreMaquinaria").textContent = "Error al cargar datos";
            if (typeof mostrarAviso === "function") {
                mostrarAviso({
                    tipo: "error",
                    titulo: "Error al cargar expediente",
                    mensaje: "No se pudieron obtener los datos de esta maquinaria desde el servidor."
                });
            }
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

            const marca = document.getElementById("marca").value.trim();
            const modelo = document.getElementById("modelo").value.trim();
            const capacidad = document.getElementById("capacidad").value.trim();
            const alcance = document.getElementById("alcance").value.trim();
            const tipo = document.getElementById("tipo").value.trim();
            const anioVal = parseInt(document.getElementById("anio").value.trim(), 10);

            if (!marca || !modelo || !capacidad || !tipo || isNaN(anioVal)) {
                mostrarAviso({
                    tipo: "error",
                    titulo: "Campos incompletos",
                    mensaje: "Asegúrate de llenar correctamente la marca, modelo, capacidad, tipo y un año válido antes de guardar."
                });
                return;
            }

            const datosActualizados = {
                id: parseInt(idMaquina, 10),
                marca: marca,
                modelo: modelo,
                capacidad: capacidad,
                alcance: alcance,
                tipo: tipo,
                anio: anioVal
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

                const result = await respuesta.json().catch(() => ({}));

                if (respuesta.ok) {
                    document.getElementById("nombreMaquinaria").textContent = datosActualizados.marca;
                    document.getElementById("capacidadMaquinaria").textContent = `${datosActualizados.tipo} • ${datosActualizados.capacidad}`;
                    toggleEdicion(false);

                    mostrarAviso({
                        tipo: "exito",
                        titulo: "Cambios guardados",
                        mensaje: result.mensaje || "La información de la maquinaria se actualizó correctamente."
                    });
                } else {
                    mostrarAviso({
                        tipo: "error",
                        titulo: "No se pudieron guardar los cambios",
                        mensaje: result.mensaje || "Ocurrió un problema al actualizar la información."
                    });
                }
            } catch (error) {
                mostrarAviso({
                    tipo: "error",
                    titulo: "Error de conexión",
                    mensaje: "No se pudo conectar con el servidor. Verifica que esté encendido."
                });
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
            if (typeof window.ejecutarBajaLogica === "function") {
                window.ejecutarBajaLogica({
                    endpoint: `/api/Maquinaria/${idMaquina}`,
                    nombreEntidad: `la maquinaria "${nombre}"`,
                    urlRedireccion: "Maquinaria.html",
                    boton: btnBajaMaquina
                });
            }
        });
    }

    cargarDatosExpediente();
});