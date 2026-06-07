using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.EscalasSessoes.Queries
{
    public class GetEscalasSessoesBySessaoIdQuery : IRequest<List<EscalaSessao>>
    {
        public String SessaoId { get; set; }

        public GetEscalasSessoesBySessaoIdQuery(String sessaoId)
        {
            SessaoId = sessaoId;
        }
    }
}
