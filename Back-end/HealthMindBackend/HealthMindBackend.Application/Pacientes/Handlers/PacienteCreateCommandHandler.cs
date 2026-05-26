using FluentValidation;
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
    public class PacienteCreateCommandHandler : IRequestHandler<PacienteCreateCommand, Paciente>
    {
        private readonly IValidator<PacienteCreateCommand> _validatorPacienteCreateCommand;
        private readonly IPacienteRepository _pacienteRepository;

        public PacienteCreateCommandHandler(IValidator<PacienteCreateCommand> validatorPacienteCreateCommand, IPacienteRepository pacienteRepository)
        {
            _validatorPacienteCreateCommand = validatorPacienteCreateCommand;
            _pacienteRepository = pacienteRepository;
        }

        public async Task<Paciente> Handle(PacienteCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorPacienteCreateCommand.ValidateAndThrowAsync(request);

            var paciente = new Paciente(request.Nome, request.Email, request.CpfCnpj, 
                request.Telefone, request.PsicologoId, request.DataNascimento);

            if (paciente == null)
                throw new ArgumentNullException(nameof(paciente));

            var createPaciente = await _pacienteRepository.CadastrarPaciente(paciente);

            return createPaciente;
        }
    }
}
