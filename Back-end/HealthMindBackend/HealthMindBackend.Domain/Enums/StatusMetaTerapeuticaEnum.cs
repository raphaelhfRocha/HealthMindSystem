using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusMetaTerapeuticaEnum
    {
        StsNone,
        [Description("Não iniciada")]
        StsNaoIniciada,
        [Description("Em andamento")]
        StsEmAndamento,
        [Description("Alcançada")]
        StsAlcancada
    }
}
