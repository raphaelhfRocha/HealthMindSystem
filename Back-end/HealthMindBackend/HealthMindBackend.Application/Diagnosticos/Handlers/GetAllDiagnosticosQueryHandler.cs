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
    public class GetAllDiagnosticosQueryHandler : IRequestHandler<GetAllDiagnosticosQuery, IEnumerable<Diagnostico>>
    {
        private readonly IDiagnosticoRepository _diagnosticoRepository;

        public GetAllDiagnosticosQueryHandler(IDiagnosticoRepository diagnosticoRepository)
        {
            _diagnosticoRepository = diagnosticoRepository;
        }

        public async Task<IEnumerable<Diagnostico>> Handle(GetAllDiagnosticosQuery request, CancellationToken cancellationToken)
        {
            var diagnosticosFound = await _diagnosticoRepository.GetAllDiagnosticos();

            if (!diagnosticosFound.Any())
                throw new KeyNotFoundException("Diagnosticos não encontrados");

            return diagnosticosFound;
        }
    }
}
