using HealthMindBackend.Application.Recepcionistas.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Recepcionistas.Commands
{
    public class RecepcionistaUpdateCommand : RecepcionistaCommand
    {
        public String Id { get; set; }
    }
}
