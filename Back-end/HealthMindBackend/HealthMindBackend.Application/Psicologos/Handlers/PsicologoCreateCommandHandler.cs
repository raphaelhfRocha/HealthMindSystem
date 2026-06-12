using FluentValidation;
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
        private readonly IValidator<PsicologoCreateCommand> _validatorPsicologoCreateCommand;
        private readonly IPsicologoRepository _psicologoRepository;

        public PsicologoCreateCommandHandler(IValidator<PsicologoCreateCommand> validatorPsicologoCreateCommand, IPsicologoRepository psicologoRepository)
        {
            _validatorPsicologoCreateCommand = validatorPsicologoCreateCommand;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Psicologo> Handle(PsicologoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorPsicologoCreateCommand.ValidateAndThrowAsync(request);

            var psicologo = new Psicologo(
                request.Nome,
                null,
                null,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj,
                request.Crp,
                request.Especialidade,
                request.ValorConsulta
            );

            await _psicologoRepository.CadastrarPsicologo(psicologo);

            return psicologo;
        }
    }
}
