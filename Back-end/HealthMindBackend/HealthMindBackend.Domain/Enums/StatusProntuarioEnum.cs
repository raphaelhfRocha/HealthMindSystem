using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusProntuarioEnum
    {
        StsNone,
        [Description("Aguardando inicio")]
        StsAguardandoInicio,
        [Description("Ativo")]
        StsAtivo,
        [Description("Em acompanhamento")]
        StsEmAcompanhamento,
        [Description("Encerrado")]
        StsEncerrado,
        [Description("Cancelado")]
        StsCancelado,
        [Description("Reaberto")]
        StsReaberto,
        [Description("Inativo")]
        StsInativo
    }
}
