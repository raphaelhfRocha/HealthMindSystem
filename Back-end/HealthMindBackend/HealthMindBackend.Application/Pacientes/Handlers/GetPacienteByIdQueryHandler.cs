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
    public class GetPacienteByIdQueryHandler : IRequestHandler<GetPacienteByIdQuery, Paciente>
    {
        private readonly IPacienteRepository _pacienteRepository;

        public GetPacienteByIdQueryHandler(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }

        public async Task<Paciente> Handle(GetPacienteByIdQuery request, CancellationToken cancellationToken)
        {
            var pacienteFound = await _pacienteRepository.GetPacienteById(request.Id);

            return pacienteFound ?? throw new KeyNotFoundException("Paciente não encontrado");
        }
    }
}
