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
        private readonly IAuthRepository _authRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public AuthPsicologoCreateCommandHandler(IAuthRepository authRepository, IPsicologoRepository psicologoRepository)
        {
            _authRepository = authRepository;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Usuario> Handle(AuthPsicologoCreateCommand request, CancellationToken cancellationToken)
        {
            var usuario = new Psicologo(request.Nome, request.Email, request.Senha,
                request.StatusCargo, request.StatusRole, request.CpfCnpj, request.Crp,
                request.Especialidade);

            usuario = usuario ?? 
                throw new ArgumentNullException(nameof(usuario));

            var usuarioCadastrado = await _authRepository.CadastrarUsuario(usuario);

            var psicologo = new Psicologo(request.Nome, request.Email, request.StatusCargo,
                request.StatusRole, request.CpfCnpj, request.Crp, request.Especialidade);

            await _psicologoRepository.CadastrarPsicologo(psicologo);

            return usuarioCadastrado;
        }
    }
}
