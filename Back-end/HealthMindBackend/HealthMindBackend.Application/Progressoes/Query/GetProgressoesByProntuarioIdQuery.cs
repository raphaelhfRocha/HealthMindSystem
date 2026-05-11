using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Progressoes.Query
{
    public class GetProgressoesByProntuarioIdQuery : IRequest<List<Progressao>>
    {
        public String ProntuarioId { get; set; }

        public GetProgressoesByProntuarioIdQuery(String prontuarioId)
        {
            ProntuarioId = prontuarioId;
        }
    }
}
