using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class AuthData
    {
        private readonly string _cadenaSQL;

        public AuthData(IConfiguration configuration)
        {
            _cadenaSQL = configuration.GetConnectionString("CadenaSQL");
        }

        public UsuarioModel ValidarUsuario(string usuario)
        {
            UsuarioModel objeto = null;

            using (var conexion = new SqlConnection(_cadenaSQL))
            {
                conexion.Open();
                using (var cmd = new SqlCommand("SP_ADMIN_USUARIO_LOGIN", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@usuario", usuario);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            objeto = new UsuarioModel()
                            {
                                IdUsuario = Convert.ToInt64(dr["id_usuario"]),
                                Usuario = dr["usuario"].ToString(),
                                Password = dr["password"].ToString()
                            };
                        }
                    }
                }
            }
            return objeto;
        }
    }
}