using HealthMindBackend.Application.Progressoes.Query;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Progressoes.Handlers
{
    public class GetAllProgressoesQueryHandler : IRequestHandler<GetAllProgressoesQuery, IEnumerable<Progressao>>
    {
        private readonly IProgressaoRepository _progressaoRepository;

        public GetAllProgressoesQueryHandler(IProgressaoRepository progressaoRepository)
        {
            _progressaoRepository = progressaoRepository;
        }

        public async Task<IEnumerable<Progressao>> Handle(GetAllProgressoesQuery request, CancellationToken cancellationToken)
        {
            var progressoesFound = await _progressaoRepository.GetAllProgressoes();

            return progressoesFound.Any() ? progressoesFound : 
                throw new KeyNotFoundException("Progressões não encontradas");
        }
    }
}
