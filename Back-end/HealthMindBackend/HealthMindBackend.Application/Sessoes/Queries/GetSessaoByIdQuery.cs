using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Queries
{
    public class GetSessaoByIdQuery : IRequest<Sessao>
    {
        public String SessaoId { get; set; }

        public GetSessaoByIdQuery(String sessaoId)
        {
            SessaoId = sessaoId;
        }
    }
}
