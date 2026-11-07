
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;
using System;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardData _dashboardData;

        public DashboardController(DashboardData dashboardData)
        {
            _dashboardData = dashboardData;
        }

        // GET: api/Dashboard/Resumen
        [HttpGet("Resumen")]
        public IActionResult GetResumen()
        {
            try
            {
                DashboardResumenModel resumen =
                    _dashboardData.ObtenerResumenGeneral();

                return Ok(resumen);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error en el servidor.",
                    detalle = ex.Message
                });
            }
        }
    }
}
