using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Commands
{
    public class SessaoDeleteCommand : IRequest<Sessao>
    {
        public String Id { get; set; }

        public SessaoDeleteCommand(String id)
        {
            Id = id;
        }
    }
}
