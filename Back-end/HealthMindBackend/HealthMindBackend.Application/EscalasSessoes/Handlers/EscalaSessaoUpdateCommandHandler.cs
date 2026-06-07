using FluentValidation;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.EscalasSessoes.Handlers
{
    public class EscalaSessaoUpdateCommandHandler : IRequestHandler<EscalaSessaoUpdateCommand, EscalaSessao>
    {
        private readonly IValidator<EscalaSessaoUpdateCommand> _validatorEscalaSessaoUpdateCommand;
        private readonly ISessaoRepository _sessaoRepository;

        public EscalaSessaoUpdateCommandHandler(IValidator<EscalaSessaoUpdateCommand> validatorEscalaSessaoUpdateCommand, ISessaoRepository sessaoRepository)
        {
            _validatorEscalaSessaoUpdateCommand = validatorEscalaSessaoUpdateCommand;
            _sessaoRepository = sessaoRepository;
        }

        public async Task<EscalaSessao> Handle(EscalaSessaoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorEscalaSessaoUpdateCommand.ValidateAndThrowAsync(request);

            var escalaSessaoFound = await _sessaoRepository.GetEscalaSessaoBySessaoIdAndEscalaSessaoId(request.SessaoId, request.Id);

            escalaSessaoFound = escalaSessaoFound ??
                throw new KeyNotFoundException("Escala Sessão não encontrada");

            escalaSessaoFound.Update(request.SessaoId, request.Humor, request.Ansiedade, request.Sono, request.FuncSocial);

            return await _sessaoRepository.AlterarEscalaSessao(request.SessaoId, request.Id, escalaSessaoFound);
        }
    }
}
