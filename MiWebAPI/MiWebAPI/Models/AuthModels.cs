namespace MiWebAPI.Models
{
    public class LoginRequest
    {
        public string? Usuario { get; set; }
        public string? Password { get; set; } 
    }

    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string? NombreUsuario { get; set; }
    }

    public class UsuarioAuth : Usuario
    {
        public string? PasswordHash { get; set; }
    }

    public class RespuestaLogin
    {
        public bool IsSuccess { get; set; }
        public Usuario? Usuario { get; set; }
        public string? Respuesta { get; set; }
    }
}