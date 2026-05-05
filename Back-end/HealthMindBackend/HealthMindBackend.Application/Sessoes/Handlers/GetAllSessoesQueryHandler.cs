using HealthMindBackend.Application.Sessoes.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Handlers
{
    public class GetAllSessoesQueryHandler : IRequestHandler<GetAllSessoesQuery, IEnumerable<Sessao>>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public GetAllSessoesQueryHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<IEnumerable<Sessao>> Handle(GetAllSessoesQuery request, CancellationToken cancellationToken)
        {
            var sessoesFound = await _sessaoRepository.GetAllSessoes();

            if (!sessoesFound.Any())
                throw new KeyNotFoundException("Sessões não encontradas");

            return sessoesFound;
        }
    }
}
