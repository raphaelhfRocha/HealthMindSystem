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
    public class GetPacientesByPsicologoIdQueryHandler : IRequestHandler<GetPacientesByPsicologoIdQuery, List<Paciente>>
    {
        private readonly IPacienteRepository _pacienteRepository;

        public GetPacientesByPsicologoIdQueryHandler(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }

        public async Task<List<Paciente>> Handle(GetPacientesByPsicologoIdQuery request, CancellationToken cancellationToken)
        {
            return await _pacienteRepository.GetPacientesByPsicologoId(request.PsicologoId) ??
                throw new KeyNotFoundException("Pacientes não encontrados");
        }
    }
}
