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
    public class RecepcionistaUpdateCommandHandler : IRequestHandler<RecepcionistaUpdateCommand, Recepcionista>
    {
        private readonly IValidator<RecepcionistaUpdateCommand> _validatorRecepcionistaUpdateCommand;
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public RecepcionistaUpdateCommandHandler(IValidator<RecepcionistaUpdateCommand> validatorRecepcionistaUpdateCommand, IRecepcionistaRepository recepcionistaRepository)
        {
            _validatorRecepcionistaUpdateCommand = validatorRecepcionistaUpdateCommand;
            _recepcionistaRepository = recepcionistaRepository;            
        }

        public async Task<Recepcionista> Handle(RecepcionistaUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorRecepcionistaUpdateCommand.ValidateAndThrowAsync(request);

            var recepcionistaFound = await _recepcionistaRepository.GetRecepcionistaById(request.Id);

            if (recepcionistaFound == null)
                throw new KeyNotFoundException("Recepcionista não encontrado");
     
            recepcionistaFound.Update(request.Nome, request.Email,
                request.StatusCargo, request.StatusRole, request.CpfCnpj);

            return await _recepcionistaRepository.EditarRecepcionista(request.Id, recepcionistaFound);
        }
    }
}
