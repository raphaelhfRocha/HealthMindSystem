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
        public Decimal ValorCoberturaPlano { get; set; }
        public Decimal ValorConsultaFinal { get; set; }
        public DateTime DataPagamento { get; set; }
        public StatusFormaPagamentoEnum StatusFormaPagamento { get; set; }
        public StatusPagamentoEnum StatusPagamento { get; set; }
        public StatusParceladoEnum StatusParcelado { get; set; }
        public Int32? TotalParcelas { get; set; }
    }
}
