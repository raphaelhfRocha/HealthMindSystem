using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class MedicamentoDTO
    {
        public String? Id { get; set; }
        public String? ProntuarioId { get; set; }
        public String Nome { get; set; }
        public String Dosagem { get; set; }
        public String Frequencia { get; set; }
        public StatusMedicamentoUsoEnum StatusMedicamentoUso { get; set; }
    }
}
