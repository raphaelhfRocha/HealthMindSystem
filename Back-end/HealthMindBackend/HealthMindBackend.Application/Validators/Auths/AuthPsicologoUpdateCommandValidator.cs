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
    public class AuthPsicologoUpdateCommandValidator : AbstractValidator<AuthPsicologoUpdateCommand>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public AuthPsicologoUpdateCommandValidator(IAuthRepository authRepository, IPsicologoRepository psicologoRepository)
        {
            _authRepository = authRepository;
            _psicologoRepository = psicologoRepository;

            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("Id Psicólogo Obrigatório");

            RuleFor(p => p.Nome)
                .NotEmpty().WithMessage("Nome Psicólogo Obrigatório")
                .MinimumLength(8).WithMessage("Nome do psicólogo deve ter no mínimo 8 caracteres.")
                .MaximumLength(120).WithMessage("Nome do psicólogo deve ter no máximo 120 caracteres.");

            RuleFor(p => p.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Psicólogo Obrigatório")
                .EmailAddress().WithMessage("E-mail inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var authDadoExistente = await _authRepository.GetUsuarioByEmail(command.Email);
                    // E-mail livre se ninguém o utiliza.
                    if (authDadoExistente == null)
                        return true;

                    // command.Id pode ser o id do psicólogo ou o do usuário;
                    // resolve o registro sendo editado e permite o e-mail se ele pertencer a esse registro.
                    var psicologoEditado = await _psicologoRepository.GetPsicologoByUsuarioId(command.Id)
                        ?? await _psicologoRepository.GetPsicologoById(command.Id);

                    return authDadoExistente.Id == command.Id ||
                        (psicologoEditado != null && psicologoEditado.UsuarioId == authDadoExistente.Id);
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
                    var authDadoExistente = await _authRepository.GetUsuarioByCpfCnpj(command.CpfCnpj);
                    var dadoExistente = await _psicologoRepository.GetPsicologoByCpfCnpj(command.CpfCnpj);
                    // Permite o CPF/CNPJ do próprio registro, identificado pelo id do psicólogo ou do usuário.
                    return dadoExistente == null ||
                        dadoExistente.Id == command.Id ||
                        dadoExistente.UsuarioId == command.Id ||
                        (authDadoExistente != null && authDadoExistente.Id == command.Id);

                }).WithMessage("CPF/CNPJ já cadastrado");

            RuleFor(p => p.Crp.Numero)
                .NotEmpty().WithMessage("CRP Psicólogo Obrigatório")
                .Must(CrpValidationHelper.IsValid).WithMessage("CRP Inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var dadoExistente = await _psicologoRepository.GetPsicologoByCrp(command.Crp);
                    return dadoExistente == null || dadoExistente.Id == command.Id;
                }).WithMessage("CRP já cadastrado");

            RuleFor(p => p.Especialidade)
                .NotEmpty().WithMessage("Especialidade Psicólogo Obrigatória");
        }
    }
}
