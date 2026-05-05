using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Usuarios.Commands
{
    public class RecepcionistaDeleteCommand : IRequest<Recepcionista>
    {
        public String Id { get; set; }

        public RecepcionistaDeleteCommand(String id)
        {
            Id = id;
        }
    }
}
