using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.SaudesMentais.Commands
{
    public class SaudeMentalCommand
    {
        public String? HistoricoMedicoId { get; set; }
        public String DiagnosticoPrevio { get; set; }
        public String Acompanhamento { get; set; }
        public String StatusInternacao { get; set; }
        public String Antecentes { get; set; }
    }
}
