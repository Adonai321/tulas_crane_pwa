using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthData _authData;
        private readonly IMemoryCache _cache;
        private const int MAX_INTENTOS = 3;
        private readonly TimeSpan TIEMPO_BLOQUEO = TimeSpan.FromMinutes(15);

        public AuthController(IConfiguration configuration, IMemoryCache cache)
        {
            _authData = new AuthData(configuration);
            _cache = cache;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestModel modelo)
        {
            if (modelo == null || string.IsNullOrWhiteSpace(modelo.Usuario) || string.IsNullOrWhiteSpace(modelo.Password))
                return BadRequest(new { isSuccess = false, mensaje = "Debe proporcionar el usuario y la contraseña." });

            string usuarioNormalizado = modelo.Usuario.Trim().ToLowerInvariant();
            string ipCliente = ObtenerIpCliente();

            // Clave compuesta: aisla el strike a (IP + Usuario)
            string llaveStrike = $"login_strike:{ipCliente}:{usuarioNormalizado}";

            if (_cache.TryGetValue(llaveStrike, out int intentosFallidos) && intentosFallidos >= MAX_INTENTOS)
            {
                return StatusCode(429, new
                {
                    isSuccess = false,
                    mensaje = $"Demasiados intentos fallidos para este usuario desde tu red. Intenta de nuevo en {TIEMPO_BLOQUEO.TotalMinutes} minutos."
                });
            }

            var usuarioEncontrado = _authData.ValidarUsuario(modelo.Usuario.Trim());

            if (usuarioEncontrado != null && usuarioEncontrado.Password == modelo.Password)
            {
                // Login exitoso: limpiar strikes previos de este par IP + Usuario
                _cache.Remove(llaveStrike);

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

            // Registrar strike para este par IP + Usuario
            intentosFallidos++;
            _cache.Set(llaveStrike, intentosFallidos, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TIEMPO_BLOQUEO
            });

            int restantes = MAX_INTENTOS - intentosFallidos;
            string aviso = restantes > 0
                ? $"Usuario o contraseña incorrectos. Te quedan {restantes} intento(s)."
                : $"Cuenta bloqueada temporalmente desde esta red por {TIEMPO_BLOQUEO.TotalMinutes} minutos.";

            return Unauthorized(new { isSuccess = false, mensaje = aviso });
        }

        private string ObtenerIpCliente()
        {
            // Soporta proxies inversos como Azure App Service (X-Forwarded-For)
            if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
            {
                return forwardedFor.ToString().Split(',')[0].Trim();
            }
            return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "ip-desconocida";
        }
    }
}