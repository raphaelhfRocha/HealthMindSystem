using FluentValidation;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
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
        private readonly IPsicologoRepository _psicologoRepository;

        public SessaoCreateCommandHandler(IValidator<SessaoCreateCommand> validatorSessaoCreateCommand,
            ISessaoRepository sessaoRepository,
            IPsicologoRepository psicologoRepository)
        {
            _validatorSessaoCreateCommand = validatorSessaoCreateCommand;
            _sessaoRepository = sessaoRepository;
            _psicologoRepository = psicologoRepository;

        }

        public async Task<Sessao> Handle(SessaoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorSessaoCreateCommand.ValidateAndThrowAsync(request);

            var sessao = new Sessao(
                request.PacienteId,
                request.PsicologoId,
                request.DataSessao,
                request.HoraInicio,
                request.StatusTipoAtendimento
            );

            var disponibilidades = await _psicologoRepository.GetDisponibilidadesByPsicologoId(request.PsicologoId);

            if (disponibilidades != null)
            {
                foreach (var disponibilidade in disponibilidades)
                {
                    if (request.DataSessao == disponibilidade.DataDisponibilidade &&
                        request.HoraInicio == disponibilidade.HoraInicio)
                    {
                        disponibilidade.UpdateStatusDisponibilidadeToReservada();
                        var statusDiponibilidadeAlterada =
                            await _psicologoRepository.AlterarStatusDisponibilidade(request.PsicologoId, disponibilidade.Id, disponibilidade);
                    }
                }
            }

            var result = await _sessaoRepository.AgendarSessao(sessao);

            var pagamento = new Pagamento(
                result.Id,
                request.PagamentoCommand.ValorCoberturaPlano,
                request.PagamentoCommand.ValorConsultaFinal
            );

            var pagamentoDefinido = await _sessaoRepository.DefinirPagamento(result.Id, pagamento);
            result.Pagamento = pagamentoDefinido;

            return result;
        }
    }
}
