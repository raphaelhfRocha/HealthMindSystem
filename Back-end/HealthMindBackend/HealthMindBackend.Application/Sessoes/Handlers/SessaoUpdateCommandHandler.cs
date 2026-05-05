using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
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
        private readonly ISessaoRepository _sessaoRepository;

        public SessaoUpdateCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<Sessao> Handle(SessaoUpdateCommand request, CancellationToken cancellationToken)
        {
            var sessaoFound = await _sessaoRepository.GetSessaoById(request.Id);

            if (sessaoFound == null)
                throw new KeyNotFoundException("Sessão não encontrada.");

            sessaoFound.Update(request.PacienteId, request.PsicologoId, request.DataSessao,
                request.HoraInicio, request.Observacoes, request.StatusTipoAtendimento, request.StatusSessao);

            return await _sessaoRepository.AlterarSessao(request.Id, sessaoFound);
        }
    }
}
