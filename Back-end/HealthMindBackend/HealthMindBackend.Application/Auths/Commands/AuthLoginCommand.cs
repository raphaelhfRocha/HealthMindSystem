using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Domain.Entities;
using MediatR;
using System;

namespace HealthMindBackend.Application.Authentications.Commands
{
    public class AuthLoginCommand : IRequest<LoginResponseDTO>
    {
        public String Email { get; set; }
        public String Senha { get; set; }

        public AuthLoginCommand(String email, String senha)
        {
            Email = email;
            Senha = senha;
        }
    }
}