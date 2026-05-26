using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Queries
{
    public class GetPsicologosByEspecialidadeQuery : IRequest<List<Psicologo>>
    {
        public String Especialidade { get; set; }

        public GetPsicologosByEspecialidadeQuery(String especialidade)
        {
            Especialidade = especialidade;
        }
    }
}
