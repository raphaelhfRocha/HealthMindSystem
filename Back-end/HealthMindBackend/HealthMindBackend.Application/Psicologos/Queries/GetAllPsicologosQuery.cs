using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Queries
{
    public class GetAllPsicologosQuery : IRequest<IEnumerable<Psicologo>>
    {
    }
}
