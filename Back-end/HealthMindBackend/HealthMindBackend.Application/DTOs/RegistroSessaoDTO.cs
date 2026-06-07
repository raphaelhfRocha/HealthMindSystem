using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class RegistroSessaoDTO
    {
        public String? Id { get; set; }
        public String SessaoId { get; set; }
        public String Registro { get; set; }
    }
}
