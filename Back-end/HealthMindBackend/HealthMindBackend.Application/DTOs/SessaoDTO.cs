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
    public class SessaoDTO
    {
        public String? Id { get; set; }
        [Required(ErrorMessage = "Id do paciente obrigatório")]
        public String PacienteId { get; set; }
        [Required(ErrorMessage = "Id do paciente obrigatório")]
        public String PsicologoId { get; set; }
        [Required(ErrorMessage = "Data sessão obrigatória")]
        public DateTime DataSessao { get; set; }
        [Required(ErrorMessage = "Hora sessão obrigatória")]
        public TimeSpan HoraInicio { get; set; }
        public String Observacoes { get; set; }
        [Required(ErrorMessage = "Tipo atendimento obrigatório")]
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; set; }
        public PagamentoDTO? PagamentoDTO { get; set; }
        public StatusSessaoEnum StatusSessao { get; set; }
    }
}
