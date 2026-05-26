using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Saude;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Diagnosticos.Commands
{
    public abstract class DiagnosticoCommand : IRequest<Diagnostico>
    {
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        public String Descricao { get; set; }
        public Cid Cid { get; set; }
        public DateTime DataDiagnostico { get; set; }
        public StatusDiagnosticoEnum StatusDiagnostico { get; set; }
        public String Observacoes { get; set; }
    }
}
