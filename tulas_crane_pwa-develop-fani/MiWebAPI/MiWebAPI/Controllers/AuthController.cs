using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthData _authData;

        public AuthController(IConfiguration configuration)
        {
            _authData = new AuthData(configuration);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestModel modelo)
        {
            if (modelo == null || string.IsNullOrWhiteSpace(modelo.Usuario) || string.IsNullOrWhiteSpace(modelo.Password))
            {
                return BadRequest(new { isSuccess = false, mensaje = "Debe proporcionar el usuario y la contraseña." });
            }

            // Consultar usuario en la base de datos mediante el procedure original
            var usuarioEncontrado = _authData.ValidarUsuario(modelo.Usuario.Trim());

            // Validar credenciales
            if (usuarioEncontrado != null && usuarioEncontrado.Password == modelo.Password)
            {
                return Ok(new
                {
                    isSuccess = true,
                    mensaje = "Inicio de sesión exitoso",
                    usuario = new
                    {
                        id = usuarioEncontrado.IdUsuario,
                        nombre = usuarioEncontrado.Usuario
                    }
                });
            }

            return Unauthorized(new { isSuccess = false, mensaje = "Usuario o contraseña incorrectos." });
        }
    }
}