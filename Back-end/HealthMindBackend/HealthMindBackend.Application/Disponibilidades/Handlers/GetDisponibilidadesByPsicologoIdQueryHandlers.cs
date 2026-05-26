using HealthMindBackend.Application.Disponibilidades.Queries;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Handlers
{
    public class GetDisponibilidadesByPsicologoIdQueryHandlers : IRequestHandler<GetDisponibilidadesByPsicologoIdQuery, List<Disponibilidade>>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public GetDisponibilidadesByPsicologoIdQueryHandlers(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<List<Disponibilidade>> Handle(GetDisponibilidadesByPsicologoIdQuery request, CancellationToken cancellationToken)
        {
            return await _psicologoRepository.GetDisponibilidadesByPsicologoId(request.PsicologoId);
        }
    }
}
