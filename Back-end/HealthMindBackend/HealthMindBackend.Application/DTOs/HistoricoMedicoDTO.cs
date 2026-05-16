using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class HistoricoMedicoDTO
    {
        public String? Id { get; set; }
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        [Required(ErrorMessage = "Descrição Histórico Médico Obrigatória")]
        public String Descricao { get; set; }
        public DateTime DataRegistro { get; set; }
    }
}
