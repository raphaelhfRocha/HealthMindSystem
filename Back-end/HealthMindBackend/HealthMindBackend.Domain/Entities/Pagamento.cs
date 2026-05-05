using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class Pagamento
    {
        public Decimal Valor { get; private set; }
        public DateTime DataPagamento { get; private set; }
        public StatusFormaPagamentoEnum FormaPagamento { get; private set; }
        public StatusPagamentoEnum StatusPagamento { get; private set; }
        public StatusParceladoEnum StatusParcelado { get; private set; }
        public Int32 TotalParcelas { get; private set; }

        public Pagamento(Decimal valor, DateTime dataPagamento, StatusFormaPagamentoEnum formaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32 totalParcelas)
        {
            ValidatePagamentoDomain(valor, dataPagamento, formaPagamento, statusPagamento, statusParcelado, totalParcelas);
        }

        private void ValidatePagamentoDomain(Decimal valor, DateTime dataPagamento, StatusFormaPagamentoEnum formaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32 totalParcelas)
        {
            DomainExceptionValidation.Validate(valor < 0, "Valor pagamento inválido.");
            DomainExceptionValidation.Validate(formaPagamento == StatusFormaPagamentoEnum.StsNone, "Forma de pagamento inválida");
            DomainExceptionValidation.Validate(statusPagamento == StatusPagamentoEnum.StsNone, "Status do pagamento inválido.");
            DomainExceptionValidation.Validate(statusParcelado == StatusParceladoEnum.StsNone, "Status parcelado inválido.");
            DomainExceptionValidation.Validate(totalParcelas != 0 && formaPagamento != StatusFormaPagamentoEnum.StsCartaoCedito || formaPagamento != StatusFormaPagamentoEnum.StsPix, "O total de parcelas é obrigatório ser 0 devido a forma de pagamento ser diferente de cartão de crédito e PIX");
            DomainExceptionValidation.Validate(totalParcelas != 0 && statusParcelado == StatusParceladoEnum.StsNao, "O total de parcelas é obrigatório ser 0 devido ao status parcelado ser não");
            DomainExceptionValidation.Validate(totalParcelas < 0, "Total parcelas inválido");

            Valor = valor;
            DataPagamento = dataPagamento;
            FormaPagamento = formaPagamento;
            StatusPagamento = statusPagamento;
            StatusParcelado = statusParcelado;
            TotalParcelas = totalParcelas;
        }

        public void Update(Decimal valor, DateTime dataPagamento, StatusFormaPagamentoEnum formaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32 totalParcelas)
        {
            ValidatePagamentoDomain(valor, dataPagamento, formaPagamento, statusPagamento, statusParcelado, totalParcelas);
        }
    }
}
