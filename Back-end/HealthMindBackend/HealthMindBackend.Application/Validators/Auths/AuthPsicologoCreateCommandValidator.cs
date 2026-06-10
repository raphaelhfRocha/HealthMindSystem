using FluentValidation;
using HealthMindBackend.Application.Auths.Commands;
using HealthMindBackend.Application.Validators.Common;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Auths
{
    public class AuthPsicologoCreateCommandValidator : AbstractValidator<AuthPsicologoCreateCommand>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public AuthPsicologoCreateCommandValidator(IAuthRepository authRepository, IPsicologoRepository psicologoRepository)
        {
            _authRepository = authRepository;
            _psicologoRepository = psicologoRepository;

            RuleFor(p => p.Nome)
                .NotEmpty().WithMessage("Nome Psicólogo Obrigatório")
                .MinimumLength(8).WithMessage("Nome do psicólogo deve ter no mínimo 8 caracteres.")
                .MaximumLength(120).WithMessage("Nome do psicólogo deve ter no máximo 120 caracteres.");

            RuleFor(p => p.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Psicólogo Obrigatório")
                .EmailAddress().WithMessage("E-mail inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var authEmailExistente = await _authRepository.GetUsuarioByEmail(command.Email);
                    var emailExistente = await _psicologoRepository.GetPsicologoByEmail(command.Email);
                    return authEmailExistente == null && emailExistente == null;
                })
                .WithMessage("E-mail já cadastrado");

            RuleFor(p => p.StatusCargo)
                .Equal(StatusCargoEnum.StsPsicologo).WithMessage("Cargo inválido para psicólogo");

            RuleFor(p => p.StatusRole)
                .NotEqual(StatusRoleEnum.StsNone).WithMessage("Role inválida");

            RuleFor(p => p.CpfCnpj.Numero)
                .NotEmpty().WithMessage("CPF/CNPJ Psicólogo Obrigatório")
                .Must(CpfCnpjValidationHelper.IsValid).WithMessage("CPF/CNPJ Inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var authCpfCnpjExistente = await _authRepository.GetUsuarioByCpfCnpj(command.CpfCnpj);
                    var cpfCnpjExistente = await _psicologoRepository.GetPsicologoByCpfCnpj(command.CpfCnpj);
                    return authCpfCnpjExistente == null && cpfCnpjExistente == null;

                }).WithMessage("CPF/CNPJ já cadastrado");

            RuleFor(p => p.Crp.Numero)
                .NotEmpty().WithMessage("CRP Psicólogo Obrigatório")
                .Must(CrpValidationHelper.IsValid).WithMessage("CRP Inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var crpExistente = await _psicologoRepository.GetPsicologoByCrp(command.Crp);
                    return crpExistente == null;

                }).WithMessage("CRP já cadastrado");

            RuleFor(p => p.Especialidade)
                .NotEmpty().WithMessage("Especialidade Psicólogo Obrigatória");
        }
    }
}
