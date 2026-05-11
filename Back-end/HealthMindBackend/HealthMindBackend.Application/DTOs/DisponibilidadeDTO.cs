using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class DisponibilidadeDTO
    {
        public String? Id { get; set; }
        public String PsicologoId { get; set; }
        public DateTime DataDisponibilidade { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public StatusDisponibilidadeEnum StatusDisponibilidade { get; set; }
    }
}
