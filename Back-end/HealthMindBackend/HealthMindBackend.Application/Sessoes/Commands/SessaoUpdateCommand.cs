using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Commands
{
    public class SessaoUpdateCommand : SessaoCommand
    {
        public String Id { get; set; }
    }
}
