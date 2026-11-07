using System;
using System.Data;
using System.Data.SqlClient;
using MiWebAPI.Models;

namespace MiWebAPI.Data
{
    public class DashboardData
    {
        private readonly string _connectionString;

        public DashboardData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }
        public DashboardResumenModel ObtenerResumenGeneral()
        {
            DashboardResumenModel resumen = new DashboardResumenModel();

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_DASHBOARD_RESUMEN", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    try
                    {
                        conexion.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                resumen.TotalCotizaciones = Convert.ToInt32(reader["TotalCotizaciones"]);
                                resumen.TotalManiobras = Convert.ToInt32(reader["TotalManiobras"]);
                                resumen.TotalMaquinaria = Convert.ToInt32(reader["TotalMaquinaria"]);
                                resumen.TotalEmpleados = Convert.ToInt32(reader["TotalEmpleados"]);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        // Maneja el error según tu arquitectura (logs, etc.)
                        throw new Exception("Error al obtener datos del Dashboard: " + ex.Message);
                    }
                }
            }

            return resumen;
        }
    }
}