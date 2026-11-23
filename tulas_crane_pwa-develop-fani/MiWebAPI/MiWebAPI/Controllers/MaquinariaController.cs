using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;
using System;
using System.Collections.Generic;
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

        // POST: api/Maquinaria/Registrar
        [HttpPost("Registrar")]
        public IActionResult Registrar([FromBody] MaquinariaModel objeto)
        {
            try
            {
                long idGenerado = _maquinariaData.RegistrarMaquina(objeto);

                if (idGenerado > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        idMaquina = idGenerado,
                        message = "Maquinaria registrada correctamente en la base de datos.",
                        numeroError = 0
                    });
                }

                return StatusCode(500, new
                {
                    success = false,
                    message = "No se pudo registrar la maquinaria.",
                    numeroError = 500
                });
            }
            catch (SqlException ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message, numeroError = ex.Number });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message, numeroError = 999 });
            }
        }

        // GET: api/Maquinaria/Catalogo
        [HttpGet("Catalogo")]
        public IActionResult GetCatalogo()
        {
            try
            {
                List<MaquinariaModel> lista = _maquinariaData.ObtenerCatalogo();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/Maquinaria/5
        [HttpGet("{id}")]
        public IActionResult GetExpediente(long id)
        {
            try
            {
                MaquinariaModel maquina = _maquinariaData.ObtenerExpedientePorId(id);

                if (maquina == null)
                {
                    return NotFound(new { message = "No se encontró la maquinaria con el ID proporcionado." });
                }

                return Ok(maquina);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // PUT: api/Maquinaria/5
        [HttpPut("{id}")]
        public IActionResult EditarExpediente(long id, [FromBody] MaquinariaModel modelo)
        {
            try
            {
                modelo.Id = id;
                if (_maquinariaData.EditarExpediente(modelo))
                {
                    return Ok(new { mensaje = "Maquinaria actualizada correctamente." });
                }
                return NotFound(new { mensaje = "No se encontró la maquinaria indicada." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        // DELETE: api/Maquinaria/5
        [HttpDelete("{id}")]
        public IActionResult DarDeBaja(long id)
        {
            try
            {
                if (_maquinariaData.DarDeBajaMaquina(id))
                {
                    return Ok(new { mensaje = "Maquinaria dada de baja correctamente." });
                }
                return NotFound(new { mensaje = "No se encontró la maquinaria." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpDelete("Permanente/{id}")]
        public IActionResult EliminarPermanente(long id)
        {
            try
            {
                if (_maquinariaData.EliminarMaquinaPermanente(id))
                    return Ok(new { success = true, mensaje = "Maquinaria eliminada físicamente de la base de datos." });

                return NotFound(new { success = false, mensaje = "No se encontró la maquinaria con ese ID." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, mensaje = ex.Message });
            }
        }
    }
}