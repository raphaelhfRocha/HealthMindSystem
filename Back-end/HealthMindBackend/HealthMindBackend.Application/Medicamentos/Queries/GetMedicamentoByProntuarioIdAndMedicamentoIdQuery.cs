using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Medicamentos.Queries
{
    public class GetMedicamentoByProntuarioIdAndMedicamentoIdQuery : IRequest<Medicamento>
    {
        public String ProntuarioId { get; set; }
        public String Id { get; set; }

        public GetMedicamentoByProntuarioIdAndMedicamentoIdQuery(String prontuarioId, String id)
        {
            ProntuarioId = prontuarioId;
            Id = id;
        }
    }
}
