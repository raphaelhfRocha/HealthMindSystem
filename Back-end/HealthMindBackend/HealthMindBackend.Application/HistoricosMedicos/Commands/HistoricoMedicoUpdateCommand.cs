using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Commands
{
    public class HistoricoMedicoUpdateCommand : HistoricoMedicoCommand
    {
        public String Id { get; set; }
    }
}
