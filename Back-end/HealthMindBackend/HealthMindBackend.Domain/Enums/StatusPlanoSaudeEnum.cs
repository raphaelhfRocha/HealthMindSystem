using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusPlanoSaudeEnum
    {
        StsNone,
        [Description("Ativo")]
        StsAtivo,
        [Description("Suspenso")]
        StsSuspenso,
        [Description("Em análise")]
        StsEmAnalise,
        [Description("Descredenciado")]
        StsDescredenciado,
        [Description("Inativo")]
        StsInativo
    }
}
