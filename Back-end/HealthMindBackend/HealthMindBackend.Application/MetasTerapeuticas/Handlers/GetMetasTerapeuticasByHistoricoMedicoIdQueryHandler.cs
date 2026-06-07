using HealthMindBackend.Application.MetasTerapeuticas.Queries;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.MetasTerapeuticas.Handlers
{
    public class GetMetasTerapeuticasByHistoricoMedicoIdQueryHandler : IRequestHandler<GetMetasTerapeuticasByHistoricoMedicoIdQuery, List<MetaTerapeutica>>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public GetMetasTerapeuticasByHistoricoMedicoIdQueryHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<List<MetaTerapeutica>> Handle(GetMetasTerapeuticasByHistoricoMedicoIdQuery request, CancellationToken cancellationToken)
        {
            return await _historicoMedicoRepository.GetMetaTerapeuticasByHistoricoMedicoId(request.HistoricoMedicoId);
        }
    }
}
