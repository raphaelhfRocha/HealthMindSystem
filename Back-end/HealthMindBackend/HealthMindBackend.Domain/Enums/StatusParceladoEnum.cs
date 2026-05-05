using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusParceladoEnum
    {
        StsNone,
        [Description("Sim")]
        StsSim,
        [Description("Não")]
        StsNao
    }
}
