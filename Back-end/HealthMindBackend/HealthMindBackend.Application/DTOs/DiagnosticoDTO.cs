using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class DiagnosticoDTO
    {
        public String Id { get; set; }
        public String ProntuarioId { get; set; }
        public String PacienteId { get; set; }
        public String Descricao { get; set; }
        public String Cid { get; set; }
        public DateTime DataDiagnostico { get; set; }
        public StatusDiagnosticoEnum StatusDiagnostico { get; set; }
        public String Observacoes { get; set; }
    }
}
