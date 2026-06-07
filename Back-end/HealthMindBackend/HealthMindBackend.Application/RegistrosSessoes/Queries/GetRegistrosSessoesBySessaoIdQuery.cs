using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.RegistrosSessoes.Queries
{
    public class GetRegistrosSessoesBySessaoIdQuery : IRequest<List<RegistroSessao>>
    {
        public String SessaoId { get; set; }

        public GetRegistrosSessoesBySessaoIdQuery(String sessaoId)
        {
            SessaoId = sessaoId;            
        }
    }
}
