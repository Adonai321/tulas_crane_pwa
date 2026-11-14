"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("listaEmpleados");
    const buscador = document.getElementById("buscarEmpleado");
    const filtros = document.querySelectorAll(".filtro-btn");
    const mensajeVacio = document.getElementById("empleadosVacio");

    let listaEmpleadosGlobal = [];
    let filtroActual = "todos";

    async function cargarEmpleadosDesdeDB() {
        try {
            const respuesta = await fetch("/api/Empleados/Catalogo");
            if (!respuesta.ok) throw new Error("Error al obtener los empleados del servidor");

            listaEmpleadosGlobal = await respuesta.json();
            renderizarEmpleados();
        } catch (error) {
            console.error("Fallo la conexión con la API de empleados:", error);
            contenedor.innerHTML = `<p style="color: #ff7b7b; padding: 20px;">Error al cargar los empleados desde la base de datos.</p>`;
        }
    }

    function normalizarTexto(texto) {
        return (texto || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function renderizarEmpleados() {
        const busqueda = normalizarTexto(buscador.value.trim());
        let resultados = 0;

        contenedor.replaceChildren();

        listaEmpleadosGlobal.forEach(emp => {
            const coincideCategoria = filtroActual === "todos" || emp.categoria === filtroActual;
            const textoCompleto = normalizarTexto(`${emp.nombreCompleto} ${emp.puesto} ${emp.disponibilidad}`);
            const coincideBusqueda = textoCompleto.includes(busqueda);

            if (coincideCategoria && coincideBusqueda) {
                resultados++;

                const article = document.createElement("article");
                article.className = "empleado-card";
                article.setAttribute("data-categoria", emp.categoria);

                article.innerHTML = `
                    <div class="empleado-foto">
                        <div class="empleado-avatar-fallback">${emp.iniciales || 'TC'}</div>
                    </div>
                    <div class="empleado-info">
                        <h2>${emp.nombreCompleto}</h2>
                        <p class="empleado-puesto">${emp.puesto}</p>
                        <div class="empleado-estados">
                            <p class="estado ${emp.estadoClase}">
                                <i class="bi bi-check-circle-fill"></i>
                                ${emp.disponibilidad}
                            </p>
                            <p class="estado documentacion-ok">
                                <i class="bi bi-check-circle-fill"></i>
                                ${emp.documentacion}
                            </p>
                        </div>
                    </div>
                    <a href="ExpedienteEmpleado.html?id=${emp.id}" class="empleado-detalle" aria-label="Ver expediente de ${emp.nombreCompleto}">
                        <i class="bi bi-arrow-right"></i>
                    </a>
                `;
                contenedor.appendChild(article);
            }
        });

        mensajeVacio.hidden = resultados !== 0;
    }

    buscador.addEventListener("input", renderizarEmpleados);

    filtros.forEach(boton => {
        boton.addEventListener("click", function () {
            filtros.forEach(f => f.classList.remove("activo"));
            boton.classList.add("activo");
            filtroActual = boton.dataset.filtro;
            renderizarEmpleados();
        });
    });

    cargarEmpleadosDesdeDB();
});