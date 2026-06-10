using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Recepcionistas.Queries
{
    public class GetRecepcionistaByIdQuery : IRequest<Recepcionista>
    {
        public String Id { get; set; }

        public GetRecepcionistaByIdQuery(String id)
        {
            Id = id;
        }
    }
}
