using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusDiagnosticoEnum
    {
        StsNone,
        [Description("Suspeito")]
        StsSuspeito,
        [Description("Ativo")]
        StsAtivo,
        [Description("Em acompanhamento")]
        StsEmAcompanhamento,
        [Description("Resolvido")]
        StsResolvido,
        [Description("Descartado")]
        StsDescartado,
        [Description("Recorrente")]
        StsRecorrente,
        [Description("Cronico")]
        StsCronico,
        [Description("Inativo")]
        StsInativo
    }
}
