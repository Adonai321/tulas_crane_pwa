using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MiWebAPI.Models;

namespace MiWebAPI.Data
{
    public class EmpleadoData
    {
        private readonly string _cadenaSQL;

        public EmpleadoData(IConfiguration configuration)
        {
            _cadenaSQL = configuration.GetConnectionString("CadenaSQL");
        }

        public List<EmpleadoModel> ObtenerCatalogoEmpleados()
        {
            var lista = new List<EmpleadoModel>();

            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            {
                SqlCommand cmd = new SqlCommand("SP_OBTENER_EMPLEADOS", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                conexion.Open();

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        lista.Add(new EmpleadoModel
                        {
                            Id = Convert.ToInt64(dr["Id"]),
                            NombreCompleto = dr["NombreCompleto"]?.ToString() ?? "",
                            Puesto = dr["Puesto"]?.ToString() ?? "",
                            Categoria = dr["Categoria"]?.ToString() ?? "",
                            Disponibilidad = dr["Disponibilidad"]?.ToString() ?? "",
                            EstadoClase = dr["EstadoClase"]?.ToString() ?? "",
                            Documentacion = dr["Documentacion"]?.ToString() ?? "",
                            Iniciales = dr["Iniciales"]?.ToString() ?? ""
                        });
                    }
                }
            }
            return lista;
        }

        public long RegistrarEmpleado(EmpleadoModel oEmpleado)
        {
            long idGenerado = 0;

            using (SqlConnection conexion = new SqlConnection(_cadenaSQL))
            {
                SqlCommand cmd = new SqlCommand("SP_CREAR_EMPLEADO", conexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@nombre", oEmpleado.Nombre);
                cmd.Parameters.AddWithValue("@apellido_paterno", oEmpleado.ApellidoPaterno);
                cmd.Parameters.AddWithValue("@apellido_materno", (object)oEmpleado.ApellidoMaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@puesto", oEmpleado.Puesto);
                cmd.Parameters.AddWithValue("@salario", oEmpleado.Salario);
                cmd.Parameters.AddWithValue("@direccion", oEmpleado.Direccion);
                cmd.Parameters.AddWithValue("@rfc_empleado", oEmpleado.RfcEmpleado);

                conexion.Open();
                object resultado = cmd.ExecuteScalar();
                if (resultado != null && long.TryParse(resultado.ToString(), out long id))
                {
                    idGenerado = id;
                }
            }

            return idGenerado;
        }
    }
}