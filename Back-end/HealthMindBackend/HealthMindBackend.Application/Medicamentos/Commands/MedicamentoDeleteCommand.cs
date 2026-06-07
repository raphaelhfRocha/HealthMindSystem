using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
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

        public MedicamentoDeleteCommand(String id, String prontuarioId)
        {
            Id = id;
            ProntuarioId = prontuarioId;
        }
    }
}
