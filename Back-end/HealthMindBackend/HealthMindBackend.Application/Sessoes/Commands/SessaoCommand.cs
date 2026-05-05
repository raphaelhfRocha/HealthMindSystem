using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Commands
{
    public class SessaoCommand : IRequest<Sessao>
    {
        public String PacienteId { get; set; }
        public String PsicologoId { get; set; }
        public DateTime DataSessao { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public String Observacoes { get; set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; set; }
        public StatusSessaoEnum StatusSessao { get; set; }

    }
}
