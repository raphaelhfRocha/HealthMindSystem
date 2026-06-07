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
    public class PacienteCreateCommandValidator : AbstractValidator<PacienteCreateCommand>
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IPsicologoRepository _psicologoRepository;
        private readonly IPlanoSaudeRepository _planoSaudeRepository;
        public PacienteCreateCommandValidator(IPacienteRepository pacienteRepository, IPsicologoRepository psicologoRepository, IPlanoSaudeRepository planoSaudeRepository)
        {
            _pacienteRepository = pacienteRepository;
            _psicologoRepository = psicologoRepository;
            _planoSaudeRepository = planoSaudeRepository;

            RuleFor(p => p.Nome)
                .NotEmpty().WithMessage("Nome Paciente Obrigatório")
                .MinimumLength(8).WithMessage("Nome Paciente deve ter no mínimo 8 caracteres")
                .MaximumLength(120).WithMessage("Nome Paciente deve ter no máximo 120 caracteres");

            RuleFor(p => p.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Paciente Obrigatório")
                .EmailAddress().WithMessage("E-mail Inválido")
                .MustAsync(async (email, cancellationToken) =>
                {
                    var emailExistente = await _pacienteRepository.GetPacienteByEmail(email);
                    return emailExistente == null;
                })
                .WithMessage("E-mail Já Cadastrado");

            RuleFor(p => p.DataNascimento)
                .NotEmpty().WithMessage("Data Nascimento Obrigatória");

            RuleFor(p => p.CpfCnpj.Numero)
                .NotEmpty().WithMessage("CPF/CNPJ Paciente Obrigatório")
                .Must(CpfCnpjValidationHelper.IsValid).WithMessage("CPF/CNPJ Inválido")
                .MustAsync(async (cpfCnpj, cancellationToken) =>
                {
                    var pacienteExistente = await _pacienteRepository.GetPacienteByCpfCnpj(cpfCnpj);
                    return pacienteExistente == null;
                })
                .WithMessage("CPF/CNPJ já cadastrado no sistema");

            RuleFor(p => p.Telefone.Numero)
                .NotEmpty().WithMessage("Telefone Paciente Obrigatório")
                .Must(TelefoneValidationHelper.IsValid).WithMessage("Telefone Inválido")
                .MustAsync(async (telefone, cancellationToken) =>
                {
                    var pacienteExistente = await _pacienteRepository.GetPacienteByTelefone(telefone);
                    return pacienteExistente == null;
                })
                .WithMessage("Telefone já cadastrado no sistema");

            //RuleFor(p => p.PlanoSaudePaciente.PlanoSaudeId)
            //    .MustAsync(async (planoSaudeId, cancellationToken) =>
            //    {
            //        if (planoSaudeId == null)
            //        {
            //            return planoSaudeId == null;
            //        }
            //        var planoSaudeExiste = await _planoSaudeRepository.GetPlanoSaudeById(planoSaudeId);
            //        return planoSaudeExiste != null;

            //    }).WithMessage("Plano de Saúde inválido");

            //RuleFor(p => p.PlanoSaudePaciente.NumeroCarteirinha)
            //    .NotEmpty().WithMessage("Numero Carteirinha Obrigatório");

            //RuleFor(p => p.PlanoSaudePaciente.DataValidade)
            //    .NotEmpty().WithMessage("Data Validade Obrigatória")
            //    .NotEqual(DateTime.MinValue)
            //    .Must(d => d > DateTime.Now);

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
