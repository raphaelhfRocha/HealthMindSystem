using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Medicamentos.Commands
{
    public class MedicamentoCommand : IRequest<Medicamento>
    {
        public String ProntuarioId { get; set; }
        public String Nome { get; set; }
        public String Dosagem { get; set; }
        public String Frequencia { get; set; }
    }
}
