using HealthMindBackend.Application.RegistrosSessoes.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.RegistrosSessoes.Handlers
{
    public class RegistroSessaoDeleteCommandHandler : IRequestHandler<RegistroSessaoDeleteCommand, RegistroSessao>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public RegistroSessaoDeleteCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<RegistroSessao> Handle(RegistroSessaoDeleteCommand request, CancellationToken cancellationToken)
        {
            var registroSessaoFound = await _sessaoRepository.
                GetRegistrosSessoesBySessaoIdAndRegistroSessaoId(request.SessaoId, request.Id);

            registroSessaoFound = registroSessaoFound ??
                throw new KeyNotFoundException("Registro Sessão não encontrado");

            await _sessaoRepository.ExcluirRegistroSessao(request.SessaoId, request.Id);
            
            return registroSessaoFound;
        }
    }
}
