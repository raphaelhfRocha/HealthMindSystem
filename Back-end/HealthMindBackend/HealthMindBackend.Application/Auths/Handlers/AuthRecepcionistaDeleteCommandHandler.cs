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
            var recepcionistaFound = await _recepcionistaRepository.GetRecepcionistaById(request.Id);
            
            recepcionistaFound = recepcionistaFound ??
                throw new KeyNotFoundException("Recepcionista não encontrado");

            var usuarioFound = await _authRepository.GetUsuarioById(recepcionistaFound.UsuarioId);

            usuarioFound = usuarioFound ?? 
                throw new KeyNotFoundException("Usuario não encontrado");

            await _recepcionistaRepository.ExcluirRecepcionista(request.Id);

            await _authRepository.ExcluirUsuario(recepcionistaFound.UsuarioId);

            return usuarioFound;
        }
    }
}
