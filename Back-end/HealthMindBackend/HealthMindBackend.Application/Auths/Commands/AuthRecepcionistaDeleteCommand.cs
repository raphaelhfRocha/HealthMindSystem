using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Commands
{
    public class AuthRecepcionistaDeleteCommand : IRequest<Usuario>
    {
        public String Id { get; set; }

        public AuthRecepcionistaDeleteCommand(String id)
        {
            Id = id;
        }
    }
}
