using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Commands
{
    public class PsicologoDeleteCommand : IRequest<Psicologo>
    {
        public String Id { get; set; }

        public PsicologoDeleteCommand(String id)
        {
            Id = id;
        }
    }
}
