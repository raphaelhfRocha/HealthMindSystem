using HealthMindBackend.Application.Medicamentos.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Medicamentos.Handlers
{
    public class GetMedicamentoByProntuarioIdAndMedicamentoIdQueryHandler : IRequestHandler<GetMedicamentoByProntuarioIdAndMedicamentoIdQuery, Medicamento>
    {
        private readonly IProntuarioRepository _prontuarioRepository;

        public GetMedicamentoByProntuarioIdAndMedicamentoIdQueryHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Medicamento> Handle(GetMedicamentoByProntuarioIdAndMedicamentoIdQuery request, CancellationToken cancellationToken)
        {
            var medicamentoFound = await _prontuarioRepository.GetMedicamentoByProntuarioIdAndMedicamentoId(request.ProntuarioId, request.Id);

            if (medicamentoFound == null)
                throw new KeyNotFoundException("Medicamento não encontrado");

            return medicamentoFound;
        }
    }
}
