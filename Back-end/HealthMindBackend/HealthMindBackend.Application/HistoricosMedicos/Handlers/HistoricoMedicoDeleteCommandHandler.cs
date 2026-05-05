using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Handlers
{
    public class HistoricoMedicoDeleteCommandHandler : IRequestHandler<HistoricoMedicoDeleteCommand, HistoricoMedico>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public HistoricoMedicoDeleteCommandHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<HistoricoMedico> Handle(HistoricoMedicoDeleteCommand request, CancellationToken cancellationToken)
        {
            var historicoMedicoFound = await _historicoMedicoRepository.GetHistoricoById(request.Id);

            if (historicoMedicoFound == null)
                throw new KeyNotFoundException("Histórico médico não encontrado");

            await _historicoMedicoRepository.ExcluirHistoricoMedico(request.Id);

            return historicoMedicoFound;
        }
    }
}
