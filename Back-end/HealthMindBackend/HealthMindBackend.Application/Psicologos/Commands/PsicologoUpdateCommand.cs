using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Commands
{
    public class PsicologoUpdateCommand : PsicologoCommand
    {
        public String Id { get; set; }
    }
}
