using FluentValidation;
using HealthMindBackend.Application.Pacientes.Commands;
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
                .NotEmpty().WithMessage("Nome paciente obrigatório")
                .MinimumLength(8).WithMessage("Nome paciente deve ter no mínimo 8 caracteres")
                .MaximumLength(120).WithMessage("Nome paciente deve ter no máximo 120 caracteres");

            RuleFor(p => p.Email)
                .NotEmpty().WithMessage("E-mail paciente obrigatório")
                .EmailAddress().WithMessage("E-mail inválido")
                .MustAsync(async (email, cancellationToken) =>
                {
                    var emailExistente = await _pacienteRepository.GetPacienteByEmail(email);
                    return emailExistente == null;
                })
                .WithMessage("E-mail já cadastrado");

            RuleFor(p => p.DataNascimento)
                .NotEmpty().WithMessage("Data Nascimento obrigatória");

            RuleFor(p => p.CpfCnpj)
                .NotEmpty().WithMessage("CPF/CNPJ paciente obrigatório")
                .MinimumLength(11).WithMessage("CPF/CNPJ deve ter no mínimo 11 caracteres")
                .MaximumLength(14).WithMessage("CPF/CNPJ deve ter no máximo 14 caracteres")
                .MustAsync(async (cpfCnpj, cancellationToken) =>
                {
                    var pacienteExistente = await _pacienteRepository.GetPacienteByCpfCnpj(cpfCnpj);
                    return pacienteExistente == null;
                })
                .WithMessage("CPF/CNPJ já cadastrado no sistema");

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
