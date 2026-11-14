namespace MiWebAPI.Models
{
    public class CatalogoMaquinariaModel
    {
        public long Id { get; set; }
        public string Nombre { get; set; }
        public string Capacidad { get; set; }
        public string Alcance { get; set; }
        public string Categoria { get; set; }
        public string Disponibilidad { get; set; }
        public string Estado { get; set; }
        public bool DocumentosCompletos { get; set; }
        public string Documentacion { get; set; }
        public string Imagen { get; set; }
    }
}