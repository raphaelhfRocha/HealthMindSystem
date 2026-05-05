using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Diagnosticos.Commands
{
    public class DiagnosticoUpdateCommand : DiagnosticoCommand
    {
        public String Id { get; set; }
    }
}
