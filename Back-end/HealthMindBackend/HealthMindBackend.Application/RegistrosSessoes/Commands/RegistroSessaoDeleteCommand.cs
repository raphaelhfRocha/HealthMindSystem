using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.RegistrosSessoes.Commands
{
    public class RegistroSessaoDeleteCommand : IRequest<RegistroSessao>
    {
        public String Id { get; set; }
        public String SessaoId { get; set; }

        public RegistroSessaoDeleteCommand(String id, string sessaoId)
        {
            Id = id;
            SessaoId = sessaoId;
        }
    }
}
