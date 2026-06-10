using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Commands
{
    public class AuthRecepcionistaUpdateCommand : AuthUsuarioCommand
    {
        public String Id { get; set; }
        public String UsuarioId { get; set; }
    }
}
