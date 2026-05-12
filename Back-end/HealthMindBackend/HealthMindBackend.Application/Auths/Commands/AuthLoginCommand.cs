using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Authentications.Commands
{
    public class AuthLoginCommand : IRequest<Usuario>
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
