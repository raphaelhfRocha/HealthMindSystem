using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.MetasTerapeuticas.Commands
{
    public abstract class MetaTerapeuticaCommand : IRequest<MetaTerapeutica>
    {
        public String HistoricoMedicoId { get; set; }
        public String Titulo { get; set; }
        public StatusMetaTerapeuticaEnum StatusMetaTerapeutica { get; set; }
        public String? Observacoes { get; set; }
    }
}
