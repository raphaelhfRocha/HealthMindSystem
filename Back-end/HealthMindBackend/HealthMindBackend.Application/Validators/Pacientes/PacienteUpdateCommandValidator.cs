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

        public PacienteUpdateCommandValidator(IPacienteRepository pacienteRepository, IPsicologoRepository psicologoRepository)
        {
            _pacienteRepository = pacienteRepository;
            _psicologoRepository = psicologoRepository;

            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("Id Paciente obrigatório");

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
