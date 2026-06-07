using HealthMindBackend.Application.Psicologos.Queries;
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
    public class GetPsicologoByIdQueryHandler : IRequestHandler<GetPsicologoByIdQuery, Psicologo>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public GetPsicologoByIdQueryHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public Task<Psicologo> Handle(GetPsicologoByIdQuery request, CancellationToken cancellationToken)
        {
            return _psicologoRepository.GetPsicologoById(request.Id);
        }
    }
}
