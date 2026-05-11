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
    public class MedicamentoCreateCommandHandler : IRequestHandler<MedicamentoCreateCommand, Medicamento>
    {
        private readonly IProntuarioRepository _prontuarioRepository;

        public MedicamentoCreateCommandHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Medicamento> Handle(MedicamentoCreateCommand request, CancellationToken cancellationToken)
        {
            var medicamento = new Medicamento(request.ProntuarioId, request.Nome, request.Dosagem,
                request.Frequencia);

            if (medicamento == null)
                throw new ArgumentNullException(nameof(medicamento));

            var createdMedicamento = await _prontuarioRepository.AdicionarMedicamento(request.ProntuarioId, medicamento);

            return createdMedicamento;
        }
    }
}
