using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Contato;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Queries
{
    public class GetUsuarioByEmailQuery : IRequest<Usuario>
    {
        public String Email { get; set; }

        public GetUsuarioByEmailQuery(String email)
        {
            Email = email;
        }
    }
}
