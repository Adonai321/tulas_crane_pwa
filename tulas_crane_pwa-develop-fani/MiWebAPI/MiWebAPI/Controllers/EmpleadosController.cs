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

        [HttpDelete("{id}")]
        public IActionResult DarDeBaja(long id)
        {
            try
            {
                if (_empleadoData.DarDeBajaEmpleado(id))
                    return Ok(new { mensaje = "Empleado dado de baja correctamente." });
                return NotFound(new { mensaje = "No se encontró el empleado." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        // GET: api/Empleados/5
        [HttpGet("{id}")]
        public IActionResult GetExpediente(long id)
        {
            try
            {
                EmpleadoModel empleado = _empleadoData.ObtenerExpedientePorId(id);

                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró el empleado con el ID proporcionado." });
                }

                return Ok(empleado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        // PUT: api/Empleados/5
        [HttpPut("{id}")]
        public IActionResult EditarExpediente(long id, [FromBody] EmpleadoModel modelo)
        {
            try
            {
                modelo.Id = id;
                if (_empleadoData.EditarExpediente(modelo))
                {
                    return Ok(new { mensaje = "Información del empleado actualizada correctamente." });
                }
                return NotFound(new { mensaje = "No se encontró el empleado indicado o ya fue dado de baja." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
    }
}