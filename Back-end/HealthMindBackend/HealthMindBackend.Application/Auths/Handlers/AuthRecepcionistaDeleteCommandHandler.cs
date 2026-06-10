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
    public class AuthRecepcionistaDeleteCommandHandler : IRequestHandler<AuthRecepcionistaDeleteCommand, Usuario>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public AuthRecepcionistaDeleteCommandHandler(IAuthRepository authRepository, IRecepcionistaRepository recepcionistaRepository)
        {
            _authRepository = authRepository;
            _recepcionistaRepository = recepcionistaRepository;
        }

        public async Task<Usuario> Handle(AuthRecepcionistaDeleteCommand request, CancellationToken cancellationToken)
        {
            var usuarioFound = await _authRepository.GetUsuarioById(request.Id);

            usuarioFound = usuarioFound ?? 
                throw new KeyNotFoundException("Usuario/Recepcionista não encontrado");

            var recepcionistaFound = await _recepcionistaRepository.GetRecepcionistaByUsuarioId(request.Id);

            recepcionistaFound = recepcionistaFound ??
                throw new KeyNotFoundException("Recepcionista não encontrado");

            await _recepcionistaRepository.ExcluirRecepcionista(recepcionistaFound.Id);
            await _authRepository.ExcluirUsuario(request.Id);

            return usuarioFound;
        }
    }
}
