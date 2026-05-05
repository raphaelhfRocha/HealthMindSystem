using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Enums
{
    public enum StatusFormaPagamentoEnum
    {
        StsNone,
        [Description("Dinheiro")]
        StsDinheiro,
        [Description("Cartao Débito")]
        StsCartaoDebito,
        [Description("Cartão Crédito")]
        StsCartaoCedito,
        [Description("PIX")]
        StsPix
    }
}
