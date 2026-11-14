using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpedienteMaquinaController : ControllerBase
    {
        private readonly MaquinariaData _maquinariaData;

        public ExpedienteMaquinaController(MaquinariaData maquinariaData)
        {
            _maquinariaData = maquinariaData;
        }

        // GET: api/ExpedienteMaquina/5
        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            try
            {
                ExpedienteMaquinaModel maquina = _maquinariaData.ObtenerExpedientePorId(id);

                if (maquina == null)
                {
                    return NotFound(new { message = "No se encontró la maquinaria con el ID proporcionado." });
                }

                return StatusCode(StatusCodes.Status200OK, maquina);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
    }
}