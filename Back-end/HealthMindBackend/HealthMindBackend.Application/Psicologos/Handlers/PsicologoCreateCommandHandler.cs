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
    public class PsicologoCreateCommandHandler : IRequestHandler<PsicologoCreateCommand, Psicologo>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public PsicologoCreateCommandHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Psicologo> Handle(PsicologoCreateCommand request, CancellationToken cancellationToken)
        {
            var psicologo = new Psicologo(request.Nome, request.Email, request.Senha,
                request.StatusCargo, request.StatusRole, request.CpfCnpj,
                request.Crp, request.Especialidade);

            if (psicologo == null)
                throw new ArgumentNullException(nameof(psicologo));

            await _psicologoRepository.CadastrarPsicologo(psicologo);

            return psicologo;
        }
    }
}
