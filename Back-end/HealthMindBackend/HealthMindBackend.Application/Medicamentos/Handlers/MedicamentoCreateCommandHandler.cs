using FluentValidation;
using HealthMindBackend.Application.Medicamentos.Commands;
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
    public class MedicamentoCreateCommandHandler : IRequestHandler<MedicamentoCreateCommand, Medicamento>
    {
        private readonly IValidator<MedicamentoCreateCommand> _validatorMedicamentoCreateCommand;
        private readonly IProntuarioRepository _prontuarioRepository;

        public MedicamentoCreateCommandHandler(IValidator<MedicamentoCreateCommand> validatorMedicamentoCreateCommand, IProntuarioRepository prontuarioRepository)
        {
            _validatorMedicamentoCreateCommand = validatorMedicamentoCreateCommand;
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Medicamento> Handle(MedicamentoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorMedicamentoCreateCommand.ValidateAndThrowAsync(request);

            var medicamento = new Medicamento(request.Nome, request.Dosagem, request.Frequencia, request.StatusMedicamentoUso)
            {
                ProntuarioId = request.ProntuarioId
            };

            if (medicamento == null)
                throw new ArgumentNullException(nameof(medicamento));

            var createdMedicamento = await _prontuarioRepository.AdicionarMedicamento(request.ProntuarioId, medicamento);

            return createdMedicamento;
        }
    }
}
