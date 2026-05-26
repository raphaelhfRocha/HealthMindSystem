using FluentValidation;
using HealthMindBackend.Application.Recepcionistas.Commands;
using HealthMindBackend.Application.Validators.Common;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Recepcionistas
{
    public class RecepcionistaUpdateCommandValidator : AbstractValidator<RecepcionistaUpdateCommand>
    {
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public RecepcionistaUpdateCommandValidator(IRecepcionistaRepository recepcionistaRepository)
        {
            _recepcionistaRepository = recepcionistaRepository;

            RuleFor(r => r.Id)
                .NotEmpty().WithMessage("Id Recepcionista Obrigatório");

            RuleFor(r => r.Nome)
                .NotEmpty().WithMessage("Nome Recepcionista Obrigatório")
                .MinimumLength(8).WithMessage("Nome Recepcionista deverá ter no mínimo 8 caracteres")
                .MaximumLength(120).WithMessage("Nome Recepcionista deverá ter no máximo 120 caracteres");

            RuleFor(r => r.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Recepcionista Obrigatório")
                .EmailAddress().WithMessage("E-mail inválido")
                .MustAsync(async (email, cancellationToken) =>
                {
                    var emailExistente = await _recepcionistaRepository.GetRecepcionistaByEmail(email);
                    return emailExistente == null;
                })
                .WithMessage("E-mail já cadastrado");

            RuleFor(p => p.CpfCnpj.Numero)
                .NotEmpty().WithMessage("CPF Recepcionista Obrigatório")
                .Must(CpfValidationHelper.IsValid).WithMessage("CPF Inválido")
                .MustAsync(async (cpf, cancellationToken) =>
                {
                    var cpfExistente = await _recepcionistaRepository.GetRecepcionistaByCpf(cpf);
                    return cpfExistente == null;

                }).WithMessage("CPF já cadastrado");

            RuleFor(r => r.StatusCargo)
                .Equal(StatusCargoEnum.StsRecepcionista).WithMessage("Cargo inválido para recepcionista");

            RuleFor(r => r.StatusRole)
                .Equal(StatusRoleEnum.StsColaborador).WithMessage("Role inválida para recepcionista");
        }
    }
}
