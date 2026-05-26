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
    public class PacienteUpdateCommandHandler : IRequestHandler<PacienteUpdateCommand, Paciente>
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IValidator<PacienteUpdateCommand> _validatorPacienteUpdateCommand;
        public PacienteUpdateCommandHandler(IValidator<PacienteUpdateCommand> validatorPacienteUpdateCommand, IPacienteRepository pacienteRepository)
        {
            _validatorPacienteUpdateCommand = validatorPacienteUpdateCommand;
            _pacienteRepository = pacienteRepository;
        }

        public async Task<Paciente> Handle(PacienteUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorPacienteUpdateCommand.ValidateAndThrowAsync(request);

            var pacienteFound = await _pacienteRepository.GetPacienteById(request.Id);

            pacienteFound = pacienteFound ?? throw new KeyNotFoundException("Paciente não encontrado");

            pacienteFound.Update(request.Nome, request.Email, request.CpfCnpj, request.Telefone, request.PsicologoId, request.DataNascimento);

            return await _pacienteRepository.EditarPaciente(request.Id, pacienteFound);
        }
    }
}
