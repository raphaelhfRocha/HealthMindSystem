using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class LoginResponseDTO
    {
        public String Email { get; set; }
        public String Token { get; set; }
    }
}
