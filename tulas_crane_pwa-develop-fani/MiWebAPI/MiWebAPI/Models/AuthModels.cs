namespace MiWebAPI.Models
{
    public class LoginRequestModel
    {
        public string Usuario { get; set; }
        public string Password { get; set; }
    }

    public class UsuarioModel
    {
        public long IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string Password { get; set; }
    }
}