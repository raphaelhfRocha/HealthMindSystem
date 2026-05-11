using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Diagnosticos.Queries
{
    public class GetDiagnosticosByProntuarioIdQuery : IRequest<List<Diagnostico>>
    {
        public String ProntuarioId { get; set; }

        public GetDiagnosticosByProntuarioIdQuery(String prontuarioId)
        {
            ProntuarioId = prontuarioId;            
        }
    }
}
