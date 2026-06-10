using HealthMindBackend.Application.Recepcionistas.Queries;
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
    public class GetRecepcionistaByIdQueryHandler : IRequestHandler<GetRecepcionistaByIdQuery, Recepcionista>
    {
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public GetRecepcionistaByIdQueryHandler(IRecepcionistaRepository recepcionistaRepository)
        {
            _recepcionistaRepository = recepcionistaRepository;
        }

        public async Task<Recepcionista> Handle(GetRecepcionistaByIdQuery request, CancellationToken cancellationToken)
        {
            return await _recepcionistaRepository.GetRecepcionistaById(request.Id);
        }
    }
}
