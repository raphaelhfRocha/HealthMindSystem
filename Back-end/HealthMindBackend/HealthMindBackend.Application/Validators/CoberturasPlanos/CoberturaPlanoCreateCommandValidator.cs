using FluentValidation;
using HealthMindBackend.Application.CoberturasPlanos.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.CoberturasPlanos
{
    public class CoberturaPlanoCreateCommandValidator : AbstractValidator<CoberturaPlanoCreateCommand>
    {
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public CoberturaPlanoCreateCommandValidator(IPlanoSaudeRepository planoSaudeRepository)
        {
            _planoSaudeRepository = planoSaudeRepository;

            RuleFor(c => c.PlanoSaudeId)
                .NotEmpty().WithMessage("Plano Saude Obrigatório");

            RuleFor(c => c.Especialidade)
                .NotEmpty().WithMessage("Especialidade Cobertura Obrigatória")
                .MustAsync(async (command, none, cancellationToken) =>
                {

                    var coberturaPlanoFound = await _planoSaudeRepository.GetCoberturaPlanoByPlanoSaudeIdAndEspecialidade(command.PlanoSaudeId, command.Especialidade);
                    return coberturaPlanoFound == null;

                })
                .WithMessage("Cobertura Plano já registrado");

            RuleFor(c => c.PercentualCobertura)
                .NotEmpty().WithMessage("Percentual Cobertura Obrigatório")
                .Must(p => p > 0).WithMessage("Percentual Cobertura deve ser maior que zero");

            RuleFor(p => p.ValorMaximoCobertura)
                .NotEmpty().WithMessage("Valor Máximo Cobertura Obrigatório")
                .Must(p => p > 0).WithMessage("Valor Máximo Cobertura deve ser maior que zero");
        }
    }
}
