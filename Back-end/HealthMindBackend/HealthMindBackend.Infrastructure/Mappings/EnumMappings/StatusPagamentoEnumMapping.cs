using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusPagamentoEnumMapping
    {
        public static readonly Dictionary<StatusPagamentoEnum, String> Description =
        new()
        {
            { StatusPagamentoEnum.StsPago, "Pago" },
            { StatusPagamentoEnum.StsPendente, "Pendente" }
        };

        public static String ToString(StatusPagamentoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Pagamento inválido";
        }

        public static StatusPagamentoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusPagamentoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusPagamentoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Pagamento inválido: {value}");
        }
    }
}


