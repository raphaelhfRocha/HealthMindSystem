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
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public RecepcionistaCreateCommandHandler(IRecepcionistaRepository recepcionistaRepository)
        {
            _recepcionistaRepository = recepcionistaRepository;
        }

        public Task<Recepcionista> Handle(RecepcionistaCreateCommand request, CancellationToken cancellationToken)
        {
            var recepcionista = new Recepcionista(request.Nome, request.Email, request.Senha, request.StatusCargo, request.StatusRole, request.CpfCnpj);

            if (recepcionista == null)
                throw new ArgumentNullException(nameof(recepcionista));

            return _recepcionistaRepository.CadastrarRecepcionista(recepcionista);
        }
    }
}
