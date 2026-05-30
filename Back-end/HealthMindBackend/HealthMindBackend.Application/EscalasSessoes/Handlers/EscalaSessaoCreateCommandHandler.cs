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
    public class EscalaSessaoCreateCommandHandler : IRequestHandler<EscalaSessaoCreateCommand, EscalaSessao>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public EscalaSessaoCreateCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;   
        }

        public async Task<EscalaSessao> Handle(EscalaSessaoCreateCommand request, CancellationToken cancellationToken)
        {
            var escalaSessao = new EscalaSessao(request.SessaoId, request.Humor, request.Ansiedade, request.Sono, request.FuncSocial);
            
            return await _sessaoRepository.AdicionarEscalaSessao(request.SessaoId, escalaSessao);
        }
    }
}
