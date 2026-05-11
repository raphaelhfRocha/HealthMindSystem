using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Queries
{
    public class GetPacientesByPsicologoIdQuery : IRequest<List<Paciente>>
    {
        public String? PsicologoId { get; set; }

        public GetPacientesByPsicologoIdQuery(String? psicologoId)
        {
            PsicologoId = psicologoId;
        }
    }
}
