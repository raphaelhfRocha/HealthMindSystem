using FluentValidation;
using HealthMindBackend.Application.Auths.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Handlers
{
    public class AuthPsicologoCreateCommandHandler : IRequestHandler<AuthPsicologoCreateCommand, Usuario>
    {
        private readonly IValidator<AuthPsicologoCreateCommand> _validatorAuthPsicologoCreateCommand;
        private readonly IAuthRepository _authRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public AuthPsicologoCreateCommandHandler(IValidator<AuthPsicologoCreateCommand> validatorAuthPsicologoCreateCommand, IAuthRepository authRepository, IPsicologoRepository psicologoRepository)
        {
            _validatorAuthPsicologoCreateCommand = validatorAuthPsicologoCreateCommand;
            _authRepository = authRepository;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Usuario> Handle(AuthPsicologoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorAuthPsicologoCreateCommand.ValidateAndThrowAsync(request);

            var nome = $"Dr(a). {request.Nome}";

            var usuario = new Psicologo(
                nome,
                request.Email,
                request.Senha,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj
            );

            var usuarioCadastrado = await _authRepository.CadastrarUsuario(usuario);

            var psicologo = new Psicologo(
                nome,
                request.Email = null,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj,
                usuarioCadastrado.Id,
                request.Crp,
                request.Especialidade,
                request.ValorConsulta
            );

            await _psicologoRepository.CadastrarPsicologo(psicologo);

            return usuarioCadastrado;
        }
    }
}
