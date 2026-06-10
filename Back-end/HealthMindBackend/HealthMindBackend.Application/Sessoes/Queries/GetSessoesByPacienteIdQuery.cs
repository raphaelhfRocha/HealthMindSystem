using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Queries
{
    public class GetSessoesByPacienteIdQuery : IRequest<List<Sessao>>
    {
        public String PacienteId { get; set; }

        public GetSessoesByPacienteIdQuery(String pacienteId)
        {
            PacienteId = pacienteId;
        }
    }
}
