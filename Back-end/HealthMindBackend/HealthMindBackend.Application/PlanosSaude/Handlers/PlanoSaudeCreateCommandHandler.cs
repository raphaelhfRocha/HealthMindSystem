using HealthMindBackend.Application.PlanosSaude.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.PlanosSaude.Handlers
{
    public class PlanoSaudeCreateCommandHandler : IRequestHandler<PlanoSaudeCreateCommand, PlanoSaude>
    {
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public PlanoSaudeCreateCommandHandler(IPlanoSaudeRepository planoSaudeRepository)
        {
            _planoSaudeRepository = planoSaudeRepository;
        }

        public async Task<PlanoSaude> Handle(PlanoSaudeCreateCommand request, CancellationToken cancellationToken)
        {
            var planoSaude = new PlanoSaude(request.Nome, request.Codigo, request.StatusPlanoSaude, request.Telefone, request.Email);

            planoSaude = planoSaude ??
                throw new ArgumentNullException("Não foi possível registrar plano de saúde");

            var planoSaudeRegistrado = await _planoSaudeRepository.RegistrarPlanoSaude(planoSaude);

            return planoSaudeRegistrado;

        }
    }
}
