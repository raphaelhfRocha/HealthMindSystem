using HealthMindBackend.Domain.ValueObjects.Documento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Commands
{
    public class AuthPsicologoUpdateCommand : AuthUsuarioCommand
    {
        public String Id { get; set; }
        public String UsuarioId { get; set; }
        public Crp Crp { get; set; }
        public String Especialidade { get; set; }
        public Decimal ValorConsulta { get; set; }
    }
}
