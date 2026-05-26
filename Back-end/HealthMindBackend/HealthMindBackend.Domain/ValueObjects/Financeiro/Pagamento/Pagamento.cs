using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento
{
    public class Pagamento : ValueObject
    {
        public String SessaoId { get; private set; }
        public Decimal Valor { get; private set; }
        public DateTime DataPagamento { get; private set; }
        public StatusFormaPagamentoEnum FormaPagamento { get; private set; }
        public StatusPagamentoEnum StatusPagamento { get; private set; }
        public StatusParceladoEnum StatusParcelado { get; private set; }
        public Int32 TotalParcelas { get; private set; }

        protected Pagamento()
        {
        }

        public Pagamento(String sessaoId, Decimal valor, DateTime dataPagamento, StatusFormaPagamentoEnum formaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32 totalParcelas)
        {
            SessaoId = sessaoId;
            ValidatePagamentoDomain(valor, dataPagamento, formaPagamento, statusPagamento, statusParcelado, totalParcelas);
        }

        private void ValidatePagamentoDomain(Decimal valor, DateTime dataPagamento, StatusFormaPagamentoEnum formaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32 totalParcelas)
        {
            DomainExceptionValidation.Validate(valor < 0, "Valor pagamento inválido.");
            DomainExceptionValidation.Validate(formaPagamento == StatusFormaPagamentoEnum.StsNone, "Forma de pagamento inválida");
            DomainExceptionValidation.Validate(statusPagamento == StatusPagamentoEnum.StsNone, "Status do pagamento inválido.");
            DomainExceptionValidation.Validate(statusParcelado == StatusParceladoEnum.StsNone, "Status parcelado inválido.");
            DomainExceptionValidation.Validate(statusParcelado == StatusParceladoEnum.StsNao && totalParcelas > 0, "Pagamento não parcelado não pode possuir parcelas.");
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

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                Valor,
                DataPagamento,
                FormaPagamento,
                StatusPagamento,
                StatusParcelado,
                TotalParcelas
            };
        }
    }
}

