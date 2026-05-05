using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Medicamentos.Commands
{
    public class MedicamentoDeleteCommand : IRequest<Medicamento>
    {
        public String Id { get; set; }
        public String ProntuarioId { get; set; }
    }
}
