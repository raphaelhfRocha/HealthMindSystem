using HealthMindBackend.Application.Auths.Queries;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Contato;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Handlers
{
    public class GetUsuarioByEmailQueryHandler : IRequestHandler<GetUsuarioByEmailQuery, Usuario>
    {
        private readonly IAuthRepository _authRepository;

        public GetUsuarioByEmailQueryHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<Usuario> Handle(GetUsuarioByEmailQuery request, CancellationToken cancellationToken)
        {
            var email = new Email(request.Email);

            return await _authRepository.GetUsuarioByEmail(email);
        }
    }
}
