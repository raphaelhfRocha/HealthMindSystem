using HealthMindBackend.Application.Psicologos.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Handlers
{
    public class PsicologoDeleteCommandHandler : IRequestHandler<PsicologoDeleteCommand, Psicologo>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public PsicologoDeleteCommandHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Psicologo> Handle(PsicologoDeleteCommand request, CancellationToken cancellationToken)
        {
            var psicologoFound = await _psicologoRepository.GetPsicologoById(request.Id);

            if (psicologoFound == null)
                throw new KeyNotFoundException("Psicólogo não encontrado.");

            await _psicologoRepository.ExcluirPsicologo(request.Id);

            return psicologoFound;
        }
    }
}
