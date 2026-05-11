using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pagamentos.Commands
{
    public class PagamentoDeleteCommand : IRequest<Pagamento>
    {
        public String SessaoId { get; set; }

        public PagamentoDeleteCommand(String sessaoId)
        {
            SessaoId = sessaoId;
        }
    }
}
