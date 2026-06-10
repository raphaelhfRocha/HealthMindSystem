using FluentValidation;
using HealthMindBackend.Application.Psicologos.Commands;
using HealthMindBackend.Application.Validators.Common;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Psicologos
{
    public class PsicologoUpdateCommandValidator : AbstractValidator<PsicologoUpdateCommand>
    {
        private readonly IPsicologoRepository _psicologoRepository;

        public PsicologoUpdateCommandValidator(IPsicologoRepository psicologoRepository)
        {
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
                .MustAsync(async (command, email, cancellationToken) =>
                {
                    var dadoExistente = await _psicologoRepository.GetPsicologoByEmail(command.Email);
                    return dadoExistente == null || dadoExistente.Id == command.Id;
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
                    var dadoExistente = await _psicologoRepository.GetPsicologoByCpfCnpj(command.CpfCnpj);
                    return dadoExistente == null || dadoExistente.Id == command.Id;

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
