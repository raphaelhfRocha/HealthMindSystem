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
    public class CoberturaPlanoDeleteCommandHandler : IRequestHandler<CoberturaPlanoDeleteCommand, CoberturaPlano>
    {
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public CoberturaPlanoDeleteCommandHandler(IPlanoSaudeRepository planoSaudeRepository)
        {
            _planoSaudeRepository = planoSaudeRepository;
        }

        public async Task<CoberturaPlano> Handle(CoberturaPlanoDeleteCommand request, CancellationToken cancellationToken)
        {
            var coberturaPlanoFound = await _planoSaudeRepository
                .GetCoberturaPlanoByPlanoSaudeIdAndEspecialidade(request.PlanoSaudeId, request.Especialidade);

            coberturaPlanoFound = coberturaPlanoFound ?? 
                throw new KeyNotFoundException("Cobertura Plano não encontrada");

            await _planoSaudeRepository.RemoverCoberturaPlano(request.PlanoSaudeId, request.Especialidade);

            return coberturaPlanoFound;
        }
    }
}
