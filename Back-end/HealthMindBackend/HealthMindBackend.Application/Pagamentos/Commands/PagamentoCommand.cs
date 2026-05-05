using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pagamentos.Commands
{
    public class PagamentoCommand : IRequest<Pagamento>
    {
        public String SessaoId { get; set; }
        public Decimal Valor { get; set; }
        public DateTime DataPagamento { get; set; }
        public StatusFormaPagamentoEnum StatusFormaPagamento { get; set; }        
        public StatusPagamentoEnum StatusPagamento { get; set; }
        public StatusParceladoEnum StatusParcelado { get; set; }
        public Int32 TotalParcelas { get; set; }
    }
}
