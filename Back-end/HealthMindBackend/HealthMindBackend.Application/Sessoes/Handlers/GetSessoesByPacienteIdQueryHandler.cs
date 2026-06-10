using HealthMindBackend.Application.Sessoes.Queries;
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
    public class GetSessoesByPacienteIdQueryHandler : IRequestHandler<GetSessoesByPacienteIdQuery, List<Sessao>>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public GetSessoesByPacienteIdQueryHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<List<Sessao>> Handle(GetSessoesByPacienteIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _sessaoRepository.GetSessoesByPacienteId(request.PacienteId);

            return result ?? throw new KeyNotFoundException("Sessões não encontradas");
        }
    }
}
