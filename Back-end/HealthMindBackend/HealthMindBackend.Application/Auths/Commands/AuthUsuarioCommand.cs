using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Commands
{
    public abstract class AuthUsuarioCommand : IRequest<Usuario>
    {
        public String Nome { get; set; }
        public String Email { get; set; }
        public String Senha { get; set; }
        public String CpfCnpj { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
    }
}
