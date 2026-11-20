using Microsoft.Extensions.Configuration;
using MiWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class MaquinariaData
    {
        private readonly string _cadenaSQL;

        public MaquinariaData(IConfiguration configuration)
        {
            _cadenaSQL = configuration.GetConnectionString("CadenaSQL");
        }

        public long RegistrarMaquina(MaquinariaModel oMaquinaria)
        {
            long idGenerado = 0;

            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            {
                SqlCommand cmd = new SqlCommand("SP_CREAR_MAQUINA", conexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@marca", oMaquinaria.Marca);
                cmd.Parameters.AddWithValue("@modelo", oMaquinaria.Modelo);
                cmd.Parameters.AddWithValue("@capacidad", oMaquinaria.Capacidad);
                cmd.Parameters.AddWithValue("@alcance", oMaquinaria.Alcance);
                cmd.Parameters.AddWithValue("@tipo", oMaquinaria.Tipo);
                cmd.Parameters.AddWithValue("@anio", oMaquinaria.Anio);
                cmd.Parameters.AddWithValue("@placas", oMaquinaria.Placas);

                conexion.Open();
                object resultado = cmd.ExecuteScalar();
                if (resultado != null && long.TryParse(resultado.ToString(), out long id))
                {
                    idGenerado = id;
                }
            }

            return idGenerado;
        }

        public List<MaquinariaModel> ObtenerCatalogo()
        {
            var lista = new List<MaquinariaModel>();

            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            {
                SqlCommand cmd = new SqlCommand("SP_OBTENER_MAQUINARIA", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                conexion.Open();

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        lista.Add(new MaquinariaModel
                        {
                            Id = Convert.ToInt64(dr["Id"]),
                            Marca = dr["Marca"]?.ToString() ?? "",
                            Tipo = dr["Tipo"]?.ToString() ?? "",
                            Nombre = dr["Nombre"]?.ToString() ?? "",
                            Capacidad = dr["Capacidad"]?.ToString() ?? "",
                            Alcance = dr["Alcance"]?.ToString() ?? "",
                            Categoria = dr["Categoria"]?.ToString() ?? "otros",
                            Disponibilidad = dr["Disponibilidad"]?.ToString() ?? "",
                            Estado = dr["Estado"]?.ToString() ?? "disponible",
                            DocumentosCompletos = dr["DocumentosCompletos"] != DBNull.Value && Convert.ToBoolean(dr["DocumentosCompletos"]),
                            Documentacion = dr["Documentacion"]?.ToString() ?? "Documentación en regla",
                            Imagen = dr["Imagen"]?.ToString() ?? ""
                        });
                    }
                }
            }
            return lista;
        }

        public MaquinariaModel ObtenerExpedientePorId(long idMaquina)
        {
            MaquinariaModel modelo = null;

            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            {
                SqlCommand cmd = new SqlCommand("SP_OBTENER_EXPEDIENTE_MAQUINA", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_maquina", idMaquina);
                conexion.Open();

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        modelo = new MaquinariaModel
                        {
                            Id = Convert.ToInt64(dr["Id"]),
                            Marca = dr["Marca"].ToString(),
                            Modelo = dr["Modelo"].ToString(),
                            Capacidad = dr["Capacidad"].ToString(),
                            Alcance = dr["Alcance"].ToString(),
                            Tipo = dr["Tipo"].ToString(),
                            Anio = dr["Anio"] != DBNull.Value ? Convert.ToInt32(dr["Anio"]) : 0,
                            Placas = dr["Placas"].ToString(),
                            EstadoActividad = Convert.ToBoolean(dr["EstadoActividad"])
                        };
                    }
                }
            }
            return modelo;
        }

        public bool EditarExpediente(MaquinariaModel modelo)
        {
            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
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
                int filas = Convert.ToInt32(cmd.ExecuteScalar() ?? 0);
                return filas > 0;
            }
        }

        public bool DarDeBajaMaquina(long idMaquina)
        {
            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            using (SqlCommand cmd = new SqlCommand("SP_BAJA_LOGICA_MAQUINA", conexion))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_maquina", idMaquina);

                conexion.Open();
                int filas = Convert.ToInt32(cmd.ExecuteScalar() ?? 0);
                return filas > 0;
            }
        }
    }
}