using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Progressoes.Commands
{
    public abstract class ProgressaoCommand : IRequest<Progressao>
    {
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        public String Descricao { get; set; }
        public DateTime DataRegistro { get; set; }
    }
}