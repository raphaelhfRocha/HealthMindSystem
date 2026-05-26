using FluentValidation;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Handlers
{
    public class SessaoCreateCommandHandler : IRequestHandler<SessaoCreateCommand, Sessao>
    {
        private readonly IValidator<SessaoCreateCommand> _validatorSessaoCreateCommand;
        private readonly ISessaoRepository _sessaoRepository;

        public SessaoCreateCommandHandler(IValidator<SessaoCreateCommand> validatorSessaoCreateCommand, ISessaoRepository sessaoRepository)
        {
            _validatorSessaoCreateCommand = validatorSessaoCreateCommand;
            _sessaoRepository = sessaoRepository;
        }

        public async Task<Sessao> Handle(SessaoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorSessaoCreateCommand.ValidateAndThrowAsync(request);

            var sessao = new Sessao(request.PacienteId, request.PsicologoId, request.DataSessao,
                request.HoraInicio, request.Observacoes, request.StatusTipoAtendimento, request.StatusSessao);
            
            var result = await _sessaoRepository.AgendarSessao(sessao);

            var pagamento = new Pagamento(result.Id, request.Pagamento.Valor,
                request.Pagamento.DataPagamento, request.Pagamento.FormaPagamento,
                request.Pagamento.StatusPagamento, request.Pagamento.StatusParcelado,
                request.Pagamento.TotalParcelas);

            var pagamentoDefinido = pagamento != null 
                ? await _sessaoRepository.DefinirPagamento(result.Id, pagamento)
                : null;

            result.Pagamento = pagamentoDefinido;

            return result;
        }
    }
}
