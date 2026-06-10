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
    public class AuthPsicologoUpdateCommandHandler : IRequestHandler<AuthPsicologoUpdateCommand, Usuario>
    {
        private readonly IValidator<AuthPsicologoUpdateCommand> _validatorAuthPsicologoUpdateCommand;
        private readonly IAuthRepository _authRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public AuthPsicologoUpdateCommandHandler(IValidator<AuthPsicologoUpdateCommand> validatorAuthPsicologoUpdateCommand, IAuthRepository authRepository, IPsicologoRepository psicologoRepository)
        {
            _validatorAuthPsicologoUpdateCommand = validatorAuthPsicologoUpdateCommand;
            _authRepository = authRepository;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Usuario> Handle(AuthPsicologoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorAuthPsicologoUpdateCommand.ValidateAndThrowAsync(request);

            // O id recebido pode ser o do psicólogo (coleção PSICOLOGO) ou o do usuário (coleção USUARIO);
            // o registro de login (e-mail/senha) vive na coleção USUARIO, resolvida via UsuarioId.
            var psicologoFound = await _psicologoRepository.GetPsicologoByUsuarioId(request.Id)
                ?? await _psicologoRepository.GetPsicologoById(request.Id);

            psicologoFound = psicologoFound ??
                throw new KeyNotFoundException("Psicólogo não encontrado");

            var usuarioFound = await _authRepository.GetUsuarioById(psicologoFound.UsuarioId);

            usuarioFound = usuarioFound ??
                throw new KeyNotFoundException("Usuario/Psicólogo não encontrado");

            var usuario = new Psicologo(
                usuarioFound.Id,
                request.Nome,
                request.Email ?? usuarioFound.Email,
                request.Senha ?? usuarioFound.Senha,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj
            );

            var usuarioAtualizado = await _authRepository.EditarUsuario(usuarioFound.Id, usuario);

            psicologoFound.UpdatePsicologo(
                psicologoFound.Id,
                request.Nome,
                request.Email = null,
                request.StatusCargo,
                request.StatusRole,
                request.CpfCnpj,
                psicologoFound.UsuarioId,
                request.Crp,
                request.Especialidade,
                request.ValorConsulta
            );

            var psicologoAtualizado = await _psicologoRepository.EditarPsicologo(psicologoFound.Id, psicologoFound);

            return usuarioAtualizado;
        }
    }
}
