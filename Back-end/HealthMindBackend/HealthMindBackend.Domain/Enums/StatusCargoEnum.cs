using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusCargoEnum
    {
        StsNone,
        [Description("Psicologo")]
        StsPsicologo,
        [Description("Recepcionista")]
        StsRecepcionista
    }
}
