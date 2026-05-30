using HealthMindBackend.Application.RegistrosSessoes.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.RegistrosSessoes.Handlers
{
    public class RegistroSessaoCreateCommandHandler : IRequestHandler<RegistroSessaoCreateCommand, RegistroSessao>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public RegistroSessaoCreateCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;            
        }

        public async Task<RegistroSessao> Handle(RegistroSessaoCreateCommand request, CancellationToken cancellationToken)
        {
            var registroSessao = new RegistroSessao(request.SessaoId, request.Registro);

            return await _sessaoRepository.AdicionarRegistroSessao(request.SessaoId, registroSessao);
        }
    }
}
