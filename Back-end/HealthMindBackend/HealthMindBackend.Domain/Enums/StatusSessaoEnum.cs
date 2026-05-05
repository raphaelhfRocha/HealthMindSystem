using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusSessaoEnum
    {
        StsNone,
        [Description("Realizada")]
        StsRealizada,
        [Description("Pendente")]
        StsPendente,
        [Description("Cancelada")]
        StsCancelada
    }
}
