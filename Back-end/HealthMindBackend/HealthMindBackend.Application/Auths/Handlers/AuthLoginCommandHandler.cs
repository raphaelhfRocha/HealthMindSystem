using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.Authentications.Commands;
using HealthMindBackend.Application.DTOs;
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
    public class AuthLoginCommandHandler : IRequestHandler<AuthLoginCommand, LoginResponseDTO>
    {
        private readonly IAuthRepository _authRepository;

        public AuthLoginCommandHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<LoginResponseDTO> Handle(AuthLoginCommand request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new ArgumentNullException("Não foi possível realizar login");

            var tokenUsuarioAutenticado = await _authRepository.Login(request.Email, request.Senha);

            if (tokenUsuarioAutenticado == null)
                throw new KeyNotFoundException("E-mail ou senha inválidos");

            var loginResponseDto = new LoginResponseDTO
            {
                Email = request.Email,
                Token = tokenUsuarioAutenticado
            };

            return loginResponseDto;
        }
    }
}
