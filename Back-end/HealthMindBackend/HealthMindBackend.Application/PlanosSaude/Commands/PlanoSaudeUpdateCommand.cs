using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.PlanosSaude.Commands
{
    public class PlanoSaudeUpdateCommand : PlanoSaudeCommand
    {
        public String Id { get; set; }
    }
}
