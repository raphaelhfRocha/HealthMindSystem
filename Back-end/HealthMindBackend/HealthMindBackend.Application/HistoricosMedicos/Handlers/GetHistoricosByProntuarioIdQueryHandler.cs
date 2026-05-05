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
    public class GetHistoricosByProntuarioIdQueryHandler : IRequestHandler<GetHistoricosByProntuarioIdQuery, IEnumerable<HistoricoMedico>>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public GetHistoricosByProntuarioIdQueryHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<IEnumerable<HistoricoMedico>> Handle(GetHistoricosByProntuarioIdQuery request, CancellationToken cancellationToken)
        {
            return await _historicoMedicoRepository.GetHistoricosByProntuarioId(request.ProntuarioId);
        }
    }
}
