using HealthMindBackend.Application.Usuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Usuarios.Handlers
{
    public class RecepcionistaDeleteCommandHandler : IRequestHandler<RecepcionistaDeleteCommand, Recepcionista>
    {
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public RecepcionistaDeleteCommandHandler(IRecepcionistaRepository recepcionistaRepository)
        {
            _recepcionistaRepository = recepcionistaRepository;   
        }

        public async Task<Recepcionista> Handle(RecepcionistaDeleteCommand request, CancellationToken cancellationToken)
        {
            var recepcionistaFound = await _recepcionistaRepository.GetRecepcionistaById(request.Id);

            if (recepcionistaFound == null)
                throw new KeyNotFoundException("Recepcionista não encontrado");

            await _recepcionistaRepository.ExcluirRecepcionista(request.Id);

            return recepcionistaFound;
        }
    }
}
