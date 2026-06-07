using HealthMindBackend.Application.SaudesMentais.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.SaudesMentais.Handlers
{
    public class SaudeMentalDeleteCommandHandler : IRequestHandler<SaudeMentalDeleteCommand, SaudeMental>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public SaudeMentalDeleteCommandHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<SaudeMental> Handle(SaudeMentalDeleteCommand request, CancellationToken cancellationToken)
        {
            var historicoMedicoFound = await _historicoMedicoRepository.GetHistoricoById(request.HistoricoMedicoId);

            historicoMedicoFound.SaudeMental = historicoMedicoFound.SaudeMental ?? throw new KeyNotFoundException("Saude Mental não encontrado");

            await _historicoMedicoRepository.ExcluirSaudeMental(request.HistoricoMedicoId);

            return historicoMedicoFound.SaudeMental;
        }
    }
}
