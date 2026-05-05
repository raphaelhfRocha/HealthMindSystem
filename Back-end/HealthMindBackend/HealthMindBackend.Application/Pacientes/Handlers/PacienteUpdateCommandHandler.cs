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
    public class PacienteUpdateCommandHandler : IRequestHandler<PacienteUpdateCommand, Paciente>
    {
        private readonly IPacienteRepository _pacienteRepository;

        public PacienteUpdateCommandHandler(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }

        public async Task<Paciente> Handle(PacienteUpdateCommand request,
            CancellationToken cancellationToken)
        {
            var pacienteFound = await _pacienteRepository.GetPacienteById(request.Id);

            if (pacienteFound == null)
                throw new KeyNotFoundException("Paciente não encontrado.");

            pacienteFound.Update(request.Nome, request.Email, request.CpfCnpj, request.DataNascimento);

            return await _pacienteRepository.EditarPaciente(request.Id, pacienteFound);
        }
    }
}
