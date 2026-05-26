using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Queries
{
    public class GetDisponibilidadesByPsicologoIdQuery : IRequest<List<Disponibilidade>>
    {
        public String PsicologoId { get; set; }

        public GetDisponibilidadesByPsicologoIdQuery(String psicologoId)
        {
            PsicologoId = psicologoId;
        }
    }
}
