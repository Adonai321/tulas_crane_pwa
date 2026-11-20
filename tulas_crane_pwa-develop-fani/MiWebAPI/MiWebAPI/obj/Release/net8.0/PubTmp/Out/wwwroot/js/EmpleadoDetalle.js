"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. UTILIDADES Y ELEMENTOS DEL HTML
    // ==========================================
    const obtenerElemento = function (id) {
        return document.getElementById(id);
    };

    const parametros = new URLSearchParams(window.location.search);
    const empleadoId = parametros.get("id");

    if (!empleadoId) {
        alert("No se seleccionó ningún empleado.");
        window.location.href = "Empleados.html";
        return;
    }

    const foto = obtenerElemento("empleadoFoto");
    const iniciales = obtenerElemento("empleadoIniciales");
    const modal = obtenerElemento("modalDocumento");
    const selectorDocumento = obtenerElemento("selectorDocumento");

    // Datos temporales para pestañas de Documentación e Historial
    const datosComplementarios = {
        documentos: [
            { nombre: "INE", estado: "Vigente", fecha: "14/10/2030", archivo: "" },
            { nombre: "CURP", estado: "Vigente", fecha: "14/10/2030", archivo: "" },
            { nombre: "Licencia", estado: "Vigente", fecha: "14/10/2030", archivo: "" },
            { nombre: "Certificados", estado: "Vigente", fecha: "14/10/2030", archivo: "" }
        ],
        historial: [
            {
                titulo: "Expediente consultado",
                detalle: "Se abrió el expediente del empleado desde la base de datos.",
                fecha: "Hoy",
                icono: "bi-eye"
            }
        ]
    };

    // ==========================================
    // 2. CARGAR DATOS DESDE SQL SERVER (API)
    // ==========================================
    async function cargarExpedienteDesdeAPI() {
        try {
            const respuesta = await fetch(`/api/Empleados/${empleadoId}`);
            if (!respuesta.ok) {
                throw new Error("No se encontró el empleado.");
            }

            const emp = await respuesta.json();

            // Encabezado e iniciales
            obtenerElemento("empleadoNombre").textContent = emp.nombreCompleto || "Sin nombre";
            obtenerElemento("empleadoPuesto").textContent = emp.puesto || "Sin puesto";

            if (iniciales) {
                iniciales.textContent = emp.iniciales || "TC";
                iniciales.hidden = false;
            }
            if (foto) {
                foto.hidden = true;
            }

            // Estado visual de disponibilidad
            const estadoDisp = obtenerElemento("estadoDisponibilidad");
            if (estadoDisp) {
                estadoDisp.querySelector("span").textContent = emp.disponibilidad || "Disponible";
                estadoDisp.className = emp.estadoActividad
                    ? "perfil-estado disponible"
                    : "perfil-estado no-disponible";
            }

            // Tarjetas de la pestaña Información
            obtenerElemento("datoNombre").textContent = emp.nombreCompleto || "No registrado";
            obtenerElemento("datoPuesto").textContent = emp.puesto || "No registrado";
            obtenerElemento("datoNumero").textContent = emp.numeroEmpleado || `TC-${empleadoId}`;
            obtenerElemento("datoTelefono").textContent = emp.rfc || emp.rfcEmpleado || "No registrado";
            obtenerElemento("datoCorreo").textContent = emp.direccion || "No registrada";
            obtenerElemento("datoEstadoLaboral").textContent = emp.estadoLaboral || (emp.estadoActividad ? "Activo" : "Inactivo");

        } catch (error) {
            console.error("Error al cargar expediente:", error);
            alert("No se pudo cargar la información del empleado.");
            window.location.href = "Empleados.html";
        }
    }

    // ==========================================
    // 3. ICONOS Y ESTADOS DE DOCUMENTOS
    // ==========================================
    function obtenerClaseEstado(estado) {
        switch (estado) {
            case "Por vencer": return "por-vencer";
            case "Vencido": return "vencido";
            case "Pendiente": return "pendiente";
            default: return "";
        }
    }

    function obtenerIconoEstado(estado) {
        switch (estado) {
            case "Por vencer": return "bi-exclamation-circle-fill";
            case "Vencido": return "bi-x-circle-fill";
            case "Pendiente": return "bi-dash-circle-fill";
            default: return "bi-check-circle-fill";
        }
    }

    function cargarDocumentos() {
        const contenedor = obtenerElemento("documentosGrid");
        if (!contenedor) return;

        contenedor.replaceChildren();

        datosComplementarios.documentos.forEach(function (documento, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "documento-item";

            const icono = document.createElement("i");
            icono.className = "bi bi-file-earmark-text documento-icono";
            icono.setAttribute("aria-hidden", "true");

            const datos = document.createElement("div");
            datos.className = "documento-datos";

            const titulo = document.createElement("h3");
            titulo.textContent = documento.nombre;

            const estado = document.createElement("p");
            estado.className = "documento-estado " + obtenerClaseEstado(documento.estado);

            const iconoEstado = document.createElement("i");
            iconoEstado.className = "bi " + obtenerIconoEstado(documento.estado);

            const textoEstado = document.createElement("span");
            textoEstado.textContent = documento.estado;
            estado.append(iconoEstado, textoEstado);

            const fecha = document.createElement("p");
            fecha.className = "documento-fecha";
            fecha.textContent = documento.fecha === "Sin fecha registrada"
                ? documento.fecha
                : "Vence " + documento.fecha;

            datos.append(titulo, estado, fecha);

            const botonVer = document.createElement("button");
            botonVer.type = "button";
            botonVer.className = "documento-ver";
            botonVer.setAttribute("aria-label", "Visualizar " + documento.nombre);
            botonVer.innerHTML = '<i class="bi bi-eye"></i>';
            botonVer.addEventListener("click", function () {
                visualizarDocumento(indice);
            });

            tarjeta.append(icono, datos, botonVer);
            contenedor.appendChild(tarjeta);
        });
    }

    // ==========================================
    // 4. MODAL DE DOCUMENTOS
    // ==========================================
    function visualizarDocumento(indice) {
        const documento = datosComplementarios.documentos[indice];
        obtenerElemento("modalDocumentoTitulo").textContent = documento.nombre;

        const textoModal = obtenerElemento("modalDocumentoTexto");
        const nombreArchivo = obtenerElemento("modalNombreArchivo");

        if (documento.archivo) {
            textoModal.textContent = "Archivo seleccionado para este documento.";
            nombreArchivo.textContent = documento.archivo;
        } else {
            textoModal.textContent = "Este documento todavía no tiene un archivo asociado.";
            nombreArchivo.textContent = "Sin archivo adjunto";
        }

        modal.hidden = false;
        obtenerElemento("cerrarModalDocumento").focus();
    }

    function cerrarModalDocumento() {
        modal.hidden = true;
    }

    obtenerElemento("cerrarModalDocumento")?.addEventListener("click", cerrarModalDocumento);
    obtenerElemento("aceptarModalDocumento")?.addEventListener("click", cerrarModalDocumento);

    modal?.addEventListener("click", function (evento) {
        if (evento.target === modal) cerrarModalDocumento();
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && modal && !modal.hidden) {
            cerrarModalDocumento();
        }
    });

    // ==========================================
    // 5. CAMBIAR ENTRE PESTAÑAS
    // ==========================================
    function cambiarPestana(nombrePanel) {
        const pestanas = document.querySelectorAll(".detalle-tab");
        const paneles = document.querySelectorAll(".detalle-panel");

        pestanas.forEach(function (pestana) {
            const seleccionada = pestana.dataset.panel === nombrePanel;
            pestana.classList.toggle("activo", seleccionada);
            pestana.setAttribute("aria-selected", String(seleccionada));
            pestana.tabIndex = seleccionada ? 0 : -1;
        });

        paneles.forEach(function (panel) {
            panel.hidden = panel.id !== "panel-" + nombrePanel;
        });
    }

    document.querySelectorAll(".detalle-tab").forEach(function (pestana) {
        pestana.addEventListener("click", function () {
            cambiarPestana(pestana.dataset.panel);
        });
    });

    // ==========================================
    // 6. BOTONES DE ACCIÓN Y SUBIDA LOCAL
    // ==========================================
    obtenerElemento("btnEditarInfo")?.addEventListener("click", function () {
        alert("La edición de información del empleado se conectará próximamente.");
    });

    obtenerElemento("btnEditarInfoDesdeDocs")?.addEventListener("click", function () {
        cambiarPestana("informacion");
    });

    obtenerElemento("btnActualizarDocumento")?.addEventListener("click", function () {
        selectorDocumento.click();
    });

    selectorDocumento?.addEventListener("change", function (evento) {
        const archivo = evento.target.files[0];
        if (!archivo) return;

        const nombres = datosComplementarios.documentos.map(d => d.nombre);
        const eleccion = window.prompt(
            "¿A qué documento corresponde el archivo?\n\n" + nombres.join(", ") + "\n\nEscribe el nombre exacto:",
            nombres[0]
        );

        if (!eleccion) {
            evento.target.value = "";
            return;
        }

        const documento = datosComplementarios.documentos.find(
            el => el.nombre.toLocaleLowerCase("es") === eleccion.trim().toLocaleLowerCase("es")
        );

        if (!documento) {
            alert("No se encontró ese documento en el expediente.");
            evento.target.value = "";
            return;
        }

        documento.archivo = archivo.name;
        if (documento.estado === "Pendiente") documento.estado = "Vigente";
        cargarDocumentos();
        alert("Archivo seleccionado correctamente: " + archivo.name);
        evento.target.value = "";
    });

    // ==========================================
    // 7. HISTORIAL
    // ==========================================
    function cargarHistorial() {
        const contenedor = obtenerElemento("historialLista");
        if (!contenedor) return;

        contenedor.replaceChildren();
        datosComplementarios.historial.forEach(function (evento) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "historial-item";

            const icono = document.createElement("i");
            icono.className = "bi " + evento.icono;
            icono.setAttribute("aria-hidden", "true");

            const contenido = document.createElement("div");
            const titulo = document.createElement("h3");
            titulo.textContent = evento.titulo;
            const detalle = document.createElement("p");
            detalle.textContent = evento.detalle;
            const fecha = document.createElement("time");
            fecha.textContent = evento.fecha;

            contenido.append(titulo, detalle, fecha);
            tarjeta.append(icono, contenido);
            contenedor.appendChild(tarjeta);
        });
    }

    // ==========================================
    // 8. DAR DE BAJA AL EMPLEADO (BAJA LÓGICA)
    // ==========================================
    const btnBajaEmpleado = obtenerElemento("btnBajaEmpleado");
    if (btnBajaEmpleado && empleadoId) {
        btnBajaEmpleado.addEventListener("click", function () {
            const nombreActual = obtenerElemento("empleadoNombre").textContent.trim();
            window.ejecutarBajaLogica({
                endpoint: `/api/Empleados/${empleadoId}`,
                nombreEntidad: `al empleado "${nombreActual}"`,
                urlRedireccion: "Empleados.html",
                boton: btnBajaEmpleado
            });
        });
    }

    // ==========================================
    // 9. INICIAR EXPEDIENTE
    // ==========================================
    cargarExpedienteDesdeAPI();
    cargarDocumentos();
    cargarHistorial();
    cambiarPestana("informacion");
});