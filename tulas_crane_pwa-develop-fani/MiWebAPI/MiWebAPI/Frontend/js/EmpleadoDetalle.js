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
        window.location.href = "Empleados.html";
        return;
    }

    const foto = obtenerElemento("empleadoFoto");
    const iniciales = obtenerElemento("empleadoIniciales");
    const modal = obtenerElemento("modalDocumento");
    const selectorDocumento = obtenerElemento("selectorDocumento");

    let empleadoActual = null;

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

    function formatearMoneda(valor) {
        const num = Number(valor) || 0;
        return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    }

    function pintarDatosEmpleado(emp) {
        empleadoActual = emp;

        const nombreCompleto = emp.nombreCompleto ||
            [emp.nombre, emp.apellidoPaterno, emp.apellidoMaterno].filter(Boolean).join(" ") ||
            "Sin nombre";

        const ini = emp.iniciales ||
            ((emp.nombre?.[0] || "") + (emp.apellidoPaterno?.[0] || "")).toUpperCase() ||
            "TC";

        // Encabezado e iniciales
        obtenerElemento("empleadoNombre").textContent = nombreCompleto;
        obtenerElemento("empleadoPuesto").textContent = emp.puesto || "Sin puesto";

        if (iniciales) {
            iniciales.textContent = ini;
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

        // Valores en modo lectura dentro de cada tarjeta
        obtenerElemento("datoNombreSolo").textContent = emp.nombre || "No registrado";
        obtenerElemento("datoApPaterno").textContent = emp.apellidoPaterno || "No registrado";
        obtenerElemento("datoApMaterno").textContent = emp.apellidoMaterno || "—";
        obtenerElemento("datoPuesto").textContent = emp.puesto || "No registrado";
        obtenerElemento("datoSalario").textContent = formatearMoneda(emp.salario);
        obtenerElemento("datoTelefono").textContent = emp.rfc || emp.rfcEmpleado || "No registrado";
        obtenerElemento("datoCorreo").textContent = emp.direccion || "No registrada";

        const numEmp = emp.numeroEmpleado || `TC-${String(empleadoId).padStart(3, "0")}`;
        const estLab = emp.estadoLaboral || (emp.estadoActividad ? "Activo" : "Inactivo");
        obtenerElemento("datoNumeroEstado").textContent = `${numEmp} • ${estLab}`;
    }

    // ==========================================
    // 2. CARGAR DATOS DESDE SQL SERVER (API)
    // ==========================================
    async function cargarExpedienteDesdeAPI() {
        try {
            const respuesta = await fetch(`/api/Empleados/${empleadoId}`);
            if (!respuesta.ok) throw new Error("No se encontró el empleado.");

            const emp = await respuesta.json();
            pintarDatosEmpleado(emp);
        } catch (error) {
            console.error("Error al cargar expediente:", error);
            if (typeof mostrarAviso === "function") {
                mostrarAviso({
                    tipo: "error",
                    titulo: "No se pudo cargar el expediente",
                    mensaje: "No encontramos la información de este empleado. Regresarás al listado.",
                    alCerrar: () => { window.location.href = "Empleados.html"; }
                });
            }
        }
    }

    // ==========================================
    // 3. EDICIÓN DIRECTA EN LAS MISMAS TARJETAS
    // ==========================================
    const gridInfo = obtenerElemento("gridInfoEmpleado");
    const formDirecto = obtenerElemento("formInfoDirecta");
    const accionesLectura = obtenerElemento("accionesLecturaInfo");
    const accionesEdicion = obtenerElemento("accionesEdicionInfo");
    const btnEditarInfo = obtenerElemento("btnEditarInfo");
    const btnCancelarEdicion = obtenerElemento("btnCancelarEdicion");
    const btnGuardarEmpleado = obtenerElemento("btnGuardarEmpleado");

    function alternarModoEdicion(activar) {
        if (!gridInfo) return;

        if (activar && empleadoActual) {
            obtenerElemento("editNombre").value = empleadoActual.nombre || "";
            obtenerElemento("editApellidoPaterno").value = empleadoActual.apellidoPaterno || "";
            obtenerElemento("editApellidoMaterno").value = empleadoActual.apellidoMaterno || "";
            obtenerElemento("editPuesto").value = empleadoActual.puesto || "Operador";
            obtenerElemento("editSalario").value = empleadoActual.salario ?? 0;
            obtenerElemento("editRfc").value = (empleadoActual.rfc || empleadoActual.rfcEmpleado || "").toUpperCase();
            obtenerElemento("editDireccion").value = empleadoActual.direccion || "";
        }

        gridInfo.classList.toggle("modo-edicion", activar);

        // Alternar texto <-> input dentro de cada tarjeta
        gridInfo.querySelectorAll(".valor-lectura").forEach(el => el.hidden = activar);
        gridInfo.querySelectorAll(".campo-edicion").forEach(el => el.hidden = !activar);

        accionesLectura.style.display = activar ? "none" : "flex";
        accionesEdicion.hidden = !activar;
        accionesEdicion.style.display = activar ? "flex" : "none";

        if (activar) {
            obtenerElemento("editNombre")?.focus();
        }
    }

    btnEditarInfo?.addEventListener("click", () => alternarModoEdicion(true));
    btnCancelarEdicion?.addEventListener("click", () => alternarModoEdicion(false));

    formDirecto?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombreInput = obtenerElemento("editNombre");
        const apPaternoInput = obtenerElemento("editApellidoPaterno");
        const apMaternoInput = obtenerElemento("editApellidoMaterno");
        const puestoInput = obtenerElemento("editPuesto");
        const salarioInput = obtenerElemento("editSalario");
        const rfcInput = obtenerElemento("editRfc");
        const direccionInput = obtenerElemento("editDireccion");

        const nombreVal = nombreInput.value.trim();
        const apPaternoVal = apPaternoInput.value.trim();
        const apMaternoVal = apMaternoInput.value.trim();
        const puestoVal = puestoInput.value;
        const salarioVal = Number(salarioInput.value);
        const rfcVal = rfcInput.value.trim().toUpperCase();
        const direccionVal = direccionInput.value.trim();

        if (!nombreVal) {
            mostrarAviso({
                tipo: "error",
                titulo: "Falta el nombre",
                mensaje: "Por favor escribe el nombre o nombres del empleado.",
                alCerrar: () => nombreInput.focus()
            });
            return;
        }

        if (!apPaternoVal) {
            mostrarAviso({
                tipo: "error",
                titulo: "Falta el apellido paterno",
                mensaje: "Por favor escribe el apellido paterno del empleado.",
                alCerrar: () => apPaternoInput.focus()
            });
            return;
        }

        if (!Number.isFinite(salarioVal) || salarioVal <= 0) {
            mostrarAviso({
                tipo: "error",
                titulo: "Salario no válido",
                mensaje: "El salario base debe ser una cantidad mayor a cero.",
                alCerrar: () => salarioInput.focus()
            });
            return;
        }

        const formatoRFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
        if (!formatoRFC.test(rfcVal)) {
            mostrarAviso({
                tipo: "error",
                titulo: "RFC no válido",
                mensaje: "Verifica que el RFC tenga el formato correcto de 12 o 13 caracteres.",
                alCerrar: () => rfcInput.focus()
            });
            return;
        }

        if (!direccionVal) {
            mostrarAviso({
                tipo: "error",
                titulo: "Falta la dirección",
                mensaje: "Por favor escribe el domicilio del empleado.",
                alCerrar: () => direccionInput.focus()
            });
            return;
        }

        const payload = {
            id: parseInt(empleadoId, 10),
            nombre: nombreVal,
            apellidoPaterno: apPaternoVal,
            apellidoMaterno: apMaternoVal || null,
            puesto: puestoVal,
            salario: salarioVal,
            direccion: direccionVal,
            rfcEmpleado: rfcVal
        };

        const textoOriginal = btnGuardarEmpleado.innerHTML;
        try {
            btnGuardarEmpleado.disabled = true;
            btnGuardarEmpleado.innerHTML = '<i class="bi bi-hourglass-split"></i> Guardando...';

            const respuesta = await fetch(`/api/Empleados/${empleadoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await respuesta.json().catch(() => ({}));

            if (respuesta.ok) {
                const actualizado = {
                    ...empleadoActual,
                    ...payload,
                    rfc: rfcVal,
                    nombreCompleto: [nombreVal, apPaternoVal, apMaternoVal].filter(Boolean).join(" "),
                    iniciales: ((nombreVal[0] || "") + (apPaternoVal[0] || "")).toUpperCase()
                };

                pintarDatosEmpleado(actualizado);
                alternarModoEdicion(false);

                mostrarAviso({
                    tipo: "exito",
                    titulo: "¡Cambios guardados!",
                    mensaje: result.mensaje || "La información del empleado se actualizó correctamente."
                });
            } else {
                mostrarAviso({
                    tipo: "error",
                    titulo: "No se pudieron guardar los cambios",
                    mensaje: result.mensaje || "Verifica los datos ingresados e inténtalo nuevamente."
                });
            }
        } catch (error) {
            console.error("Error al actualizar empleado:", error);
            mostrarAviso({
                tipo: "error",
                titulo: "Error de conexión",
                mensaje: "No se pudo conectar con el servidor. Verifica que esté encendido."
            });
        } finally {
            btnGuardarEmpleado.disabled = false;
            btnGuardarEmpleado.innerHTML = textoOriginal;
        }
    });

    // ==========================================
    // 4. DOCUMENTOS Y MODAL
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

    obtenerElemento("btnEditarInfoDesdeDocs")?.addEventListener("click", function () {
        cambiarPestana("informacion");
        alternarModoEdicion(true);
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
            mostrarAviso({
                tipo: "error",
                titulo: "Documento no encontrado",
                mensaje: "El nombre escrito no coincide con ninguno de los documentos del expediente."
            });
            evento.target.value = "";
            return;
        }

        documento.archivo = archivo.name;
        if (documento.estado === "Pendiente") documento.estado = "Vigente";
        cargarDocumentos();

        mostrarAviso({
            tipo: "exito",
            titulo: "Archivo seleccionado",
            mensaje: `Se adjuntó "${archivo.name}" a ${documento.nombre}.`
        });
        evento.target.value = "";
    });

    // ==========================================
    // 6. HISTORIAL
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
    // 7. DAR DE BAJA AL EMPLEADO (BAJA LÓGICA CON POP-UP)
    // ==========================================
    const btnBajaEmpleado = obtenerElemento("btnBajaEmpleado");
    if (btnBajaEmpleado && empleadoId) {
        btnBajaEmpleado.addEventListener("click", function () {
            const nombreActual = obtenerElemento("empleadoNombre").textContent.trim();
            if (typeof window.ejecutarBajaLogica === "function") {
                window.ejecutarBajaLogica({
                    endpoint: `/api/Empleados/${empleadoId}`,
                    nombreEntidad: `al empleado "${nombreActual}"`,
                    urlRedireccion: "Empleados.html",
                    boton: btnBajaEmpleado
                });
            }
        });
    }

    // ==========================================
    // 8. INICIAR EXPEDIENTE
    // ==========================================
    cargarExpedienteDesdeAPI();
    cargarDocumentos();
    cargarHistorial();
    cambiarPestana("informacion");
});