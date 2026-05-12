using HealthMindBackend.Application.Authentications.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Authentications.Handlers
{
    public class AuthLoginCommandHandler : IRequestHandler<AuthLoginCommand, Usuario>
    {
        private readonly IAuthRepository _authRepository;

        public AuthLoginCommandHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<Usuario> Handle(AuthLoginCommand request, CancellationToken cancellationToken)
        {
            var usuarioLogado = await _authRepository.Login(request.Email, request.Senha);

            return usuarioLogado ?? throw new KeyNotFoundException("Login inválido");
        }
    }
}
