using Microsoft.Extensions.Configuration;
using MiWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class CalendarioData
    {
        private readonly string _cadenaSQL;

        public CalendarioData(IConfiguration configuration)
        {
            _cadenaSQL = configuration.GetConnectionString("CadenaSQL") ?? string.Empty;
        }

        public List<EventoCalendarioItemModel> ObtenerEventos()
        {
            var lista = new List<EventoCalendarioItemModel>();

            using (var conexion = new SqlConnection(_cadenaSQL))
            using (var cmd = new SqlCommand("SP_OBTENER_EVENTOS_CALENDARIO", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                conexion.Open();

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        string tipo = dr["Type"]?.ToString() ?? "otro";
                        ManiobraFinancialsModel? financials = null;

                        if (tipo == "maniobra")
                        {
                            decimal total = dr["TotalToCharge"] != DBNull.Value ? Convert.ToDecimal(dr["TotalToCharge"]) : 0;
                            decimal anticipo = dr["AdvanceReceived"] != DBNull.Value ? Convert.ToDecimal(dr["AdvanceReceived"]) : 0;
                            decimal traslado = dr["TransportBudget"] != DBNull.Value ? Convert.ToDecimal(dr["TransportBudget"]) : 0;
                            decimal operador = dr["OperatorPayment"] != DBNull.Value ? Convert.ToDecimal(dr["OperatorPayment"]) : 0;

                            financials = new ManiobraFinancialsModel
                            {
                                TotalToCharge = total,
                                AdvanceReceived = anticipo,
                                TransportBudget = traslado,
                                OperatorPayment = operador,
                                RemainingToCollect = total - anticipo,
                                EstimatedMargin = total - operador - traslado
                            };
                        }

                        lista.Add(new EventoCalendarioItemModel
                        {
                            Id = dr["Id"]?.ToString() ?? "",
                            IdNumerico = Convert.ToInt64(dr["IdNumerico"]),
                            Type = tipo,
                            Title = dr["Title"]?.ToString() ?? "",
                            Date = dr["Date"]?.ToString() ?? "",
                            Time = dr["Time"]?.ToString() ?? "",
                            EndDate = dr["EndDate"]?.ToString() ?? "",
                            EndTime = dr["EndTime"]?.ToString() ?? "",
                            Plazo = dr["Plazo"]?.ToString() ?? "",
                            Description = dr["Description"]?.ToString() ?? "",
                            Employee = dr["Employee"]?.ToString() ?? "",
                            Subtype = dr["Subtype"]?.ToString() ?? "",
                            Machinery = dr["Machinery"]?.ToString() ?? "",
                            Place = dr["Place"]?.ToString() ?? "",
                            Contact = dr["Contact"]?.ToString() ?? "",
                            Financials = financials,
                            Source = "manual",
                            Status = dr["Status"]?.ToString() ?? "Pendiente"
                        });
                    }
                }
            }

            return lista;
        }

        public string RegistrarEvento(RegistrarEventoCalendarioModel modelo)
        {
            using (var conexion = new SqlConnection(_cadenaSQL))
            using (var cmd = new SqlCommand("SP_REGISTRAR_EVENTO_CALENDARIO", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@tipo_evento", modelo.Type);
                cmd.Parameters.AddWithValue("@subtipo_evento", string.IsNullOrWhiteSpace(modelo.Subtype) ? DBNull.Value : modelo.Subtype.Trim());
                cmd.Parameters.AddWithValue("@titulo", modelo.Title.Trim());
                cmd.Parameters.AddWithValue("@fecha", DateTime.Parse(modelo.Date).Date);
                cmd.Parameters.AddWithValue("@hora", TimeSpan.Parse(modelo.Time));
                cmd.Parameters.AddWithValue("@fecha_fin", !string.IsNullOrWhiteSpace(modelo.EndDate) ? DateTime.Parse(modelo.EndDate).Date : DBNull.Value);
                cmd.Parameters.AddWithValue("@hora_fin", !string.IsNullOrWhiteSpace(modelo.EndTime) ? TimeSpan.Parse(modelo.EndTime) : DBNull.Value);
                cmd.Parameters.AddWithValue("@plazo", string.IsNullOrWhiteSpace(modelo.Plazo) ? DBNull.Value : modelo.Plazo.Trim());
                cmd.Parameters.AddWithValue("@descripcion", string.IsNullOrWhiteSpace(modelo.Description) ? DBNull.Value : modelo.Description.Trim());
                cmd.Parameters.AddWithValue("@id_empleado", modelo.IdEmpleado.HasValue && modelo.IdEmpleado.Value > 0 ? modelo.IdEmpleado.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@id_maquina", modelo.IdMaquina.HasValue && modelo.IdMaquina.Value > 0 ? modelo.IdMaquina.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@lugar", string.IsNullOrWhiteSpace(modelo.Place) ? DBNull.Value : modelo.Place.Trim());
                cmd.Parameters.AddWithValue("@contacto_cliente", string.IsNullOrWhiteSpace(modelo.Contact) ? DBNull.Value : modelo.Contact.Trim());

                var fin = modelo.Financials ?? new ManiobraFinancialsModel();
                cmd.Parameters.AddWithValue("@importe_cobrar", fin.TotalToCharge);
                cmd.Parameters.AddWithValue("@anticipo_recibido", fin.AdvanceReceived);
                cmd.Parameters.AddWithValue("@presupuesto_traslado", fin.TransportBudget);
                cmd.Parameters.AddWithValue("@pago_operador", fin.OperatorPayment);

                conexion.Open();
                object? result = cmd.ExecuteScalar();
                return result?.ToString() ?? string.Empty;
            }
        }

        public bool EditarLapso(EditarLapsoEventoModel modelo)
        {
            using (var conexion = new SqlConnection(_cadenaSQL))
            using (var cmd = new SqlCommand("SP_EDITAR_LAPSO_EVENTO", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@tipo_evento", modelo.Type);
                cmd.Parameters.AddWithValue("@id_numerico", modelo.IdNumerico);
                cmd.Parameters.AddWithValue("@fecha_fin", DateTime.Parse(modelo.EndDate).Date);
                cmd.Parameters.AddWithValue("@hora_fin", TimeSpan.Parse(modelo.EndTime));
                cmd.Parameters.AddWithValue("@plazo", string.IsNullOrWhiteSpace(modelo.Plazo) ? DBNull.Value : modelo.Plazo.Trim());

                conexion.Open();
                cmd.ExecuteNonQuery();
                return true;
            }
        }

        public bool ActualizarEstatus(ActualizarEstatusEventoModel modelo)
        {
            using (var conexion = new SqlConnection(_cadenaSQL))
            using (var cmd = new SqlCommand("SP_ACTUALIZAR_ESTATUS_EVENTO", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@tipo_evento", modelo.Type);
                cmd.Parameters.AddWithValue("@id_numerico", modelo.IdNumerico);
                cmd.Parameters.AddWithValue("@estatus", modelo.Status);

                conexion.Open();
                int filas = Convert.ToInt32(cmd.ExecuteScalar() ?? 0);
                return filas > 0;
            }
        }

        public bool EliminarEvento(string tipo, long idNumerico)
        {
            using (var conexion = new SqlConnection(_cadenaSQL))
            using (var cmd = new SqlCommand("SP_BAJA_EVENTO_CALENDARIO", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@tipo_evento", tipo);
                cmd.Parameters.AddWithValue("@id_numerico", idNumerico);

                conexion.Open();
                int filas = Convert.ToInt32(cmd.ExecuteScalar() ?? 0);
                return filas > 0;
            }
        }

        public bool EliminarEventoPermanente(string tipo, long idNumerico)
        {
            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_EVENTO_PERMANENTE", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@tipo_evento", tipo);
                cmd.Parameters.AddWithValue("@id_numerico", idNumerico);

                conexion.Open();
                int filas = Convert.ToInt32(cmd.ExecuteScalar() ?? 0);
                return filas > 0;
            }
        }
    }
}