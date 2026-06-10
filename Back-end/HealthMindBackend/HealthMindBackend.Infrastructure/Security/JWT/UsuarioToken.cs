using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class UsuarioToken
    {
        public String Token { get; set; }
        public DateTime? DataExpiration { get; set; }
    }
}
