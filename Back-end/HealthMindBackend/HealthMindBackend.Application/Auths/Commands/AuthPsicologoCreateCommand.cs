using HealthMindBackend.Domain.ValueObjects.Documento;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Commands
{
    public class AuthPsicologoCreateCommand : AuthUsuarioCommand
    {
        public Crp Crp { get; set; }
        public String Especialidade { get; set; }
        public Decimal ValorConsulta { get; set; }
    }
}
