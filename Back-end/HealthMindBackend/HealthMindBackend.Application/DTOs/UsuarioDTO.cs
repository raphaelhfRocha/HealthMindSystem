using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class UsuarioDTO
    {
        public String Id { get; set; }
        [MinLength(8)]
        [MaxLength(120)]
        [Required(ErrorMessage = "Nome usuário obrigatório")]
        public String Nome { get; set; }
        [Required(ErrorMessage = "E-mail usuário obrigatório")]
        public String Email { get; set; }
        //[MinLength(11)]
        //[MaxLength(14)]
        [Required(ErrorMessage = "CPF/CNPJ obrigatório")]
        public CpfCnpj CpfCnpj { get; set; }
        [Required(ErrorMessage = "Cargo obrigatório")]
        public StatusCargoEnum StatusCargo { get; set; }
        [Required(ErrorMessage = "Role obrigatória")]
        public StatusRoleEnum StatusRole { get; set; }
    }
}
