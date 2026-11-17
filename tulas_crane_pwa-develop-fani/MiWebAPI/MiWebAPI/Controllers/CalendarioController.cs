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
    public class CalendarioController : ControllerBase
    {
        private readonly CalendarioData _calendarioData;
        private static readonly HashSet<string> TiposManuales = new(StringComparer.OrdinalIgnoreCase)
        {
            "maniobra", "mantenimiento", "personal", "reunion", "otro"
        };

        public CalendarioController(CalendarioData calendarioData)
        {
            _calendarioData = calendarioData;
        }

        [HttpGet("Eventos")]
        public IActionResult ObtenerEventos()
        {
            try
            {
                return Ok(_calendarioData.ObtenerEventos());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al consultar eventos: " + ex.Message });
            }
        }

        [HttpPost("Registrar")]
        public IActionResult RegistrarEvento([FromBody] RegistrarEventoCalendarioModel modelo)
        {
            try
            {
                if (modelo == null || string.IsNullOrWhiteSpace(modelo.Title) ||
                    string.IsNullOrWhiteSpace(modelo.Date) || string.IsNullOrWhiteSpace(modelo.Time))
                {
                    return BadRequest(new { mensaje = "Completa el título, la fecha y la hora." });
                }

                if (!TiposManuales.Contains(modelo.Type))
                {
                    return BadRequest(new { mensaje = "Tipo de evento no permitido desde el calendario." });
                }

                if (!string.IsNullOrWhiteSpace(modelo.EndDate) && !string.IsNullOrWhiteSpace(modelo.EndTime))
                {
                    DateTime inicio = DateTime.Parse(modelo.Date).Date + TimeSpan.Parse(modelo.Time);
                    DateTime fin = DateTime.Parse(modelo.EndDate).Date + TimeSpan.Parse(modelo.EndTime);
                    if (fin <= inicio)
                    {
                        return BadRequest(new { mensaje = "La fecha y hora de término deben ser posteriores al inicio." });
                    }
                }

                if (modelo.Type.Equals("maniobra", StringComparison.OrdinalIgnoreCase))
                {
                    if (modelo.Financials == null)
                        return BadRequest(new { mensaje = "Falta la información económica de la maniobra." });

                    if (modelo.Financials.TotalToCharge < 0 || modelo.Financials.AdvanceReceived < 0 ||
                        modelo.Financials.TransportBudget < 0 || modelo.Financials.OperatorPayment < 0)
                    {
                        return BadRequest(new { mensaje = "Los importes deben ser mayores o iguales a cero." });
                    }

                    if (modelo.Financials.AdvanceReceived > modelo.Financials.TotalToCharge)
                    {
                        return BadRequest(new { mensaje = "El anticipo recibido no puede ser mayor que el importe total." });
                    }
                }

                string idCreado = _calendarioData.RegistrarEvento(modelo);
                return Ok(new { mensaje = "Evento registrado correctamente.", id = idCreado });
            }
            catch (SqlException sqlEx)
            {
                return BadRequest(new { mensaje = sqlEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al guardar el evento: " + ex.Message });
            }
        }

        [HttpPut("Lapso")]
        public IActionResult EditarLapso([FromBody] EditarLapsoEventoModel modelo)
        {
            try
            {
                if (modelo == null || modelo.IdNumerico <= 0 ||
                    string.IsNullOrWhiteSpace(modelo.EndDate) || string.IsNullOrWhiteSpace(modelo.EndTime))
                {
                    return BadRequest(new { mensaje = "Indica la nueva fecha y hora de término." });
                }

                if (!_calendarioData.EditarLapso(modelo))
                    return NotFound(new { mensaje = "No se encontró el evento." });

                return Ok(new { mensaje = "Lapso de trabajo actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al actualizar el lapso: " + ex.Message });
            }
        }

        [HttpPut("Estatus")]
        public IActionResult ActualizarEstatus([FromBody] ActualizarEstatusEventoModel modelo)
        {
            try
            {
                if (modelo == null || modelo.IdNumerico <= 0 || string.IsNullOrWhiteSpace(modelo.Status))
                {
                    return BadRequest(new { mensaje = "Datos incompletos para actualizar el estatus." });
                }

                if (!_calendarioData.ActualizarEstatus(modelo))
                    return NotFound(new { mensaje = "No se encontró el evento indicado." });

                return Ok(new { mensaje = "Estatus actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al actualizar estatus: " + ex.Message });
            }
        }

        [HttpDelete("{tipo}/{idNumerico}")]
        public IActionResult EliminarEvento(string tipo, long idNumerico)
        {
            try
            {
                if (_calendarioData.EliminarEvento(tipo, idNumerico))
                    return Ok(new { mensaje = "Evento eliminado correctamente." });

                return NotFound(new { mensaje = "No se encontró el evento." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar: " + ex.Message });
            }
        }
    }
}