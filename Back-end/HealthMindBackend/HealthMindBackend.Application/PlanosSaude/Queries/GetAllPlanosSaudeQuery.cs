using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.PlanosSaude.Queries
{
    public class GetAllPlanosSaudeQuery : IRequest<IEnumerable<PlanoSaude>>
    {
    }
}
