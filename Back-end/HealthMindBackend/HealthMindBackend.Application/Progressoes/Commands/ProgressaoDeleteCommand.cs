using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Progressoes.Commands
{
    public class ProgressaoDeleteCommand : IRequest<Progressao>
    {
        public String Id { get; set; }
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }

        public ProgressaoDeleteCommand(String id, String pacienteId, String prontuarioId)
        {
            Id = id;
            PacienteId = pacienteId;
            ProntuarioId = prontuarioId;
        }
    }
}
