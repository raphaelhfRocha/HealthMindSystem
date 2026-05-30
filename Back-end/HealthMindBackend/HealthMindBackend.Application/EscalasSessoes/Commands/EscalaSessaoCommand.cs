using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.EscalasSessoes.Commands
{
    public class EscalaSessaoCommand : IRequest<EscalaSessao>
    {
        public String SessaoId { get; set; }
        public Int32 Humor { get; set; }
        public Int32 Ansiedade { get; set; }
        public Int32 Sono { get; set; }
        public Int32 FuncSocial { get; set; }
    }
}
