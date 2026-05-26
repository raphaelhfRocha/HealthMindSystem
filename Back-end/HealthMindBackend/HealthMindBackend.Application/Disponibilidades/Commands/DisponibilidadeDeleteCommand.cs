using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Commands
{
    public class DisponibilidadeDeleteCommand : IRequest<Disponibilidade>
    {
        public String DisponibilidadeId { get; set; }
        public String PsicologoId { get; set; }

        public DisponibilidadeDeleteCommand(String disponibilidadeId, String psicologoId)
        {
            DisponibilidadeId = psicologoId;
            PsicologoId = psicologoId;
        }
    }
}
