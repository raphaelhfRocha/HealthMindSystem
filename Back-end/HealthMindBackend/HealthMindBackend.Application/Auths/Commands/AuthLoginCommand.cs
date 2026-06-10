using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Domain.ValueObjects.Contato;
using MediatR;
using System;

namespace HealthMindBackend.Application.Authentications.Commands
{
    public class AuthLoginCommand : IRequest<LoginResponseDTO>
    {
        public Email Email { get; set; }
        public String Senha { get; set; }

        public AuthLoginCommand(Email email, String senha)
        {
            Email = email;
            Senha = senha;
        }
    }
}