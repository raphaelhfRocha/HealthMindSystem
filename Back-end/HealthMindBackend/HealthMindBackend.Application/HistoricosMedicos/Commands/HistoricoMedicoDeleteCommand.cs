using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Commands
{
    public class HistoricoMedicoDeleteCommand : IRequest<HistoricoMedico>
    {
        public String Id { get; set; }

        public HistoricoMedicoDeleteCommand(String id)
        {
            Id = id;
        }
    }
}
