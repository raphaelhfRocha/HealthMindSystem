using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.EscalasSessoes.Commands
{
    public class EscalaSessaoDeleteCommand : IRequest<EscalaSessao>
    {
        public String Id { get; set; }
        public String SessaoId { get; set; }

        public EscalaSessaoDeleteCommand(String id, String sessaoId)
        {
            Id = id;
            SessaoId = sessaoId;
        }
    }
}
