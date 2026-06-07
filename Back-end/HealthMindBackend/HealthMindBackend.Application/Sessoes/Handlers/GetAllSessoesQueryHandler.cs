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
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public GetAllSessoesQueryHandler(ISessaoRepository sessaoRepository, IPacienteRepository pacienteRepository, IPsicologoRepository psicologoRepository)
        {
            _sessaoRepository = sessaoRepository;
            _pacienteRepository = pacienteRepository;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<IEnumerable<Sessao>> Handle(GetAllSessoesQuery request, CancellationToken cancellationToken)
        {
            var sessoesFound = (await _sessaoRepository.GetAllSessoes()).ToList();

            return sessoesFound.Any() ? sessoesFound :
                throw new KeyNotFoundException("Sessões não encontradas");
        }
    }
}
