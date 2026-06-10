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
    public class AuthRecepcionistaUpdateCommandHandler : IRequestHandler<AuthRecepcionistaUpdateCommand, Usuario>
    {
        private readonly IValidator<AuthRecepcionistaUpdateCommand> _validatorAuthRecepcionistaUpdateCommand;
        private readonly IAuthRepository _authRepository;
        private readonly IRecepcionistaRepository _recepcionistaRepository;

        public AuthRecepcionistaUpdateCommandHandler(IValidator<AuthRecepcionistaUpdateCommand> validatorAuthRecepcionistaUpdateCommand, IAuthRepository authRepository, IRecepcionistaRepository recepcionistaRepository)
        {
            _validatorAuthRecepcionistaUpdateCommand = validatorAuthRecepcionistaUpdateCommand;
            _authRepository = authRepository;
            _recepcionistaRepository = recepcionistaRepository;
        }

        public async Task<Usuario> Handle(AuthRecepcionistaUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorAuthRecepcionistaUpdateCommand.ValidateAndThrowAsync(request);

            // O id recebido pode ser o do recepcionista (coleção RECEPCIONISTA) ou o do usuário (coleção USUARIO);
            // o registro de login (e-mail/senha) vive na coleção USUARIO, resolvida via UsuarioId.
            var recepcionistaFound = await _recepcionistaRepository.GetRecepcionistaByUsuarioId(request.Id)
                ?? await _recepcionistaRepository.GetRecepcionistaById(request.Id);

            recepcionistaFound = recepcionistaFound ??
                throw new KeyNotFoundException("Recepcionista não encontrado");

            var usuarioFound = await _authRepository.GetUsuarioById(recepcionistaFound.UsuarioId);

            usuarioFound = usuarioFound ??
                throw new KeyNotFoundException("Usuario/Recepcionista não encontrado");

            var usuario = new Recepcionista(
                usuarioFound.Id,
                request.Nome,
                request.Email ?? usuarioFound.Email,
                request.Senha ?? usuarioFound.Senha,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj
            );

            var usuarioAtualizado = await _authRepository.EditarUsuario(usuarioFound.Id, usuario);

            recepcionistaFound.UpdateRecepcionista(
                recepcionistaFound.Id,
                request.Nome,
                request.Email = null,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj,
                recepcionistaFound.UsuarioId
            );

            var psicologoAtualizado = await _recepcionistaRepository.EditarRecepcionista(recepcionistaFound.Id, recepcionistaFound);

            return usuarioAtualizado;
        }
    }
}
