document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("formLogin");
    const correo = document.getElementById("correo");
    const password = document.getElementById("password"); //  Unificado con el ID del HTML
    const btnLogin = document.getElementById("btnLogin");
    const mensajeLogin = document.getElementById("mensajeLogin");
    const togglePassword = document.getElementById("togglePassword");

    // =====================================
    // MOSTRAR / OCULTAR CONTRASEÑA ("EL OJITO")
    // =====================================
    if (password && togglePassword) {
        togglePassword.addEventListener("click", function (evento) {
            evento.preventDefault();

            const esPassword = password.type === "password";
            password.type = esPassword ? "text" : "password";

            const icono = togglePassword.querySelector("i");
            if (icono) {
                icono.className = esPassword ? "bi bi-eye-slash" : "bi bi-eye";
            }

            togglePassword.setAttribute(
                "aria-label",
                esPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            );
            togglePassword.setAttribute("aria-pressed", String(esPassword));
        });
    }

    // =====================================
    // VERIFICAR ELEMENTOS DEL FORMULARIO
    // =====================================
    if (!formLogin || !correo || !password || !btnLogin || !mensajeLogin) {
        console.error("Faltan elementos del formulario de login en el HTML.");
        return;
    }

    function mostrarMensaje(texto) {
        mensajeLogin.textContent = texto;
        mensajeLogin.classList.remove("d-none");
    }

    function ocultarMensaje() {
        mensajeLogin.textContent = "";
        mensajeLogin.classList.add("d-none");
    }

    // =====================================
    // ENVIAR CREDENCIALES AL BACKEND (PROCEDURE)
    // =====================================
    formLogin.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        ocultarMensaje();

        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span>Validando acceso...</span>';

        try {
            const respuesta = await fetch("/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: correo.value.trim(),
                    password: password.value // 👈 Coincide exactamente con el modelo en C#
                })
            });

            const textoRespuesta = await respuesta.text();
            let resultado;

            try {
                resultado = textoRespuesta ? JSON.parse(textoRespuesta) : {};
            } catch {
                throw new Error("La respuesta del servidor no tiene un formato válido.");
            }

            if (!respuesta.ok || resultado.isSuccess !== true) {
                throw new Error(resultado.mensaje || "Usuario o contraseña incorrectos.");
            }

            sessionStorage.setItem("empleados_usuario", JSON.stringify(resultado.usuario));
            window.location.href = "/Dashboard.html";

        } catch (error) {
            console.error("Error:", error);
            mostrarMensaje(error.message || "Ocurrió un error al conectar con el servidor.");
        } finally {
            btnLogin.disabled = false;
            btnLogin.innerHTML = `
                <span>Iniciar sesión</span>
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
            `;
        }
    });
});