using HealthMindBackend.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace HealthMindBackend.API.DTOs
{
    public class PsicologoCadastroDTO
    {
        public String? Id { get; set; }
        [MinLength(8)]
        [MaxLength(120)]
        [Required(ErrorMessage = "Nome psicólogo obrigatório")]
        public String Nome { get; set; }
        [Required(ErrorMessage = "E-mail psicólogo obrigatório")]
        public String Email { get; set; }
        [MinLength(11)]
        [MaxLength(14)]
        [Required(ErrorMessage = "CPF/CNPJ obrigatório")]
        public String CpfCnpj { get; set; }
        [Required(ErrorMessage = "Cargo obrigatório")]
        public StatusCargoEnum StatusCargo { get; set; }
        [Required(ErrorMessage = "Role obrigatória")]
        public StatusRoleEnum StatusRole { get; set; }
        [MinLength(6)]
        [MaxLength(9)]
        [Required(ErrorMessage = "CRP obrigatório")]
        public String Crp { get; set; }
        [Required(ErrorMessage = "Especialidade obrigatória")]
        public String Especialidade { get; set; }
    }
}
