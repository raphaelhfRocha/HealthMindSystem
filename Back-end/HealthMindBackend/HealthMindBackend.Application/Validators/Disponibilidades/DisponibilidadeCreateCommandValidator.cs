using FluentValidation;
using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Disponibilidades
{
    public class DisponibilidadeCreateCommandValidator : AbstractValidator<DisponibilidadeCreateCommand>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public DisponibilidadeCreateCommandValidator(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;

            RuleFor(d => d.DataDisponibilidade)
                .NotEmpty().WithMessage("Data Disponibilidade obrigatória");

            RuleFor(d => d.HoraInicio)
                .NotEmpty().WithMessage("Hora Inicio obrigatória");
        }
    }
}
