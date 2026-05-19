using HealthMindBackend.Application.Pacientes.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Handlers
{
    public class GetPacientesByNomeQueryHandler : IRequestHandler<GetPacientesByNomeQuery, List<Paciente>>
    {
        private readonly IPacienteRepository _pacienteRepository;

        public GetPacientesByNomeQueryHandler(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }

        public async Task<List<Paciente>> Handle(GetPacientesByNomeQuery request, CancellationToken cancellationToken)
        {
            var pacientesFound = await _pacienteRepository.GetPacientesByNome(request.Nome);

            return pacientesFound ?? throw new KeyNotFoundException("Pacientes não encontrados");
        }
    }
}
