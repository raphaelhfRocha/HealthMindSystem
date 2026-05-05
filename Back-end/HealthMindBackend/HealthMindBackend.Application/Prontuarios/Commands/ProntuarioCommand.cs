using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Prontuarios.Commands
{
    public class ProntuarioCommand : IRequest<Prontuario>
    {
        public String PacienteId { get; set; }
        public String Descricao { get; set; }
        public DateTime DataAbertura { get; set; }
        public StatusProntuarioEnum StatusProntuario { get; set; }
    }
}