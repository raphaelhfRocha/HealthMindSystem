using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.MetasTerapeuticas.Queries
{
    public class GetMetasTerapeuticasByHistoricoMedicoIdQuery : IRequest<List<MetaTerapeutica>>
    {
        public String HistoricoMedicoId { get; set; }

        public GetMetasTerapeuticasByHistoricoMedicoIdQuery(String historicoMedicoId)
        {
            HistoricoMedicoId = historicoMedicoId;            
        }
    }
}
