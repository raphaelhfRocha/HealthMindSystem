using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class MetaTerapeuticaDTO
    {
        public String Id { get; set; }
        public String HistoricoMedicoId { get; set; }
        public String Titulo { get; set; }
        public StatusMetaTerapeuticaEnum StatusMetaTerapeutica { get; set; }
        public String? Observacoes { get; set; }
    }
}
