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
    public class PlanoSaudeUpdateCommandHandler : IRequestHandler<PlanoSaudeUpdateCommand, PlanoSaude>
    {
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public PlanoSaudeUpdateCommandHandler(IPlanoSaudeRepository planoSaudeRepository)
        {
            _planoSaudeRepository = planoSaudeRepository;
        }

        public async Task<PlanoSaude> Handle(PlanoSaudeUpdateCommand request, CancellationToken cancellationToken)
        {
            var planoSaudeFound = await _planoSaudeRepository.GetPlanoSaudeById(request.Id);

            planoSaudeFound = planoSaudeFound ??
                throw new KeyNotFoundException("Plano Saúde não encontrado");

            planoSaudeFound.Update(request.Nome, request.Codigo, request.StatusPlanoSaude, request.Telefone, request.Email, request.CoberturasPlano);

            return await _planoSaudeRepository.AtualizarPlanoSaude(request.Id, planoSaudeFound);
        }
    }
}
