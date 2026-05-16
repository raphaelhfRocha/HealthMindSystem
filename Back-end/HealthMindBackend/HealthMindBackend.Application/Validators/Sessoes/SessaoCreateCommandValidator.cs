using FluentValidation;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Sessoes
{
    public class SessaoCreateCommandValidator : AbstractValidator<SessaoCreateCommand>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public SessaoCreateCommandValidator(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;

            RuleFor(s => s.PacienteId)
                .NotEmpty().WithMessage("Paciente Obrigatório");

            RuleFor(s => s.PsicologoId)
                .NotEmpty().WithMessage("Psicólogo Obrigatório")
                .MustAsync(async (psicologoId, cancellationToken) =>
                {
                    var psicologo = await _psicologoRepository.GetPsicologoById(psicologoId);
                    return psicologo != null;
                }).WithMessage("O psicologo não está ativo");

            RuleFor(s => s.DataSessao)
                .NotEmpty().WithMessage("Data Sessão Obrigatória");

            RuleFor(s => s.HoraInicio)
                .NotEmpty().WithMessage("Hora Inicio Obrigatória");
        }
    }
}
