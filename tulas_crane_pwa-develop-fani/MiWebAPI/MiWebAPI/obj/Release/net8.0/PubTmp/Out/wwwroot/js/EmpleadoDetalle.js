
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. DATOS DE PRUEBA
    // Después se conectarán con la API y SQL Server.
    // ==========================================

    const empleados = {
        "1": {
            id: "1",
            numero: "TC-001",
            nombre: "Juan Pérez",
            puesto: "Operador",
            iniciales: "JP",
            foto: "IMG/empleados/juan-perez.png",
            disponibilidad: "Disponible",
            documentacion: "Documentación completa",
            telefono: "771 000 0000",
            correo: "juan.perez@tulascrane.mx",
            estadoLaboral: "Activo",

            documentos: [
                {
                    nombre: "INE",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "CURP",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "Licencia",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "Certificados",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                }
            ],

            historial: [
                {
                    titulo: "Expediente consultado",
                    detalle: "Se abrió el expediente del empleado.",
                    fecha: "Hoy",
                    icono: "bi-eye"
                },
                {
                    titulo: "Documentación revisada",
                    detalle: "Los documentos aparecen vigentes en los datos de prueba.",
                    fecha: "14/10/2026",
                    icono: "bi-file-earmark-check"
                },
                {
                    titulo: "Empleado registrado",
                    detalle: "Registro de demostración.",
                    fecha: "01/09/2026",
                    icono: "bi-person-check"
                }
            ]
        },

        "2": {
            id: "2",
            numero: "TC-002",
            nombre: "Ana Torres",
            puesto: "Administración",
            iniciales: "AT",
            foto: "IMG/empleados/ana-torres.png",
            disponibilidad: "Disponible",
            documentacion: "Documentación completa",
            telefono: "771 000 0001",
            correo: "ana.torres@tulascrane.mx",
            estadoLaboral: "Activo",

            documentos: [
                {
                    nombre: "INE",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "CURP",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "Comprobante de domicilio",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "Contrato",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                }
            ],

            historial: [
                {
                    titulo: "Expediente consultado",
                    detalle: "Se abrió el expediente del empleado.",
                    fecha: "Hoy",
                    icono: "bi-eye"
                },
                {
                    titulo: "Empleado registrado",
                    detalle: "Registro de demostración.",
                    fecha: "01/09/2026",
                    icono: "bi-person-check"
                }
            ]
        },

        "3": {
            id: "3",
            numero: "TC-003",
            nombre: "Carlos Hernández",
            puesto: "Operador",
            iniciales: "CH",
            foto: "IMG/empleados/carlos-hernandez.png",
            disponibilidad: "En maniobra",
            documentacion: "1 documento por vencer",
            telefono: "771 000 0002",
            correo: "carlos.hernandez@tulascrane.mx",
            estadoLaboral: "Activo",

            documentos: [
                {
                    nombre: "INE",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "CURP",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "Licencia",
                    estado: "Por vencer",
                    fecha: "20/11/2026",
                    archivo: ""
                },
                {
                    nombre: "Certificados",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                }
            ],

            historial: [
                {
                    titulo: "Asignado a maniobra",
                    detalle: "Actualmente aparece en maniobra en los datos de prueba.",
                    fecha: "Hoy",
                    icono: "bi-truck"
                },
                {
                    titulo: "Documento por vencer",
                    detalle: "La licencia requiere revisión próxima.",
                    fecha: "20/11/2026",
                    icono: "bi-exclamation-circle"
                }
            ]
        },

        "4": {
            id: "4",
            numero: "TC-004",
            nombre: "Jorge Estrada",
            puesto: "Maniobrista",
            iniciales: "JE",
            foto: "IMG/empleados/jorge-estrada.png",
            disponibilidad: "Disponible",
            documentacion: "Documentación pendiente de revisar",
            telefono: "771 000 0003",
            correo: "jorge.estrada@tulascrane.mx",
            estadoLaboral: "Activo",

            documentos: [
                {
                    nombre: "INE",
                    estado: "Vigente",
                    fecha: "14/10/2030",
                    archivo: ""
                },
                {
                    nombre: "CURP",
                    estado: "Pendiente",
                    fecha: "Sin fecha registrada",
                    archivo: ""
                },
                {
                    nombre: "Certificados",
                    estado: "Pendiente",
                    fecha: "Sin fecha registrada",
                    archivo: ""
                }
            ],

            historial: [
                {
                    titulo: "Expediente consultado",
                    detalle: "Se abrió el expediente del empleado.",
                    fecha: "Hoy",
                    icono: "bi-eye"
                },
                {
                    titulo: "Documentación pendiente",
                    detalle: "Hay documentos que deben revisarse o cargarse.",
                    fecha: "01/11/2026",
                    icono: "bi-file-earmark"
                }
            ]
        }
    };


    // ==========================================
    // 2. IDENTIFICAR AL EMPLEADO SELECCIONADO
    // ==========================================

    const parametros = new URLSearchParams(
        window.location.search
    );

    const empleadoId = parametros.get("id") || "1";

    const empleado = empleados[empleadoId];

    if (!empleado) {
        alert("No se encontró el empleado solicitado.");

        window.location.href = "Empleados.html";

        return;
    }


    // ==========================================
    // 3. ELEMENTOS DEL HTML
    // ==========================================

    const obtenerElemento = function (id) {
        return document.getElementById(id);
    };

    const foto = obtenerElemento("empleadoFoto");
    const iniciales = obtenerElemento("empleadoIniciales");

    const modal = obtenerElemento("modalDocumento");

    const selectorDocumento = obtenerElemento(
        "selectorDocumento"
    );


    // ==========================================
    // 4. MOSTRAR INFORMACIÓN DEL EMPLEADO
    // ==========================================

    function cargarInformacionEmpleado() {

        obtenerElemento("empleadoNombre").textContent =
            empleado.nombre;

        obtenerElemento("empleadoPuesto").textContent =
            empleado.puesto;

        obtenerElemento("datoNombre").textContent =
            empleado.nombre;

        obtenerElemento("datoPuesto").textContent =
            empleado.puesto;

        obtenerElemento("datoNumero").textContent =
            empleado.numero;

        obtenerElemento("datoTelefono").textContent =
            empleado.telefono;

        obtenerElemento("datoCorreo").textContent =
            empleado.correo;

        obtenerElemento("datoEstadoLaboral").textContent =
            empleado.estadoLaboral;

        // Fotografía del empleado.
        foto.src = empleado.foto;
        foto.alt = "Fotografía de " + empleado.nombre;

        foto.hidden = false;
        iniciales.hidden = true;

        // Si no existe la fotografía, mostrar iniciales.
        foto.onerror = function () {
            foto.hidden = true;
            iniciales.textContent = empleado.iniciales;
            iniciales.hidden = false;
        };

        // Estado de disponibilidad.
        const estadoDisponibilidad = obtenerElemento(
            "estadoDisponibilidad"
        );

        const estaEnManiobra =
            empleado.disponibilidad === "En maniobra";

        estadoDisponibilidad.className =
            "perfil-estado " +
            (estaEnManiobra ? "en-maniobra" : "disponible");

        estadoDisponibilidad.replaceChildren();

        const iconoDisponibilidad =
            document.createElement("i");

        iconoDisponibilidad.className =
            "bi " +
            (estaEnManiobra
                ? "bi-clock-fill"
                : "bi-check-circle-fill");

        const textoDisponibilidad =
            document.createElement("span");

        textoDisponibilidad.textContent =
            empleado.disponibilidad;

        estadoDisponibilidad.append(
            iconoDisponibilidad,
            textoDisponibilidad
        );

        // Estado de documentación.
        const estadoDocumentacion = obtenerElemento(
            "estadoDocumentacion"
        );

        const documentacionCompleta =
            empleado.documentacion ===
            "Documentación completa";

        estadoDocumentacion.className =
            "perfil-estado " +
            (documentacionCompleta
                ? "documentacion-ok"
                : "en-maniobra");

        estadoDocumentacion.replaceChildren();

        const iconoDocumentacion =
            document.createElement("i");

        iconoDocumentacion.className =
            "bi " +
            (documentacionCompleta
                ? "bi-check-circle-fill"
                : "bi-exclamation-circle-fill");

        const textoDocumentacion =
            document.createElement("span");

        textoDocumentacion.textContent =
            empleado.documentacion;

        estadoDocumentacion.append(
            iconoDocumentacion,
            textoDocumentacion
        );
    }


    // ==========================================
    // 5. ICONOS Y ESTADOS DE LOS DOCUMENTOS
    // ==========================================

    function obtenerClaseEstado(estado) {

        switch (estado) {

            case "Por vencer":
                return "por-vencer";

            case "Vencido":
                return "vencido";

            case "Pendiente":
                return "pendiente";

            default:
                return "";
        }
    }


    function obtenerIconoEstado(estado) {

        switch (estado) {

            case "Por vencer":
                return "bi-exclamation-circle-fill";

            case "Vencido":
                return "bi-x-circle-fill";

            case "Pendiente":
                return "bi-dash-circle-fill";

            default:
                return "bi-check-circle-fill";
        }
    }


    // ==========================================
    // 6. MOSTRAR DOCUMENTOS
    // ==========================================

    function cargarDocumentos() {

        const contenedor = obtenerElemento(
            "documentosGrid"
        );

        contenedor.replaceChildren();

        empleado.documentos.forEach(
            function (documento, indice) {

                const tarjeta = document.createElement(
                    "article"
                );

                tarjeta.className = "documento-item";

                // Icono del documento.
                const icono = document.createElement("i");

                icono.className =
                    "bi bi-file-earmark-text documento-icono";

                icono.setAttribute("aria-hidden", "true");

                // Información del documento.
                const datos = document.createElement("div");

                datos.className = "documento-datos";

                const titulo = document.createElement("h3");

                titulo.textContent = documento.nombre;

                // Estado del documento.
                const estado = document.createElement("p");

                estado.className =
                    "documento-estado " +
                    obtenerClaseEstado(documento.estado);

                const iconoEstado = document.createElement("i");

                iconoEstado.className =
                    "bi " + obtenerIconoEstado(documento.estado);

                const textoEstado = document.createElement("span");

                textoEstado.textContent = documento.estado;

                estado.append(iconoEstado, textoEstado);

                // Fecha de vencimiento.
                const fecha = document.createElement("p");

                fecha.className = "documento-fecha";

                if (
                    documento.fecha === "Sin fecha registrada"
                ) {
                    fecha.textContent = documento.fecha;
                } else {
                    fecha.textContent =
                        "Vence " + documento.fecha;
                }

                datos.append(titulo, estado, fecha);

                // Botón para visualizar el documento.
                const botonVer = document.createElement("button");

                botonVer.type = "button";

                botonVer.className = "documento-ver";

                botonVer.setAttribute(
                    "aria-label",
                    "Visualizar " + documento.nombre
                );

                botonVer.innerHTML =
                    '<i class="bi bi-eye"></i>';

                botonVer.addEventListener(
                    "click",
                    function () {
                        visualizarDocumento(indice);
                    }
                );

                tarjeta.append(
                    icono,
                    datos,
                    botonVer
                );

                contenedor.appendChild(tarjeta);
            }
        );
    }


    // ==========================================
    // 7. VISUALIZAR DOCUMENTO
    // ==========================================

    function visualizarDocumento(indice) {

        const documento = empleado.documentos[indice];

        obtenerElemento(
            "modalDocumentoTitulo"
        ).textContent = documento.nombre;

        const textoModal = obtenerElemento(
            "modalDocumentoTexto"
        );

        const nombreArchivo = obtenerElemento(
            "modalNombreArchivo"
        );

        if (documento.archivo) {

            textoModal.textContent =
                "Archivo seleccionado para este documento. " +
                "En esta versión de demostración no se guarda " +
                "ni se recupera desde un servidor.";

            nombreArchivo.textContent =
                documento.archivo;

        } else {

            textoModal.textContent =
                "Este documento todavía no tiene un archivo " +
                "asociado en la demostración. Cuando se conecte " +
                "la API, aquí podrá mostrarse el archivo guardado.";

            nombreArchivo.textContent =
                "Sin archivo adjunto";
        }

        modal.hidden = false;

        obtenerElemento(
            "cerrarModalDocumento"
        ).focus();
    }


    // ==========================================
    // 8. CERRAR VENTANA DE DOCUMENTOS
    // ==========================================

    function cerrarModalDocumento() {

        modal.hidden = true;
    }

    obtenerElemento(
        "cerrarModalDocumento"
    ).addEventListener(
        "click",
        cerrarModalDocumento
    );

    obtenerElemento(
        "aceptarModalDocumento"
    ).addEventListener(
        "click",
        cerrarModalDocumento
    );

    modal.addEventListener(
        "click",
        function (evento) {

            if (evento.target === modal) {
                cerrarModalDocumento();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape" &&
                !modal.hidden
            ) {
                cerrarModalDocumento();
            }
        }
    );


    // ==========================================
    // 9. CAMBIAR ENTRE PESTAÑAS
    // ==========================================

    function cambiarPestana(nombrePanel) {

        const pestañas = document.querySelectorAll(
            ".detalle-tab"
        );

        const paneles = document.querySelectorAll(
            ".detalle-panel"
        );

        pestañas.forEach(function (pestana) {

            const seleccionada =
                pestana.dataset.panel === nombrePanel;

            pestana.classList.toggle(
                "activo",
                seleccionada
            );

            pestana.setAttribute(
                "aria-selected",
                String(seleccionada)
            );

            pestana.tabIndex = seleccionada ? 0 : -1;
        });

        paneles.forEach(function (panel) {

            panel.hidden =
                panel.id !== "panel-" + nombrePanel;
        });
    }


    document.querySelectorAll(
        ".detalle-tab"
    ).forEach(function (pestana) {

        pestana.addEventListener(
            "click",
            function () {

                cambiarPestana(
                    pestana.dataset.panel
                );
            }
        );
    });


    // ==========================================
    // 10. BOTÓN EDITAR INFORMACIÓN
    // ==========================================

    function editarInformacion() {

        alert(
            "La edición de información se conectará " +
            "posteriormente con el formulario y la API. " +
            "Por ahora, los datos son de demostración."
        );
    }

    obtenerElemento(
        "btnEditarInfo"
    ).addEventListener(
        "click",
        editarInformacion
    );

    obtenerElemento(
        "btnEditarInfoDesdeDocs"
    ).addEventListener(
        "click",
        function () {

            cambiarPestana("informacion");
        }
    );


    // ==========================================
    // 11. ACTUALIZAR DOCUMENTO
    // ==========================================

    obtenerElemento(
        "btnActualizarDocumento"
    ).addEventListener(
        "click",
        function () {

            selectorDocumento.click();
        }
    );


    selectorDocumento.addEventListener(
        "change",
        function (evento) {

            const archivo =
                evento.target.files[0];

            if (!archivo) {
                return;
            }

            const nombres = empleado.documentos.map(
                function (documento) {
                    return documento.nombre;
                }
            );

            const eleccion = window.prompt(
                "¿A qué documento corresponde el archivo?\n\n" +
                nombres.join(", ") +
                "\n\nEscribe el nombre exacto:",
                nombres[0]
            );

            if (!eleccion) {
                evento.target.value = "";
                return;
            }

            const documento = empleado.documentos.find(
                function (elemento) {

                    return elemento.nombre.toLocaleLowerCase("es") ===
                        eleccion.trim().toLocaleLowerCase("es");
                }
            );

            if (!documento) {

                alert(
                    "No se encontró ese documento en el expediente. " +
                    "Verifica el nombre e inténtalo de nuevo."
                );

                evento.target.value = "";

                return;
            }

            // Guardar únicamente el nombre en memoria.
            // Todavía no se sube a SQL Server.
            documento.archivo = archivo.name;

            if (documento.estado === "Pendiente") {
                documento.estado = "Vigente";
            }

            cargarDocumentos();

            alert(
                "Archivo seleccionado correctamente:\n\n" +
                archivo.name +
                "\n\nImportante: este archivo todavía no se ha " +
                "subido a un servidor ni guardado en SQL Server."
            );

            evento.target.value = "";
        }
    );


    // ==========================================
    // 12. MOSTRAR HISTORIAL
    // ==========================================

    function cargarHistorial() {

        const contenedor = obtenerElemento(
            "historialLista"
        );

        contenedor.replaceChildren();

        empleado.historial.forEach(function (evento) {

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

            contenido.append(
                titulo,
                detalle,
                fecha
            );

            tarjeta.append(
                icono,
                contenido
            );

            contenedor.appendChild(tarjeta);
        });
    }


    // ==========================================
    // 13. INICIAR EXPEDIENTE
    // ==========================================

    cargarInformacionEmpleado();

    cargarDocumentos();

    cargarHistorial();

    // Mostrar documentación al entrar.
    cambiarPestana("documentacion");

});
