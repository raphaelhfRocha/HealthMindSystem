using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Prontuarios.Commands
{
    public class ProntuarioUpdateCommand : ProntuarioCommand
    {
        public String Id { get; set; }
    }
}
