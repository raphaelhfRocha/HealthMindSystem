using HealthMindBackend.Application.Diagnosticos.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Diagnosticos.Handlers
{
    public class GetDiagnosticosByProntuarioIdQueryHandler : IRequestHandler<GetDiagnosticosByProntuarioIdQuery, List<Diagnostico>>
    {
        private readonly IDiagnosticoRepository _diagnosticoRepository;

        public GetDiagnosticosByProntuarioIdQueryHandler(IDiagnosticoRepository diagnosticoRepository)
        {
            _diagnosticoRepository = diagnosticoRepository;
        }

        public async Task<List<Diagnostico>> Handle(GetDiagnosticosByProntuarioIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _diagnosticoRepository.GetDiagnosticosByProntuarioId(request.ProntuarioId);

            return result ?? throw new KeyNotFoundException("Diagnósticos não encontrados");
        }
    }
}
