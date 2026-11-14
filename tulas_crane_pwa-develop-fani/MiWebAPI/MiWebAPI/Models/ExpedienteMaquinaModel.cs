namespace MiWebAPI.Models
{
    public class ExpedienteMaquinaModel
    {
        public long Id { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public string Capacidad { get; set; }
        public string Alcance { get; set; }
        public string Tipo { get; set; }
        public int Anio { get; set; }
        public string Placas { get; set; }
        public bool EstadoActividad { get; set; }
    }
}