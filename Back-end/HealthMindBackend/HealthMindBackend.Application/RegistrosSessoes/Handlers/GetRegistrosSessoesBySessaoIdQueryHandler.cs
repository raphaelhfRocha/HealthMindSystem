using HealthMindBackend.Application.RegistrosSessoes.Queries;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.RegistrosSessoes.Handlers
{
    public class GetRegistrosSessoesBySessaoIdQueryHandler : IRequestHandler<GetRegistrosSessoesBySessaoIdQuery, List<RegistroSessao>>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public GetRegistrosSessoesBySessaoIdQueryHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<List<RegistroSessao>> Handle(GetRegistrosSessoesBySessaoIdQuery request, CancellationToken cancellationToken)
        {
            return await _sessaoRepository.GetRegistrosSessoesBySessaoId(request.SessaoId);
        }
    }
}
