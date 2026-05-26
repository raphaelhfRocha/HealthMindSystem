using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Queries
{
    public class GetPacienteByIdQuery : IRequest<Paciente>
    {
        public String Id { get; set; }

        public GetPacienteByIdQuery(String id)
        {
            Id = id;
        }
    }
}
