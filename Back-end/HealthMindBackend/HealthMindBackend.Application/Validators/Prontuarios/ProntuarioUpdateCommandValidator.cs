using FluentValidation;
using HealthMindBackend.Application.Prontuarios.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Prontuarios
{
    public class ProntuarioUpdateCommandValidator : AbstractValidator<ProntuarioUpdateCommand>
    {
        public ProntuarioUpdateCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("Id Prontuário Obrigatório");
            
            RuleFor(p => p.PacienteId)
    .           NotEmpty().WithMessage("Paciente Obrigatório");

        }
    }
}
