using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusTipoAtendimentoEnum
    {
        StsNone,
        [Description("Presencial")]
        StsPresencial,
        [Description("Online")]
        StsOnline
    }
}
