namespace MiWebAPI.Models
{
    public class RegistrarEventoCalendarioModel
    {
        public string Type { get; set; } = string.Empty;
        public string? Subtype { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string? EndDate { get; set; }
        public string? EndTime { get; set; }
        public string? Plazo { get; set; }
        public string? Description { get; set; }
        public long? IdEmpleado { get; set; }
        public long? IdMaquina { get; set; }
        public string? Place { get; set; }
        public string? Contact { get; set; }
        public ManiobraFinancialsModel? Financials { get; set; }
    }

    public class ManiobraFinancialsModel
    {
        public decimal TotalToCharge { get; set; }
        public decimal AdvanceReceived { get; set; }
        public decimal TransportBudget { get; set; }
        public decimal OperatorPayment { get; set; }
        public decimal RemainingToCollect { get; set; }
        public decimal EstimatedMargin { get; set; }
    }

    public class EventoCalendarioItemModel
    {
        public string Id { get; set; } = string.Empty;
        public long IdNumerico { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Plazo { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Employee { get; set; } = string.Empty;
        public string Subtype { get; set; } = string.Empty;
        public string Machinery { get; set; } = string.Empty;
        public string Place { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public ManiobraFinancialsModel? Financials { get; set; }
        public string Source { get; set; } = "manual";
        public string Status { get; set; } = "Pendiente";
    }

    public class ActualizarEstatusEventoModel
    {
        public string Type { get; set; } = string.Empty;
        public long IdNumerico { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class EditarLapsoEventoModel
    {
        public string Type { get; set; } = string.Empty;
        public long IdNumerico { get; set; }
        public string EndDate { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string? Plazo { get; set; }
    }
}