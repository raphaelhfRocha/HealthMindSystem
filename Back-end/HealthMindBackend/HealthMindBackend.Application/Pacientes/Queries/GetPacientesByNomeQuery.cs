using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Queries
{
    public class GetPacientesByNomeQuery : IRequest<List<Paciente>>
    {
        public String Nome { get; set; }

        public GetPacientesByNomeQuery(String nome)
        {
            Nome = nome;
        }
    }
}
