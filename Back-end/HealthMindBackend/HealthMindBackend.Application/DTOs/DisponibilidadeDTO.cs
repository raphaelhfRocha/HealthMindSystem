using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class DisponibilidadeDTO
    {
        public String? Id { get; set; }
        public String? PsicologoId { get; set; }
        [Required(ErrorMessage = "Data disponibilidade obrigatória")]
        public DateTime DataDisponibilidade { get; set; }
        [Required(ErrorMessage = "Hora inicial obrigatória")]
        public TimeSpan HoraInicio { get; set; }
        public StatusDisponibilidadeEnum StatusDisponibilidade { get; set; }
    }
}
