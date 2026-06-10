using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class LoginRequestDTO
    {
        public String Email { get; set; }
        public String Senha { get; set; }
    }
}
