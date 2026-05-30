using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.RegistrosSessoes.Commands
{
    public abstract class RegistroSessaoCommand : IRequest<RegistroSessao>
    {
        public String SessaoId { get; set; }
        public String Registro { get; set; }
    }
}
