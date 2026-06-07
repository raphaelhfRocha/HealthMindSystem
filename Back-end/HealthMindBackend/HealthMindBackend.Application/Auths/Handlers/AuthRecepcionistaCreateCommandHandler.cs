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
    public class AuthRecepcionistaCreateCommandHandler : IRequestHandler<AuthRecepcionistaCreateCommand, Usuario>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public AuthRecepcionistaCreateCommandHandler(IAuthRepository authRepository, IRecepcionistaRepository recepcionistaRepository)
        {
            _authRepository = authRepository;
            _recepcionistaRepository = recepcionistaRepository;
        }

        public async Task<Usuario> Handle(AuthRecepcionistaCreateCommand request, CancellationToken cancellationToken)
        {
            var usuario = new Recepcionista(
                request.Nome,
                request.Email,
                request.Senha,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj
            );

            usuario = usuario ?? throw new ArgumentNullException(nameof(usuario));

            var usuarioCadastrado = await _authRepository.CadastrarUsuario(usuario);

            var recepcionista = new Recepcionista(
                request.Nome,
                request.Email,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj
            );

            await _recepcionistaRepository.CadastrarRecepcionista(recepcionista);

            return usuarioCadastrado;
        }
    }
}
