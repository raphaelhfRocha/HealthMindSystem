using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Commands
{
    public abstract class HistoricoMedicoCommand : IRequest<HistoricoMedico>
    {
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        public String Descricao { get; set; }
        public DateTime DataRegistro { get; set; }
    }
}
