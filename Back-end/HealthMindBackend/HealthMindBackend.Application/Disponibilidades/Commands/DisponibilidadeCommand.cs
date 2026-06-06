using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Commands
{
    public class DisponibilidadeCommand : IRequest<Disponibilidade>
    {
        public String PsicologoId { get; set; }
        public DateTime DataDisponibilidade { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; set; }
        public StatusDisponibilidadeEnum StatusDisponibilidade { get; set; }
    }
}
