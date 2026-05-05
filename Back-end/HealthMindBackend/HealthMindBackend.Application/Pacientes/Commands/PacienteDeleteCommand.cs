using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Commands
{
    public class PacienteDeleteCommand : IRequest<Paciente>
    {
        public string Id { get; set; }

        public PacienteDeleteCommand(string id)
        {
            Id = id;
        }
    }
}
