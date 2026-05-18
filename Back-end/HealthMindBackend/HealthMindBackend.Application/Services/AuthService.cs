using AutoMapper;
using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.Authentications.Commands;
using HealthMindBackend.Application.Auths.Commands;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public AuthService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task CadastrarPsicologo(PsicologoCadastroDTO psicologoCadastroDto)
        {
            var authPsicologoCreateCommand = _mapper.Map<AuthPsicologoCreateCommand>(psicologoCadastroDto);
            await _mediator.Send(authPsicologoCreateCommand);
        }

        public async Task CadastrarRecepcionista(RecepcionistaCadastroDTO recepcionistaCadastroDto)
        {
            var authRecepcionistaCreateCommand = _mapper.Map<AuthRecepcionistaCreateCommand>(recepcionistaCadastroDto);
            await _mediator.Send(authRecepcionistaCreateCommand);
        }

        public async Task<LoginResponseDTO> Login(String email, String senha)
        {
            var authLoginCommand = new AuthLoginCommand(email, senha);
            var result = await _mediator.Send(authLoginCommand);
            return result;
        }
    }
}
