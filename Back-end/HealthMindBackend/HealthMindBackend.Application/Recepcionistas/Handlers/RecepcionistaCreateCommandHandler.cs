using FluentValidation;
using HealthMindBackend.Application.Recepcionistas.Commands;
using HealthMindBackend.Application.Usuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Recepcionistas.Handlers
{
    public class RecepcionistaCreateCommandHandler : IRequestHandler<RecepcionistaCreateCommand, Recepcionista>
    {
        private readonly IValidator<RecepcionistaCreateCommand> _validatorRecepcionistaCreateCommand;
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public RecepcionistaCreateCommandHandler(IValidator<RecepcionistaCreateCommand> validatorRecepcionistaCreateCommand, IRecepcionistaRepository recepcionistaRepository)
        {
            _validatorRecepcionistaCreateCommand = validatorRecepcionistaCreateCommand;
            _recepcionistaRepository = recepcionistaRepository;
        }

        public async Task<Recepcionista> Handle(RecepcionistaCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorRecepcionistaCreateCommand.ValidateAndThrowAsync(request);

            var recepcionista = new Recepcionista(
                request.Nome,
                request.Email,
                request.Senha,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj
            );

            return await _recepcionistaRepository.CadastrarRecepcionista(recepcionista);
        }
    }
}
