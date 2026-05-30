using HealthMindBackend.Application.EscalasSessoes.Queries;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.EscalasSessoes.Handlers
{
    public class GetEscalasSessoesBySessaoIdQueryHandler : IRequestHandler<GetEscalasSessoesBySessaoIdQuery, List<EscalaSessao>>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public GetEscalasSessoesBySessaoIdQueryHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;
        }

        public async Task<List<EscalaSessao>> Handle(GetEscalasSessoesBySessaoIdQuery request, CancellationToken cancellationToken)
        {
            return await _sessaoRepository.GetEscalasSessoesBySessaoId(request.SessaoId);
        }
    }
}
