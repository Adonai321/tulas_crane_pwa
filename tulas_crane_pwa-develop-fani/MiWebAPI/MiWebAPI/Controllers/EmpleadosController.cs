using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadosController : ControllerBase
    {
        private readonly EmpleadoData _empleadoData;

        public EmpleadosController(EmpleadoData empleadoData)
        {
            _empleadoData = empleadoData;
        }

        [HttpGet("Catalogo")]
        public IActionResult GetCatalogo()
        {
            try
            {
                List<EmpleadoModel> lista = _empleadoData.ObtenerCatalogoEmpleados();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("Registrar")]
        public IActionResult Registrar([FromBody] EmpleadoModel objeto)
        {
            try
            {
                long idGenerado = _empleadoData.RegistrarEmpleado(objeto);

                if (idGenerado > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        success = true,
                        idEmpleado = idGenerado,
                        message = "Empleado registrado correctamente en la base de datos.",
                        numeroError = 0
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        success = false,
                        message = "No se pudo registrar al empleado en la base de datos.",
                        numeroError = 500
                    });
                }
            }
            catch (SqlException ex)
            {
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
                    message = ex.Message ?? "Error interno del servidor.",
                    numeroError = 999
                });
            }
        }
    }
}