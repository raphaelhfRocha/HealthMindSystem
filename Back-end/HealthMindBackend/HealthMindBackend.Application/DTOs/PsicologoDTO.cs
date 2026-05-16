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
    public class PsicologoDTO
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
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
        [MinLength(6)]
        [MaxLength(9)]
        [Required(ErrorMessage = "CRP obrigatório")]
        public String Crp { get; set; }
        [Required(ErrorMessage = "Especialidade obrigatória")]
        public String Especialidade { get; set; }
        public List<DisponibilidadeDTO>? DisponibilidadesDTO { get; set; }
    }
}
