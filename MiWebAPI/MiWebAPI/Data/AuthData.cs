using System.Data;
using System.Data.SqlClient;
using MiWebAPI.Models;

namespace MiWebAPI.Data
{
    public class AuthData
    {
        private readonly string conexion;

        public AuthData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<UsuarioAuth?> ObtenerUsuarioPorUsuario(string usuario)
        {
            UsuarioAuth? usuarioDb = null;

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();

                SqlCommand cmd = new SqlCommand("SP_ADMIN_USUARIO_LOGIN", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@usuario", usuario);

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        usuarioDb = new UsuarioAuth
                        {
                            IdUsuario = Convert.ToInt32(reader["id_usuario"]),
                            NombreUsuario = reader["usuario"].ToString(),
                            PasswordHash = reader["password"].ToString()
                        };
                    }
                }
            }

            return usuarioDb;
        }
    }
}