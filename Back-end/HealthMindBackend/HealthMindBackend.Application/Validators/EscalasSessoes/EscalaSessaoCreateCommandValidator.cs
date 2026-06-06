using FluentValidation;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.EscalasSessoes
{
    public class EscalaSessaoCreateCommandValidator : AbstractValidator<EscalaSessaoCreateCommand>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public EscalaSessaoCreateCommandValidator(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;

            RuleFor(e => e.SessaoId)
                .NotEmpty().WithMessage("Sessão Obrigatória")
                .MustAsync(async (sessaoId, cancellationToken) =>
                {
                    var escalaSessaoFound = await _sessaoRepository.GetEscalasSessoesBySessaoId(sessaoId);
                    return escalaSessaoFound == null;

                }).WithMessage("Escala Sessão já registrada.");

            RuleFor(e => e.Humor)
                .Must(e => e >= 0 && e <= 10).WithMessage("Humor deve ser entre 0 e 10");

            RuleFor(e => e.Ansiedade)
                .Must(e => e >= 0 && e <= 10).WithMessage("Ansiedade deve ser entre 0 e 10");

            RuleFor(e => e.Sono)
                .Must(e => e >= 0 && e <= 10).WithMessage("Sono deve ser entre 0 e 10");

            RuleFor(e => e.FuncSocial)
                .Must(e => e >= 0 && e <= 10).WithMessage("Func.Social deve ser entre 0 e 10");

        }
    }
}
