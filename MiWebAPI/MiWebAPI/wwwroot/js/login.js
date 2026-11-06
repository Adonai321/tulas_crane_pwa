
document.addEventListener("DOMContentLoaded", function () {

    const SESSION_KEY = "empleados_usuario";

    const formLogin = document.getElementById("formLogin");
    const correo = document.getElementById("correo");
    const password = document.getElementById("password");
    const btnLogin = document.getElementById("btnLogin");
    const mensajeLogin = document.getElementById("mensajeLogin");

    // =====================================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // =====================================

    const togglePassword = document.getElementById("togglePassword");

    if (password && togglePassword) {

        togglePassword.addEventListener("click", function (evento) {

            evento.preventDefault();

            const mostrar = password.type === "password";

            password.type = mostrar ? "text" : "password";

            const icono = togglePassword.querySelector("i");

            if (icono) {
                icono.className = mostrar
                    ? "bi bi-eye-slash"
                    : "bi bi-eye";
            }

            togglePassword.setAttribute(
                "aria-label",
                mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
            );

            togglePassword.setAttribute(
                "aria-pressed",
                String(mostrar)
            );

            password.focus();
        });
    }

    // =====================================
    // VERIFICAR ELEMENTOS DEL FORMULARIO
    // =====================================

    if (!formLogin || !correo || !password || !btnLogin || !mensajeLogin) {
        console.error(
            "No se encontraron todos los elementos necesarios del login."
        );
        return;
    }

    // =====================================
    // MOSTRAR MENSAJES
    // =====================================

    function mostrarMensaje(texto) {
        mensajeLogin.textContent = texto;
        mensajeLogin.classList.remove("d-none");
    }

    function ocultarMensaje() {
        mensajeLogin.textContent = "";
        mensajeLogin.classList.add("d-none");
    }

    // =====================================
    // INICIAR SESIÓN
    // =====================================

    formLogin.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        ocultarMensaje();

        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span>Validando acceso...</span>';

        try {

            // Enviar credenciales a la API
            const respuesta = await fetch("/api/Auth/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    correo: correo.value.trim(),
                    password: password.value
                })
            });

            // Leer la respuesta del servidor
            const textoRespuesta = await respuesta.text();

            let resultado;

            try {
                resultado = textoRespuesta
                    ? JSON.parse(textoRespuesta)
                    : {};
            } catch {
                console.error(
                    "La API devolvió una respuesta que no es JSON:",
                    textoRespuesta
                );

                throw new Error(
                    "La respuesta del servidor no tiene el formato esperado."
                );
            }

            // Diagnóstico para revisar la respuesta de la API
            console.log("Estado HTTP:", respuesta.status);
            console.log("Respuesta de la API:", resultado);

            // Validar respuesta HTTP
            if (!respuesta.ok) {
                throw new Error(
                    resultado.respuesta ||
                    resultado.mensaje ||
                    resultado.message ||
                    "No fue posible iniciar sesión. Verifica tus credenciales."
                );
            }

            // Validar resultado del inicio de sesión
            if (resultado.isSuccess !== true) {
                throw new Error(
                    resultado.respuesta ||
                    resultado.mensaje ||
                    resultado.message ||
                    "El servidor no confirmó el inicio de sesión."
                );
            }

            // Verificar que la API devuelva al usuario
            if (!resultado.usuario) {
                throw new Error(
                    "La API confirmó el acceso, pero no devolvió los datos del usuario."
                );
            }

            // Guardar los datos del usuario en la sesión
            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify(resultado.usuario)
            );

            console.log("Inicio de sesión correcto. Redirigiendo...");

            // =====================================
            // REDIRIGIR AL DASHBOARD
            // =====================================

            window.location.href = "/Dashboard.html";

        } catch (error) {

            console.error("Error al iniciar sesión:", error);

            mostrarMensaje(
                error.message ||
                "Ocurrió un error al conectar con el servidor."
            );

        } finally {

            btnLogin.disabled = false;

            btnLogin.innerHTML =
                '<span>Iniciar sesión</span>' +
                '<i class="bi bi-arrow-right" aria-hidden="true"></i>';
        }

    });

});
