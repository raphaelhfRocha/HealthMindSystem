using FluentValidation;
using HealthMindBackend.Application.Authentications.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Auths
{
    public class AuthLoginCommandValidator : AbstractValidator<AuthLoginCommand>
    {
        private readonly IAuthRepository _authRepository;

        public AuthLoginCommandValidator(IAuthRepository authRepository)
        {
            _authRepository = authRepository;

            RuleFor(l => l.Email.Endereco)
                .NotEmpty().WithMessage("E-mail Obrigatório")
                .EmailAddress().WithMessage("E-mail/Senha inválido")
                .MustAsync(async (command, none, cancellationToken) =>
                {
                    var emailExistente = await _authRepository.GetUsuarioByEmail(command.Email);
                    return emailExistente != null;
                })
                .WithMessage("E-mail/Senha inválido");

            RuleFor(l => l.Senha)
                .NotEmpty().WithMessage("Senha Obrigatória");
        }
    }
}
