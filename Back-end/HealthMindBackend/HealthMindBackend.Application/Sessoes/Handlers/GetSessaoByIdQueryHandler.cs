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
    public class GetSessaoByIdQueryHandler : IRequestHandler<GetSessaoByIdQuery, Sessao>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public GetSessaoByIdQueryHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;           
        }

        public Task<Sessao> Handle(GetSessaoByIdQuery request, CancellationToken cancellationToken)
        {
            return _sessaoRepository.GetSessaoById(request.SessaoId) ??
                throw new KeyNotFoundException("Sessão não encontrada.");
        }
    }
}
