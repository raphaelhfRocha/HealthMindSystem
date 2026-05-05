using HealthMindBackend.Application.Pacientes.Commands;
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
    public class PacienteDeleteCommandHandler : IRequestHandler<PacienteDeleteCommand, Paciente>
    {
        private readonly IPacienteRepository _pacienteRepository;

        public PacienteDeleteCommandHandler(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }

        public async Task<Paciente> Handle(PacienteDeleteCommand request, CancellationToken cancellationToken)
        {
            var pacienteFound = await _pacienteRepository.GetPacienteById(request.Id);

            if (pacienteFound == null)
                throw new KeyNotFoundException("Paciente não encontrado.");

            await _pacienteRepository.ExcluirPaciente(pacienteFound.Id);

            return pacienteFound;
        }
    }
}
