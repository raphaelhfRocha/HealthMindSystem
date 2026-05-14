using HealthMindBackend.Application.Prontuarios.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Prontuarios.Handlers
{
    public class GetAllProntuariosQueryHandler : IRequestHandler<GetAllProntuariosQuery, IEnumerable<Prontuario>>
    {
        private readonly IProntuarioRepository _prontuarioRepository;

        public GetAllProntuariosQueryHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;
        }
        public async Task<IEnumerable<Prontuario>> Handle(GetAllProntuariosQuery request, CancellationToken cancellationToken)
        {
            var prontuariosFound = await _prontuarioRepository.GetAllProntuarios();

            return prontuariosFound.Any() ? prontuariosFound :
                throw new KeyNotFoundException("Prontuarios não encontrados");
        }
    }
}
