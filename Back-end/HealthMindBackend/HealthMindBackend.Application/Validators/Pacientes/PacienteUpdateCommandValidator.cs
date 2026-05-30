using FluentValidation;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Validators.Common;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Pacientes
{
    public class PacienteUpdateCommandValidator : AbstractValidator<PacienteUpdateCommand>
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IPsicologoRepository _psicologoRepository;
        private readonly IPlanoSaudeRepository _planoSaudeRepository;

        public PacienteUpdateCommandValidator(IPacienteRepository pacienteRepository, IPsicologoRepository psicologoRepository, IPlanoSaudeRepository planoSaudeRepository)
        {
            _pacienteRepository = pacienteRepository;
            _psicologoRepository = psicologoRepository;
            _planoSaudeRepository = planoSaudeRepository;

            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("Id Paciente obrigatório");

            RuleFor(p => p.Nome)
                .NotEmpty().WithMessage("Nome Paciente Obrigatório")
                .MinimumLength(8).WithMessage("Nome Paciente deve ter no mínimo 8 caracteres")
                .MaximumLength(120).WithMessage("Nome Paciente deve ter no máximo 120 caracteres");

            RuleFor(p => p.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Paciente Obrigatório")
                .EmailAddress().WithMessage("E-mail Inválido")
                .MustAsync(async (command, email, cancellationToken) =>
                {
                    var existente = await _pacienteRepository.GetPacienteByEmail(email);
                    return existente == null || existente.Id == command.Id;
                })
                .WithMessage("E-mail Já Cadastrado");

            RuleFor(p => p.DataNascimento)
                .NotEmpty().WithMessage("Data Nascimento Obrigatória");

            RuleFor(p => p.CpfCnpj.Numero)
                .NotEmpty().WithMessage("CPF/CNPJ Paciente Obrigatório")
                .Must(CpfCnpjValidationHelper.IsValid).WithMessage("CPF/CNPJ Inválido")
                .MustAsync(async (command, cpfCnpj, cancellationToken) =>
                {
                    var existente = await _pacienteRepository.GetPacienteByCpfCnpj(cpfCnpj);
                    return existente == null || existente.Id == command.Id;
                })
                .WithMessage("CPF/CNPJ já cadastrado no sistema");

            RuleFor(p => p.Telefone.Numero)
                .NotEmpty().WithMessage("Telefone Paciente Obrigatório")
                .Must(TelefoneValidationHelper.IsValid).WithMessage("Telefone Inválido")
                .MustAsync(async (command, telefone, cancellationToken) =>
                {
                    var existente = await _pacienteRepository.GetPacienteByTelefone(telefone);
                    return existente == null || existente.Id == command.Id;
                })
                .WithMessage("Telefone já cadastrado no sistema");

            RuleFor(p => p.PlanoSaudePaciente.PacienteId)
                .NotEmpty().WithMessage("Paciente obrigatório")
                .MustAsync(async (pacienteId, cancellationToken) =>
                {
                    var pacienteExistente = await _pacienteRepository.GetPacienteById(pacienteId);
                    return pacienteExistente != null;
                })
                .WithMessage("Paciente inválido");

            //RuleFor(p => p.PlanoSaudePaciente.PlanoSaudeId)
            //     .MustAsync(async (planoSaudeId, cancellationToken) =>
            //     {
            //         if (planoSaudeId == null)
            //         {
            //             return planoSaudeId == null;
            //         }
            //         var planoSaudeExiste = await _planoSaudeRepository.GetPlanoSaudeById(planoSaudeId);
            //         return planoSaudeExiste != null;

            //     }).WithMessage("Plano de Saúde inválido");

            //RuleFor(p => p.PlanoSaudePaciente.NumeroCarteirinha)
            //    .NotEmpty().WithMessage("Numero Carteirinha Obrigatório");

            //RuleFor(p => p.PlanoSaudePaciente.DataValidade)
            //    .NotEmpty().WithMessage("Data Validade Obrigatória")
            //    .NotEqual(DateTime.MinValue).WithMessage("Data Validade Inválida")
            //    .Must(d => d > DateTime.Now).WithMessage("Data Validade Inválida");

            RuleFor(p => p.PsicologoId)
                .NotEmpty().WithMessage("Psicólogo responsável deve ser atribuído")
                .MustAsync(async (psicologoId, cancellationToken) =>
                {
                    var result = await _psicologoRepository.GetPsicologoById(psicologoId);
                    return result != null;
                })
                .WithMessage("Psicologo selecionado não está ativo");

        }
    }
}
