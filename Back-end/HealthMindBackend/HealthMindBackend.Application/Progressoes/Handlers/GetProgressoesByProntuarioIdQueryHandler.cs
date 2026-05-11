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
    public class GetProgressoesByProntuarioIdQueryHandler : IRequestHandler<GetProgressoesByProntuarioIdQuery, List<Progressao>>
    {
        private readonly IProgressaoRepository _progressaoRepository;

        public GetProgressoesByProntuarioIdQueryHandler(IProgressaoRepository progressaoRepository)
        {
            _progressaoRepository = progressaoRepository;            
        }

        public async Task<List<Progressao>> Handle(GetProgressoesByProntuarioIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _progressaoRepository.GetProgressoesByProntuarioId(request.ProntuarioId);

            return result ?? throw new KeyNotFoundException("Progressões não encontradas");
        }
    }
}
