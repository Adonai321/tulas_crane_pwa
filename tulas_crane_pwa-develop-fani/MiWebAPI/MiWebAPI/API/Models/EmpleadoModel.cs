namespace MiWebAPI.Models
{
    public class EmpleadoModel
    {
        public long Id { get; set; }
        public string? NumeroEmpleado { get; set; }
        public string? NombreCompleto { get; set; }
        public string Puesto { get; set; } = string.Empty;
        public string? Categoria { get; set; }
        public string? Disponibilidad { get; set; }
        public string? EstadoClase { get; set; }
        public string? Documentacion { get; set; }
        public string? Iniciales { get; set; }

        // Campos de registro y expediente
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string? ApellidoMaterno { get; set; }
        public decimal Salario { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public string RfcEmpleado { get; set; } = string.Empty;
        public string? Rfc { get; set; }
        public bool EstadoActividad { get; set; }
        public string? EstadoLaboral { get; set; }
    }
}