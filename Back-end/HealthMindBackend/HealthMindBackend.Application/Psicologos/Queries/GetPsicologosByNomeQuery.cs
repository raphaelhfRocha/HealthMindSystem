using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Queries
{
    public class GetPsicologosByNomeQuery : IRequest<List<Psicologo>>
    {
        public String Nome { get; set; }

        public GetPsicologosByNomeQuery(String nome)
        {
            Nome = nome;
        }
    }
}
