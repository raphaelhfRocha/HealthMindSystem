using System.ComponentModel.DataAnnotations;

namespace HealthMindBackend.API.DTOs
{
    public class LoginDTO
    {
        public String Email { get; set; }
        public String Senha { get; set; }
    }
}
