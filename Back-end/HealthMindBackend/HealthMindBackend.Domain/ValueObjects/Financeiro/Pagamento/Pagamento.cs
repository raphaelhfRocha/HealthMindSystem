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
        public Decimal ValorCoberturaPlano { get; private set; }
        public Decimal ValorConsultaFinal { get; private set; }
        public DateTime DataPagamento { get; private set; }
        public StatusFormaPagamentoEnum StatusFormaPagamento { get; private set; }
        public StatusPagamentoEnum StatusPagamento { get; private set; }
        public StatusParceladoEnum StatusParcelado { get; private set; }
        public Int32? TotalParcelas { get; private set; }

        public Pagamento()
        {
        }

        public Pagamento(String sessaoId, Decimal valorCoberturaPlano, Decimal valorConsultaFinal, DateTime dataPagamento, StatusFormaPagamentoEnum formaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32? totalParcelas)
        {
            SessaoId = sessaoId;
            ValidatePagamentoDomain(valorCoberturaPlano, valorConsultaFinal, dataPagamento, formaPagamento, statusPagamento, statusParcelado, totalParcelas);
        }

        public Pagamento(String sessaoId, Decimal valorCoberturaPlano, Decimal valorConsultaFinal)
        {
            SessaoId = sessaoId;
            ValorCoberturaPlano = valorCoberturaPlano;
            ValorConsultaFinal = valorConsultaFinal;
            DataPagamento = DateTime.MinValue;
            StatusPagamento = StatusPagamentoEnum.StsPendente;
        }

        private void ValidatePagamentoDomain(Decimal valorCoberturaPlano, Decimal valorConsultaFinal, DateTime dataPagamento, StatusFormaPagamentoEnum statusFormaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32? totalParcelas)
        {
            DomainExceptionValidation.Validate(statusPagamento == StatusPagamentoEnum.StsNone, "Status do pagamento inválido.");
            DomainExceptionValidation.Validate(statusParcelado == StatusParceladoEnum.StsNone, "Status parcelado inválido.");
            DomainExceptionValidation.Validate(statusParcelado == StatusParceladoEnum.StsNao && totalParcelas > 0, "Pagamento não parcelado não pode possuir parcelas.");
            DomainExceptionValidation.Validate(totalParcelas != 0 && statusParcelado == StatusParceladoEnum.StsNao, "O total de parcelas é obrigatório ser 0 devido ao status parcelado ser não");
            DomainExceptionValidation.Validate(totalParcelas < 0, "Total parcelas inválido");

            ValorCoberturaPlano = valorCoberturaPlano;
            ValorConsultaFinal = valorConsultaFinal;
            DataPagamento = dataPagamento;
            StatusFormaPagamento = statusFormaPagamento;
            StatusPagamento = statusPagamento;
            StatusParcelado = statusParcelado;
            TotalParcelas = totalParcelas;
        }

        public void Update(Decimal valorCoberturaPlano, Decimal valorConsultaFinal, DateTime dataPagamento, StatusFormaPagamentoEnum statusFormaPagamento, StatusPagamentoEnum statusPagamento, StatusParceladoEnum statusParcelado, Int32? totalParcelas)
        {
            ValidatePagamentoDomain(valorCoberturaPlano, valorConsultaFinal, dataPagamento, statusFormaPagamento, statusPagamento, statusParcelado, totalParcelas);
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                SessaoId,
                ValorCoberturaPlano,
                ValorConsultaFinal,
                DataPagamento,
                StatusFormaPagamento,
                StatusPagamento,
                StatusParcelado,
                TotalParcelas
            };
        }
    }
}

