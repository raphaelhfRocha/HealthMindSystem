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
    public class EscalaSessaoDeleteCommandHandler : IRequestHandler<EscalaSessaoDeleteCommand, EscalaSessao>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public EscalaSessaoDeleteCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<EscalaSessao> Handle(EscalaSessaoDeleteCommand request, CancellationToken cancellationToken)
        {
            var sessaoFound = await _sessaoRepository.GetSessaoById(request.SessaoId);

            sessaoFound = sessaoFound ?? throw new KeyNotFoundException("Sessão não encontrada");

            var escalaSessaoFound = await _sessaoRepository.GetEscalaSessaoBySessaoIdAndEscalaSessaoId(request.SessaoId, request.Id);

            escalaSessaoFound = escalaSessaoFound ?? throw new KeyNotFoundException("Escala Sessão não encontrada");

            await _sessaoRepository.ExcluirEscalaSessao(request.SessaoId, request.Id);

            return escalaSessaoFound;

            throw new NotImplementedException();
        }
    }
}
