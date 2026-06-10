using HealthMindBackend.Application.Auths.Queries;
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
    public class GetUsuarioByIdQueryHandler : IRequestHandler<GetUsuarioByIdQuery, Usuario>
    {
        private readonly IAuthRepository _authRepository;

        public GetUsuarioByIdQueryHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<Usuario> Handle(GetUsuarioByIdQuery request, CancellationToken cancellationToken)
        {
            return await _authRepository.GetUsuarioById(request.Id);
        }
    }
}
