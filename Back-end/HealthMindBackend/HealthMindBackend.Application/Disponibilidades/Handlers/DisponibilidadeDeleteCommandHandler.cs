using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Handlers
{
    public class DisponibilidadeDeleteCommandHandler : IRequestHandler<DisponibilidadeDeleteCommand, Disponibilidade>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public DisponibilidadeDeleteCommandHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Disponibilidade> Handle(DisponibilidadeDeleteCommand request, CancellationToken cancellationToken)
        {
            var disponibilidadeFound = await _psicologoRepository.GetDisponibilidadeByPsicologoIdAndDisponibilidadeId(request.PsicologoId, request.DisponibilidadeId);

            disponibilidadeFound = disponibilidadeFound ?? throw new KeyNotFoundException("Disponibilidade não encontrada");

            await _psicologoRepository.ExcluirDisponibilidade(request.PsicologoId, request.DisponibilidadeId);

            return disponibilidadeFound;
        }
    }
}
