using FluentValidation;
using HealthMindBackend.Application.CoberturasPlanos.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.CoberturasPlanos.Handlers
{
    public class CoberturaPlanoCreateCommandHandler : IRequestHandler<CoberturaPlanoCreateCommand, CoberturaPlano>
    {
        private readonly IValidator<CoberturaPlanoCreateCommand> _validatorCoberturaPlanoCreateCommand;
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public CoberturaPlanoCreateCommandHandler(IValidator<CoberturaPlanoCreateCommand> validatorCoberturaPlanoCreateCommand, IPlanoSaudeRepository planoSaudeRepository)
        {
            _validatorCoberturaPlanoCreateCommand = validatorCoberturaPlanoCreateCommand;
            _planoSaudeRepository = planoSaudeRepository;
        }

        public async Task<CoberturaPlano> Handle(CoberturaPlanoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorCoberturaPlanoCreateCommand.ValidateAndThrowAsync(request);

            var planoSaudeFound = await _planoSaudeRepository.GetPlanoSaudeById(request.PlanoSaudeId);

            planoSaudeFound = planoSaudeFound ??
                throw new KeyNotFoundException("Plano de Saude não encontrado");

            var coberturaPlano = new CoberturaPlano(
                request.Especialidade,
                request.PercentualCobertura,
                request.ValorMaximoCobertura
            );

            return await _planoSaudeRepository.RegistrarCoberturaPlano(request.PlanoSaudeId, coberturaPlano);
        }
    }
}
