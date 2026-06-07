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
    public class SessaoUpdateCommandHandler : IRequestHandler<SessaoUpdateCommand, Sessao>
    {
        private readonly IValidator<SessaoUpdateCommand> _validatorSessaoUpdateCommand;
        private readonly ISessaoRepository _sessaoRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public SessaoUpdateCommandHandler(IValidator<SessaoUpdateCommand> validatorSessaoUpdateCommand,
            ISessaoRepository sessaoRepository,
            IPsicologoRepository psicologoRepository)
        {
            _validatorSessaoUpdateCommand = validatorSessaoUpdateCommand;
            _sessaoRepository = sessaoRepository;
            _psicologoRepository = psicologoRepository;

        }

        public async Task<Sessao> Handle(SessaoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorSessaoUpdateCommand.ValidateAndThrowAsync(request);

            var sessaoFound = await _sessaoRepository.GetSessaoById(request.Id);

            if (sessaoFound == null)
                throw new KeyNotFoundException("Sessão não encontrada.");

            var disponibilidades = await _psicologoRepository.GetDisponibilidadesByPsicologoId(request.PsicologoId);

            if (disponibilidades != null)
            {
                foreach (var disponibilidade in disponibilidades)
                {
                    if (sessaoFound.DataSessao == disponibilidade.DataDisponibilidade && // Verifica/compara a sessão a agendar com os dados atuais com a disponibilidade e muda o status para reservada caso atenda a condição
                        sessaoFound.HoraInicio == disponibilidade.HoraInicio &&
                        disponibilidade.StatusDisponibilidade == StatusDisponibilidadeEnum.StsReservada)
                    {
                        disponibilidade.UpdateStatusDisponibilidadeToDisponivel();
                        var statusDiponibilidadeAlterada =
                            await _psicologoRepository.AlterarStatusDisponibilidade(sessaoFound.PsicologoId, disponibilidade.Id, disponibilidade);
                    }
                }
            }

            sessaoFound.Update(
                request.PacienteId,
                request.PsicologoId,
                request.DataSessao,
                request.HoraInicio,
                request.StatusTipoAtendimento
            );

            if (disponibilidades != null)
            {
                foreach (var disponibilidade in disponibilidades)
                {
                    if (request.DataSessao == disponibilidade.DataDisponibilidade && // Verifica/compara a sessão a agendar com os dados atuais com a disponibilidade e muda o status para reservada caso atenda a condição
                        request.HoraInicio == disponibilidade.HoraInicio)
                    {
                        disponibilidade.UpdateStatusDisponibilidadeToReservada();
                        var statusDiponibilidadeAlterada =
                            await _psicologoRepository.AlterarStatusDisponibilidade(request.PsicologoId, disponibilidade.Id, disponibilidade);
                    }
                }
            }

            var result = await _sessaoRepository.AlterarSessao(request.Id, sessaoFound);

            if (request.PagamentoCommand != null)
            {
                var pagamento = new Pagamento(
                    result.Id,
                    request.PagamentoCommand.ValorCoberturaPlano,
                    request.PagamentoCommand.ValorConsultaFinal,
                    request.PagamentoCommand.DataPagamento,
                    request.PagamentoCommand.StatusFormaPagamento,
                    request.PagamentoCommand.StatusPagamento,
                    request.PagamentoCommand.StatusParcelado,
                    request.PagamentoCommand.TotalParcelas
                );

                var pagamentoDefinido = await _sessaoRepository.DefinirPagamento(result.Id, pagamento);
                result.Pagamento = pagamentoDefinido;
            }

            return result;
        }
    }
}
