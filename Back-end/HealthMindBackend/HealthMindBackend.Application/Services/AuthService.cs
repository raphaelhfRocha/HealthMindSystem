using AutoMapper;
using HealthMindBackend.Application.Authentications.Commands;
using HealthMindBackend.Application.Auths.Commands;
using HealthMindBackend.Application.Auths.Queries;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Contato;
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
        private readonly IGeradorCredenciaisService _geradorCredenciais;

        public AuthService(IMapper mapper, IMediator mediator, IGeradorCredenciaisService geradorCredenciais)
        {
            _mapper = mapper;
            _mediator = mediator;
            _geradorCredenciais = geradorCredenciais;
        }

        public async Task CadastrarPsicologo(PsicologoDTO psicologoDto)
        {
            psicologoDto.Email = await GerarEmailUnico(psicologoDto.Nome, StatusCargoEnum.StsPsicologo);
            psicologoDto.Senha = _geradorCredenciais.GerarSenha(psicologoDto.Nome);

            var authPsicologoCreateCommand = _mapper.Map<AuthPsicologoCreateCommand>(psicologoDto);
            await _mediator.Send(authPsicologoCreateCommand);
        }

        public async Task CadastrarRecepcionista(RecepcionistaDTO recepcionistaDto)
        {
            recepcionistaDto.Email = await GerarEmailUnico(recepcionistaDto.Nome, StatusCargoEnum.StsRecepcionista);
            recepcionistaDto.Senha = _geradorCredenciais.GerarSenha(recepcionistaDto.Nome);

            var authRecepcionistaCreateCommand = _mapper.Map<AuthRecepcionistaCreateCommand>(recepcionistaDto);
            await _mediator.Send(authRecepcionistaCreateCommand);
        }

        public async Task EditarPsicologo(PsicologoDTO psicologoDto)
        {
            if (psicologoDto.RegenerarCredenciais)
            {
                psicologoDto.Email = await GerarEmailUnico(psicologoDto.Nome, StatusCargoEnum.StsPsicologo);
                psicologoDto.Senha = _geradorCredenciais.GerarSenha(psicologoDto.Nome);
            }

            var authPsicologoUpdateCommand = _mapper.Map<AuthPsicologoUpdateCommand>(psicologoDto);
            await _mediator.Send(authPsicologoUpdateCommand);
        }

        public async Task EditarRecepcionista(RecepcionistaDTO recepcionistaoDto)
        {
            if (recepcionistaoDto.RegenerarCredenciais)
            {
                recepcionistaoDto.Email = await GerarEmailUnico(recepcionistaoDto.Nome, StatusCargoEnum.StsRecepcionista);
                recepcionistaoDto.Senha = _geradorCredenciais.GerarSenha(recepcionistaoDto.Nome);
            }

            var authRecepcionistaUpdateCommand = _mapper.Map<AuthRecepcionistaUpdateCommand>(recepcionistaoDto);
            await _mediator.Send(authRecepcionistaUpdateCommand);
        }

        public async Task ExcluirRecepcionista(String recepcionistaId)
        {
            var authRecepcionistaDeleteCommand = new AuthRecepcionistaDeleteCommand(recepcionistaId);
            await _mediator.Send(authRecepcionistaDeleteCommand);
        }

        public async Task<UsuarioDTO> GetUsuarioById(String id)
        {
            var getUsuarioByIdQuery = new GetUsuarioByIdQuery(id);
            var result = await _mediator.Send(getUsuarioByIdQuery);
            return _mapper.Map<UsuarioDTO>(result);
        }

        public async Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDto)
        {
            var authLoginCommand = _mapper.Map<AuthLoginCommand>(loginRequestDto);
            var result = await _mediator.Send(authLoginCommand);
            return result;
        }

        private async Task<String> GerarEmailUnico(String nome, StatusCargoEnum cargo)
        {
            String email;

            do
            {
                email = _geradorCredenciais.GerarEmail(nome, cargo);
            }
            while (await _mediator.Send(new GetUsuarioByEmailQuery(email)) != null);

            return email;
        }
    }
}
