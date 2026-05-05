using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Recepcionistas
{
    public class RecepcionistaCommand : IRequest<Recepcionista>
    {
        public String Nome { get; set; }
        public String Email { get; set; }
        public String Senha { get; set; }
        public CpfCnpj CpfCnpj { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
    }
}
