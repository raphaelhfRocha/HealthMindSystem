using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusMedicamentoUsoEnum
    {
        StsNone,
        [Description("Em uso")]
        StsEmUso,
        [Description("Usado")]
        StsUsado
    }
}
