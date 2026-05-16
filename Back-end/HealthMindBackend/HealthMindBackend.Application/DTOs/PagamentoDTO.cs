using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class PagamentoDTO
    {
        public String? SessaoId { get; set; }
        public Decimal Valor { get; set; }
        [Required(ErrorMessage = "Data Pagamento Obrigatória")]
        public DateTime DataPagamento { get; set; }
        public StatusFormaPagamentoEnum FormaPagamento { get; set; }
        public StatusPagamentoEnum StatusPagamento { get; set; }
        public StatusParceladoEnum StatusParcelado { get; set; }
        public Int32 TotalParcelas { get; set; }
    }
}
