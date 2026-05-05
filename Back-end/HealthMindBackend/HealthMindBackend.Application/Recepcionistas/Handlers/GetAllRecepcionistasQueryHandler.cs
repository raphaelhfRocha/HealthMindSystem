using HealthMindBackend.Application.Usuarios.Queries;
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
    public class GetAllRecepcionistasQueryHandler : IRequestHandler<GetAllRecepcionistasQuery, IEnumerable<Recepcionista>>
    {
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public GetAllRecepcionistasQueryHandler(IRecepcionistaRepository recepcionistaRepository)
        {
            _recepcionistaRepository = recepcionistaRepository;
        }

        public async Task<IEnumerable<Recepcionista>> Handle(GetAllRecepcionistasQuery request, CancellationToken cancellationToken)
        {
            var recepcionistasFound = await _recepcionistaRepository.GetAllRecepcionistas();

            if (!recepcionistasFound.Any())
                throw new KeyNotFoundException("Recepcionistas não encontrados.");

            return recepcionistasFound;
        }
    }
}
