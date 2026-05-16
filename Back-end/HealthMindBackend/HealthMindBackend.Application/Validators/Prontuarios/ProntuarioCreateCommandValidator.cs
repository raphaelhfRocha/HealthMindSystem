using FluentValidation;
using HealthMindBackend.Application.Prontuarios.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Prontuarios
{
    public class ProntuarioCreateCommandValidator : AbstractValidator<ProntuarioCreateCommand>
    {
        public ProntuarioCreateCommandValidator()
        {
            RuleFor(p => p.PacienteId)
                .NotEmpty().WithMessage("Paciente Obrigatório");

            RuleFor(p => p.Descricao)
                .NotEmpty().WithMessage("Descrição Obrigatória");
        }
    }
}
