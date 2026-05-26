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
    public class SessaoUpdateCommandHandler : IRequestHandler<SessaoUpdateCommand, Sessao>
    {
        private readonly IValidator<SessaoUpdateCommand> _validatorSessaoUpdateCommand;
        private readonly ISessaoRepository _sessaoRepository;

        public SessaoUpdateCommandHandler(IValidator<SessaoUpdateCommand> validatorSessaoUpdateCommand, ISessaoRepository sessaoRepository)
        {
            _validatorSessaoUpdateCommand = validatorSessaoUpdateCommand;
            _sessaoRepository = sessaoRepository;
        }

        public async Task<Sessao> Handle(SessaoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorSessaoUpdateCommand.ValidateAndThrowAsync(request);

            var sessaoFound = await _sessaoRepository.GetSessaoById(request.Id);

            if (sessaoFound == null)
                throw new KeyNotFoundException("Sessão não encontrada.");

            sessaoFound.Update(request.PacienteId, request.PsicologoId, request.DataSessao,
                request.HoraInicio, request.Observacoes, request.StatusTipoAtendimento, request.StatusSessao);

            var result = await _sessaoRepository.AlterarSessao(request.Id, sessaoFound);

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
