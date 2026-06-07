using HealthMindBackend.Application.Medicamentos.Queries;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Medicamentos.Handlers
{
    public class GetMedicamentosByProntuarioIdQueryHandler : IRequestHandler<GetMedicamentosByProntuarioIdQuery, List<Medicamento>>
    {
        private readonly IProntuarioRepository _prontuarioRepository;

        public GetMedicamentosByProntuarioIdQueryHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;            
        }

        public async Task<List<Medicamento>> Handle(GetMedicamentosByProntuarioIdQuery request, CancellationToken cancellationToken)
        {
            var medicamentosFound = await _prontuarioRepository.GetMedicamentosByProntuarioId(request.ProntuarioId);

            return medicamentosFound;
        }
    }
}
