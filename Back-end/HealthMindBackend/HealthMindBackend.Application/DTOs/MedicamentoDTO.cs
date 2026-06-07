using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class MedicamentoDTO
    {
        public String? Id { get; set; }
        public String? ProntuarioId { get; set; }

        [Required(ErrorMessage = "Nome do medicamento é obrigatório")]
        public String Nome { get; set; }

        [Required(ErrorMessage = "Dosagem do medicamento é obrigatória")]
        public String Dosagem { get; set; }

        [Required(ErrorMessage = "Frequência do medicamento é obrigatória")]
        public String Frequencia { get; set; }
        public StatusMedicamentoUsoEnum StatusMedicamentoUso { get; set; }
    }
}
