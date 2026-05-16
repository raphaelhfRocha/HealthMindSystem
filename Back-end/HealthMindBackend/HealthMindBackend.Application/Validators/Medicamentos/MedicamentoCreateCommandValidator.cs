using FluentValidation;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Medicamentos
{
    public class MedicamentoCreateCommandValidator : AbstractValidator<MedicamentoCreateCommand>
    {
        public MedicamentoCreateCommandValidator()
        {
            RuleFor(m => m.ProntuarioId)
                .NotEmpty().WithMessage("Id Prontuário obrigatório");

            RuleFor(m => m.Nome)
                .NotEmpty().WithMessage("Nome do medicamento obrigatório");

            RuleFor(m => m.Dosagem)
                .NotEmpty().WithMessage("Dosagem do medicamento obrigatória");

            RuleFor(m => m.Frequencia)
                .NotEmpty().WithMessage("Frequencia obrigatória");
        }
    }
}
