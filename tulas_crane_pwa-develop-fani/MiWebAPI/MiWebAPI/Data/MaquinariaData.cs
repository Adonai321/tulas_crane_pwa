using Microsoft.Extensions.Configuration;
using MiWebAPI.Models;
using System;
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

        public long RegistrarMaquina(ExpedienteMaquinaModel oMaquinaria)
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

        public List<CatalogoMaquinariaModel> ObtenerCatalogo()
        {
            var lista = new List<CatalogoMaquinariaModel>();

            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            {
                // Cambiamos el nombre para que coincida exactamente con tu procedure en la BD
                SqlCommand cmd = new SqlCommand("SP_OBTENER_MAQUINARIA", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                conexion.Open();

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        lista.Add(new CatalogoMaquinariaModel
                        {
                            Id = Convert.ToInt64(dr["Id"]),
                            Nombre = dr["Nombre"].ToString(),
                            Capacidad = dr["Capacidad"].ToString(),
                            Alcance = dr["Alcance"].ToString(),
                            Categoria = dr["Categoria"].ToString(),
                            Disponibilidad = dr["Disponibilidad"].ToString(),
                            Estado = dr["Estado"].ToString(),
                            DocumentosCompletos = Convert.ToBoolean(dr["DocumentosCompletos"]),
                            Documentacion = dr["Documentacion"].ToString(),
                            Imagen = dr["Imagen"].ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public ExpedienteMaquinaModel ObtenerExpedientePorId(long idMaquina)
        {
            ExpedienteMaquinaModel modelo = null;

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
                        modelo = new ExpedienteMaquinaModel
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
    }
}