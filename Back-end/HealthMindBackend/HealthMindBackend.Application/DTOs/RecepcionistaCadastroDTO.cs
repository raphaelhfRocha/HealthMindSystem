using HealthMindBackend.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace HealthMindBackend.API.DTOs
{
    public class RecepcionistaCadastroDTO
    {
        public String? Id { get; set; }
        [MinLength(8)]
        [MaxLength(120)]
        [Required(ErrorMessage = "Nome usuário obrigatório")]
        public String Nome { get; set; }
        [Required(ErrorMessage = "E-mail usuário obrigatório")]
        public String Email { get; set; }
        //[MinLength(11)]
        //[MaxLength(14)]
        [Required(ErrorMessage = "CPF/CNPJ obrigatório")]
        public String CpfCnpj { get; set; }
        [Required(ErrorMessage = "Cargo obrigatório")]
        public StatusCargoEnum StatusCargo { get; set; }
        [Required(ErrorMessage = "Role obrigatória")]
        public StatusRoleEnum StatusRole { get; set; }
    }
}
