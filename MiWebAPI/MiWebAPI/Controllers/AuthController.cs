using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly string _connectionString;

    public AuthController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("TulasCraneDB");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("SP_ADMIN_USUARIO_LOGIN", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@usuario", request.Usuario);

                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        string dbPassword = reader["password"].ToString();

                        // I-check no agpada ti password
                        if (request.Password == dbPassword)
                        {
                            return Ok(new { success = true, mensaje = "Naimbag nga isasangpet!" });
                        }
                    }
                }
                return Unauthorized(new { success = false, mensaje = "Biddut ti usuario wenno password." });
            }
        }
    }
}