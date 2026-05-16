using FluentValidation;
using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Progressoes
{
    public class ProgressaoCreateCommandValidator : AbstractValidator<ProgressaoCreateCommand>
    {
        public ProgressaoCreateCommandValidator()
        {
            RuleFor(p => p.PacienteId)
                .NotEmpty().WithMessage("Id Paciente Obrigatório");

            RuleFor(p => p.ProntuarioId)
                .NotEmpty().WithMessage("Id Prontuário Obrigatório");

            RuleFor(p => p.Descricao)
                .NotEmpty().WithMessage("Descrição Obrigatória");

            RuleFor(p => p.DataRegistro)
                .NotEmpty().WithMessage("Data Registro Obrigatória");
        }
    }
}
