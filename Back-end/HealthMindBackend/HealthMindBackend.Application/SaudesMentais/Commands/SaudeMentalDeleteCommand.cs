using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.SaudesMentais.Commands
{
    public class SaudeMentalDeleteCommand : IRequest<SaudeMental>
    {
        public String HistoricoMedicoId { get; set; }

        public SaudeMentalDeleteCommand(String historicoMedicoId)
        {
            HistoricoMedicoId = historicoMedicoId;
        }
    }
}
