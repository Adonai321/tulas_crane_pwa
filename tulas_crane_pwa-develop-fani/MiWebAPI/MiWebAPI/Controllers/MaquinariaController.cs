using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;
using System.Data.SqlClient;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaquinariaController : ControllerBase
    {
        private readonly MaquinariaData _maquinariaData;

        public MaquinariaController(MaquinariaData maquinariaData)
        {
            _maquinariaData = maquinariaData;
        }

        [HttpPost("Registrar")]
        public IActionResult Registrar([FromBody] ExpedienteMaquinaModel objeto)
        {
            try
            {
                long idGenerado = _maquinariaData.RegistrarMaquina(objeto);

                if (idGenerado > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        success = true,
                        idMaquina = idGenerado,
                        message = "Maquinaria registrada correctamente en la base de datos.",
                        numeroError = 0
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        success = false,
                        message = "No se pudo registrar la maquinaria.",
                        numeroError = 500
                    });
                }
            }
            catch (SqlException ex)
            {
                // Captura el número de error específico de SQL Server
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    message = ex.Message,
                    numeroError = ex.Number
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    message = ex.Message,
                    numeroError = 999
                });
            }
        }

        [HttpGet("Catalogo")]
        public IActionResult GetCatalogo()
        {
            try
            {
                List<CatalogoMaquinariaModel> lista = _maquinariaData.ObtenerCatalogo();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
    }
}