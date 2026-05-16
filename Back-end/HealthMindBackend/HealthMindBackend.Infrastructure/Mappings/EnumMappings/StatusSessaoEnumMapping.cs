using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusSessaoEnumMapping
    {
        public static readonly Dictionary<StatusSessaoEnum, String> Description =
        new()
        {
            { StatusSessaoEnum.StsRealizada, "Realizada" },
            { StatusSessaoEnum.StsPendente, "Pendente" },
            { StatusSessaoEnum.StsCancelada, "Cancelada" }
        };

        public static String ToString(StatusSessaoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Sessão inválido";
        }

        public static StatusSessaoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusSessaoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusSessaoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Sessão inválido: {value}");
        }
    }
}


