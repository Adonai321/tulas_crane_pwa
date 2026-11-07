const empleadosGrid = document.getElementById("empleadosGrid");

if (empleadosGrid) {
    empleadosGrid.addEventListener("click", function (evento) {
        const tarjeta = evento.target.closest(".empleado-card");

        if (!tarjeta) return;

        const id = tarjeta.dataset.id;

        window.location.href = `EmpleadoDetalle.html?id=${id}`;
    });
}