using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusRoleEnum
    {
        StsNone,
        [Description("Administrador")]
        StsAdmin,
        [Description("Colaborador")]
        StsColaborador
    }
}
