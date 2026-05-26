using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class PlanoSaudePacienteDTO
    {
        public String PlanoSaudeId { get; set; }
        public String NumeroCarteirinha { get; set; }
        public DateTime DataValidade { get; set; }
    }
}
