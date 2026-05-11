using HealthMindBackend.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Medicamentos.Queries
{
    public class GetMedicamentosByProntuarioIdQuery : IRequest<List<Medicamento>>
    {
        public String ProntuarioId { get; set; }

        public GetMedicamentosByProntuarioIdQuery(String prontuarioId)
        {
            ProntuarioId = prontuarioId;
        }
    }
}
