using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Commands
{
    public class PacienteUpdateCommand : PacienteCommand
    {
        public string Id { get; set; }
    }
}
