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
    public class AuthRecepcionistaCreateCommandValidator : AbstractValidator<AuthRecepcionistaCreateCommand>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public AuthRecepcionistaCreateCommandValidator(IAuthRepository authRepository, IRecepcionistaRepository recepcionistaRepository)
        {
            _authRepository = authRepository;
            _recepcionistaRepository = recepcionistaRepository;

            RuleFor(r => r.Nome)
                .NotEmpty().WithMessage("Nome Recepcionista Obrigatório")
                .MinimumLength(8).WithMessage("Nome Recepcionista deverá ter no mínimo 8 caracteres")
                .MaximumLength(120).WithMessage("Nome Recepcionista deverá ter no máximo 120 caracteres");

            RuleFor(r => r.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Recepcionista Obrigatório")
                .EmailAddress().WithMessage("E-mail inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var authEmailExistente = await _authRepository.GetUsuarioByEmail(command.Email);
                    var emailExistente = await _recepcionistaRepository.GetRecepcionistaByEmail(command.Email);
                    return authEmailExistente == null || emailExistente == null;
                })
                .WithMessage("E-mail já cadastrado");

            RuleFor(r => r.CpfCnpj.Numero)
                .NotEmpty().WithMessage("CPF Recepcionista Obrigatório")
                .Must(CpfValidationHelper.IsValid).WithMessage("CPF Inválido")
                .MustAsync(async (command, cpf, cancellationToken) =>
                {
                    var authCpfExistente = await _authRepository.GetUsuarioByCpfCnpj(command.CpfCnpj);
                    var cpfExistente = await _recepcionistaRepository.GetRecepcionistaByCpf(command.CpfCnpj);
                    return cpfExistente == null;

                }).WithMessage("CPF já cadastrado");

            RuleFor(r => r.StatusCargo)
                .Equal(StatusCargoEnum.StsRecepcionista).WithMessage("Cargo inválido para recepcionista");

            RuleFor(r => r.StatusRole)
                .Equal(StatusRoleEnum.StsColaborador).WithMessage("Role inválida para recepcionista");
        }
    }
}
