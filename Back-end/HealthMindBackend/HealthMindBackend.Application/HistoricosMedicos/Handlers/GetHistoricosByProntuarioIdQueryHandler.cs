using HealthMindBackend.Application.HistoricosMedicos.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Handlers
{
    public class GetHistoricosByProntuarioIdQueryHandler : IRequestHandler<GetHistoricosByProntuarioIdQuery, List<HistoricoMedico>>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public GetHistoricosByProntuarioIdQueryHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<List<HistoricoMedico>> Handle(GetHistoricosByProntuarioIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _historicoMedicoRepository.GetHistoricosByProntuarioId(request.ProntuarioId);

            return result ?? throw new KeyNotFoundException("Históricos médicos não encontrados");
        }
    }
}
