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
    public class GetAllHistoricosQueryHandler : IRequestHandler<GetAllHistoricosQuery, IEnumerable<HistoricoMedico>>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public GetAllHistoricosQueryHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;            
        }

        public async Task<IEnumerable<HistoricoMedico>> Handle(GetAllHistoricosQuery request, CancellationToken cancellationToken)
        {
            var historicosFound = await _historicoMedicoRepository.GetAllHistoricos();

            if (!historicosFound.Any())
                throw new KeyNotFoundException("Históricos médicos não encontrados");

            return historicosFound;
        }
    }
}
