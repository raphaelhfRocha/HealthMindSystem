using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class ProgressaoDTO
    {
        public String? Id { get; set; }
        [Required(ErrorMessage = "Id do paciente obrigatório")]
        public String PacienteId { get; set; }
        [Required(ErrorMessage = "Id do prontuario obrigatório")]
        public String ProntuarioId { get; set; }
        [Required(ErrorMessage = "Descrição progressão obrigatória")]
        public String Descricao { get; set; }
        public DateTime DataRegistro { get; set; }
    }
}
