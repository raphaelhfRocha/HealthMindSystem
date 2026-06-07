using FluentValidation;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pagamentos.Handlers
{
    public class PagamentoUpdateCommandHandler : IRequestHandler<PagamentoUpdateCommand, Pagamento>
    {
        private readonly IValidator<PagamentoUpdateCommand> _validatorPagamentoUpdateCommand;
        private readonly ISessaoRepository _sessaoRepository;

        public PagamentoUpdateCommandHandler(IValidator<PagamentoUpdateCommand> validatorPagamentoUpdateCommand, ISessaoRepository sessaoRepository)
        {
            _validatorPagamentoUpdateCommand = validatorPagamentoUpdateCommand;
            _sessaoRepository = sessaoRepository;            
        }

        public async Task<Pagamento> Handle(PagamentoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorPagamentoUpdateCommand.ValidateAndThrowAsync(request);

            var sessaoPagamentoFound = await _sessaoRepository.GetSessaoById(request.SessaoId);

            if (sessaoPagamentoFound == null)
                throw new KeyNotFoundException("Sessão/Pagamento não encontrado");

            if (request.StatusPagamento == StatusPagamentoEnum.StsIsento)
                request.DataPagamento = DateTime.MinValue;

            sessaoPagamentoFound.Pagamento.Update(
                request.ValorCoberturaPlano,
                request.ValorConsultaFinal,
                request.DataPagamento,
                request.StatusFormaPagamento,
                request.StatusPagamento,
                request.StatusParcelado,
                request.TotalParcelas
            );

            var pagamentoDefinido = await _sessaoRepository.DefinirPagamento(request.SessaoId, sessaoPagamentoFound.Pagamento);

            return pagamentoDefinido;
        }
    }
}
