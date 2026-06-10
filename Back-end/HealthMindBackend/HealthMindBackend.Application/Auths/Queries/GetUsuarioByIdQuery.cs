using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Auths.Queries
{
    public class GetUsuarioByIdQuery : IRequest<Usuario>
    {
        public String? Id { get; set; }

        public GetUsuarioByIdQuery(String? id)
        {
            Id = id;            
        }
    }
}
