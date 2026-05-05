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
    public class PsicologoUpdateCommandHandler : IRequestHandler<PsicologoUpdateCommand, Psicologo>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public PsicologoUpdateCommandHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Psicologo> Handle(PsicologoUpdateCommand request, CancellationToken cancellationToken)
        {
            var psicologoFound = await _psicologoRepository.GetPsicologoById(request.Id);

            if (psicologoFound == null)
                throw new KeyNotFoundException("Psicólogo não encontrado");

            psicologoFound.Update(request.Nome, request.Email, request.Senha, request.StatusCargo, request.StatusRole, request.CpfCnpj, request.Crp, request.Especialidade);

            return await _psicologoRepository.EditarPsicologo(request.Id, psicologoFound);
        }
    }
}
