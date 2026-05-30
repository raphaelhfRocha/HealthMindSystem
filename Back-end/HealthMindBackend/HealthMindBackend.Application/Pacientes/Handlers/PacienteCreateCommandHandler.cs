using FluentValidation;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Convenios.PlanoSaudePaciente;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
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
                request.Telefone, request.PsicologoId, request.DataNascimento, request.PlanoSaudePaciente);

            var result = await _pacienteRepository.CadastrarPaciente(paciente);

            var planoSaudePaciente = new PlanoSaudePaciente(
                    result.Id, request.PlanoSaudePaciente.PlanoSaudeId,
                    request.PlanoSaudePaciente.NumeroCarteirinha,
                    request.PlanoSaudePaciente.DataValidade
                );

            var planoSaudePacienteDefinido = planoSaudePaciente != null
                ? await _pacienteRepository.DefinirPlanoSaudePaciente(result.Id, planoSaudePaciente)
                : null;

            result.PlanoSaudePaciente = planoSaudePacienteDefinido;

            return result;
        }
    }
}
