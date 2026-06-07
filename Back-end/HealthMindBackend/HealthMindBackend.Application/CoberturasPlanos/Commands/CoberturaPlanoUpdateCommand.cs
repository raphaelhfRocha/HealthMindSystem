using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.CoberturasPlanos.Commands
{
    public class CoberturaPlanoUpdateCommand : CoberturaPlanoCommand
    {
        public String PlanoSaudeId { get; set; }
    }
}
