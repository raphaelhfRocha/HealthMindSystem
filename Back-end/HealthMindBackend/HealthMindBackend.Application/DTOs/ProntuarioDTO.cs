using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class ProntuarioDTO
    {
        public String? Id { get; set; }
        [Required(ErrorMessage = "Id do paciente obrigatório")]
        public String PacienteId { get; set; }
        [Required(ErrorMessage = "Descrição prontuário obrigatório")]
        public String? Anotacoes { get; set; }
        public DateTime? DataAbertura { get; set; }
        public StatusProntuarioEnum StatusProntuario { get; set; }
        public ContatoEmergenciaDTO? ContatoEmergenciaDTO { get; set; }
        public List<MedicamentoDTO>? MedicamentosDTO { get; set; }
    }
}
