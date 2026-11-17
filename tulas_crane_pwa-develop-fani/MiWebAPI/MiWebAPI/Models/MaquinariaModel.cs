namespace MiWebAPI.Models
{
    public class MaquinariaModel
    {
        // Datos de la tabla datos_maquina (Registro, Expediente y Edición)
        public long Id { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public string Capacidad { get; set; }
        public string Alcance { get; set; }
        public string Tipo { get; set; }
        public int Anio { get; set; }
        public string Placas { get; set; }
        public bool EstadoActividad { get; set; }

        // Datos calculados para las tarjetas del Catálogo
        public string Nombre { get; set; }
        public string Categoria { get; set; }
        public string Disponibilidad { get; set; }
        public string Estado { get; set; }
        public bool DocumentosCompletos { get; set; } = true;
        public string Documentacion { get; set; } = "Documentación en regla";
        public string Imagen { get; set; } = "";
    }
}