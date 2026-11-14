using Microsoft.Extensions.Configuration;
using MiWebAPI.Models;
using System;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class ExpedienteMaquinaData
    {
        private readonly string _connectionString;

        public ExpedienteMaquinaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public ExpedienteMaquinaModel ObtenerExpediente(long idMaquina)
        {
            ExpedienteMaquinaModel maquina = null;

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_OBTENER_EXPEDIENTE_MAQUINA", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_maquina", idMaquina);

                    try
                    {
                        conexion.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                maquina = new ExpedienteMaquinaModel
                                {
                                    Id = Convert.ToInt64(reader["Id"]),
                                    Marca = reader["Marca"].ToString(),
                                    Modelo = reader["Modelo"].ToString(),
                                    Capacidad = reader["Capacidad"].ToString(),
                                    Alcance = reader["Alcance"].ToString(),
                                    Tipo = reader["Tipo"].ToString(),
                                    Anio = Convert.ToInt32(reader["Anio"]),
                                    Placas = reader["Placas"].ToString(),
                                    EstadoActividad = Convert.ToBoolean(reader["EstadoActividad"])
                                };
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Error al consultar el expediente: " + ex.Message);
                    }
                }
            }
            return maquina;
        }

        public bool EditarExpediente(ExpedienteMaquinaModel modelo)
        {
            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_EDITAR_EXPEDIENTE_MAQUINA", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_maquina", modelo.Id);
                    cmd.Parameters.AddWithValue("@marca", modelo.Marca ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@modelo", modelo.Modelo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@capacidad", modelo.Capacidad ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@alcance", modelo.Alcance ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@tipo", modelo.Tipo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@anio", modelo.Anio);

                    conexion.Open();
                    int filasAfectadas = cmd.ExecuteNonQuery();
                    return filasAfectadas > 0;
                }
            }

        }
    }
}