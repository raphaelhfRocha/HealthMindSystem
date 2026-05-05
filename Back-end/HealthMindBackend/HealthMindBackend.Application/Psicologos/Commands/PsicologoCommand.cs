using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Commands
{
    public class PsicologoCommand : IRequest<Psicologo>
    {
        public String Nome { get; set; }
        public String Email { get; set; }
        public String Senha { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
        public CpfCnpj CpfCnpj { get; set; }
        public String Crp { get; set; }
        public String Especialidade { get; set; }
    }
}
