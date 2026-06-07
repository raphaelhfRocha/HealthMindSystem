using HealthMindBackend.Application.PlanosSaude.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.PlanosSaude.Handlers
{
    public class GetAllPlanosSaudeQueryHandler : IRequestHandler<GetAllPlanosSaudeQuery, IEnumerable<PlanoSaude>>
    {
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public GetAllPlanosSaudeQueryHandler(IPlanoSaudeRepository planoSaudeRepository)
        {
            _planoSaudeRepository = planoSaudeRepository;
        }

        public async Task<IEnumerable<PlanoSaude>> Handle(GetAllPlanosSaudeQuery request, CancellationToken cancellationToken)
        {
            return await _planoSaudeRepository.GetAllPlanosSaude();
        }
    }
}
