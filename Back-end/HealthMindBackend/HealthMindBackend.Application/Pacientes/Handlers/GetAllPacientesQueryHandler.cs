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
    public class GetAllPacientesQueryHandler : IRequestHandler<GetAllPacientesQuery, IEnumerable<Paciente>>
    {
        private readonly IPacienteRepository _pacienteRepository;

        public GetAllPacientesQueryHandler(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }
        public async Task<IEnumerable<Paciente>> Handle(GetAllPacientesQuery request, CancellationToken cancellationToken)
        {
            var pacientes = await _pacienteRepository.GetAllPacientes();

            if (!pacientes.Any())
                throw new KeyNotFoundException("Pacientes não encontrados");

            return pacientes;
        }
    }
}
