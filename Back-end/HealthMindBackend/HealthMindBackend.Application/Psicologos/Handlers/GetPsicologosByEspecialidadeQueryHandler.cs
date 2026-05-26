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
    public class GetPsicologosByEspecialidadeQueryHandler : IRequestHandler<GetPsicologosByEspecialidadeQuery, List<Psicologo>>
    {
        private readonly IPsicologoRepository _psicologoRepository;
        public GetPsicologosByEspecialidadeQueryHandler(IPsicologoRepository psicologoRepository)
        {
            _psicologoRepository = psicologoRepository;           
        }

        public async Task<List<Psicologo>> Handle(GetPsicologosByEspecialidadeQuery request, CancellationToken cancellationToken)
        {
            var psicologosFound = await _psicologoRepository.GetPsicologosByEspecialidade(request.Especialidade);

            psicologosFound = psicologosFound ?? throw new KeyNotFoundException("Psicólogos não encontrados");

            return psicologosFound;
        }
    }
}
