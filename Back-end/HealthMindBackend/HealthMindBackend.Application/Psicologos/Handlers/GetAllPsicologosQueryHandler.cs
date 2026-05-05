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
    public class GetAllPsicologosQueryHandler : IRequestHandler<GetAllPsicologosQuery, IEnumerable<Psicologo>>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public GetAllPsicologosQueryHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<IEnumerable<Psicologo>> Handle(GetAllPsicologosQuery request, CancellationToken cancellationToken)
        {
            var psicologosFound = await _psicologoRepository.GetAllPsicologos();

            if (!psicologosFound.Any())
                throw new KeyNotFoundException("Psicólogos não encontrados.");

            return psicologosFound;
        }
    }
}
