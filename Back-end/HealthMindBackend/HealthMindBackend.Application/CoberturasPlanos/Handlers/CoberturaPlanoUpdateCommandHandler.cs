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
    public class CoberturaPlanoUpdateCommandHandler : IRequestHandler<CoberturaPlanoUpdateCommand, CoberturaPlano>
    {
        private readonly IValidator<CoberturaPlanoUpdateCommand> _validatorCoberturaPlanoUpdateCommand;
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public CoberturaPlanoUpdateCommandHandler(IValidator<CoberturaPlanoUpdateCommand> validatorCoberturaPlanoUpdateCommand, 
            IPlanoSaudeRepository planoSaudeRepository)
        {
            _validatorCoberturaPlanoUpdateCommand = validatorCoberturaPlanoUpdateCommand;
            _planoSaudeRepository = planoSaudeRepository;
        }

        public async Task<CoberturaPlano> Handle(CoberturaPlanoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorCoberturaPlanoUpdateCommand.ValidateAndThrowAsync(request);

            var planoSaudeFound = await _planoSaudeRepository.GetPlanoSaudeById(request.PlanoSaudeId);

            planoSaudeFound = planoSaudeFound ?? 
                throw new KeyNotFoundException("Plano de Saude não encontrado");

            var coberturaPlanoUpdated = new CoberturaPlano(
                request.Especialidade,
                request.PercentualCobertura,
                request.ValorMaximoCobertura
            );

            return await _planoSaudeRepository.AtualizarCoberturaPlano(request.PlanoSaudeId, request.Especialidade, coberturaPlanoUpdated);
        }
    }
}
