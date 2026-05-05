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
    public class SessaoCreateCommandHandler : IRequestHandler<SessaoCreateCommand, Sessao>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public SessaoCreateCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<Sessao> Handle(SessaoCreateCommand request, CancellationToken cancellationToken)
        {
            var sessao = new Sessao(request.PacienteId, request.PsicologoId, request.DataSessao,
                request.HoraInicio, request.Observacoes, request.StatusTipoAtendimento, request.StatusSessao);

            if (sessao == null)
                throw new ArgumentNullException(nameof(sessao));

            return await _sessaoRepository.AgendarSessao(sessao);
        }
    }
}
