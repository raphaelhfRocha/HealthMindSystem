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
    public class GetPsicologosByNomeQueryHandler : IRequestHandler<GetPsicologosByNomeQuery, List<Psicologo>>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public GetPsicologosByNomeQueryHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;
        }

        public async Task<List<Psicologo>> Handle(GetPsicologosByNomeQuery request, CancellationToken cancellationToken)
        {
            var psicologosFound = await _psicologoRepository.GetPsicologosByNome(request.Nome);

            return psicologosFound ?? throw new KeyNotFoundException("Psicologos não encontrados");
        }
    }
}
