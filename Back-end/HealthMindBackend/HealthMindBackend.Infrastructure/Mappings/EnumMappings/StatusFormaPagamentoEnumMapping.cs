using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusFormaPagamentoEnumMapping
    {
        public static readonly Dictionary<StatusFormaPagamentoEnum, String> Description =
        new()
        {
            { StatusFormaPagamentoEnum.StsDinheiro, "Dinheiro" },
            { StatusFormaPagamentoEnum.StsCartaoDebito, "Cartão de Débito" },
            { StatusFormaPagamentoEnum.StsCartaoCedito, "Cartão de Crédito" },
            { StatusFormaPagamentoEnum.StsPix, "PIX" }
        };

        public static String ToString(StatusFormaPagamentoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Forma Pagamento inválido";
        }

        public static StatusFormaPagamentoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusFormaPagamentoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusFormaPagamentoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Forma Pagamento inválido: {value}");
        }
    }
}


