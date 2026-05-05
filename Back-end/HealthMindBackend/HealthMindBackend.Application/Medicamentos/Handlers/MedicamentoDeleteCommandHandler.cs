using HealthMindBackend.Application.Medicamentos.Commands;
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
    public class MedicamentoDeleteCommandHandler : IRequestHandler<MedicamentoDeleteCommand, Medicamento>
    {
        private readonly IProntuarioRepository _prontuarioRepository;

        public MedicamentoDeleteCommandHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;
        }
        public async Task<Medicamento> Handle(MedicamentoDeleteCommand request, CancellationToken cancellationToken)
        {
            var medicamentoFound = await _prontuarioRepository.GetMedicamentoById(request.ProntuarioId, request.Id);

            if (medicamentoFound == null)
                throw new KeyNotFoundException("Medicamento não encontrado");

            await _prontuarioRepository.ExcluirMedicamento(request.ProntuarioId, request.Id);

            return medicamentoFound;
        }
    }
}
