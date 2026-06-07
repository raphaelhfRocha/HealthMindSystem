using System.ComponentModel.DataAnnotations;

namespace HealthMindBackend.API.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "E-mail obrigatório")]
        public String Email { get; set; }
        [Required(ErrorMessage = "Senha obrigatória")]
        public String Senha { get; set; }
    }
}
