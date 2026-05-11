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
    public class MedicamentoUpdateCommandHandler : IRequestHandler<MedicamentoUpdateCommand, Medicamento>
    {
        private readonly IProntuarioRepository _prontuarioRepository;

        public MedicamentoUpdateCommandHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Medicamento> Handle(MedicamentoUpdateCommand request, CancellationToken cancellationToken)
        {
            var medicamentoFound = await _prontuarioRepository.GetMedicamentoByProntuarioIdAndMedicamentoId(request.ProntuarioId, request.Id);

            if (medicamentoFound == null)
                throw new KeyNotFoundException("Medicamento não encontrado");

            medicamentoFound.Update(request.Nome, request.Dosagem, request.Frequencia);

            return await _prontuarioRepository.EditarMedicamento(request.ProntuarioId, request.Id, medicamentoFound);
        }
    }
}
