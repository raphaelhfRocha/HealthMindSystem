using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusPlanoSaudeEnumMapping
    {
        public static readonly Dictionary<StatusPlanoSaudeEnum, String> Description =
        new()
        {
            { StatusPlanoSaudeEnum.StsAtivo, "Ativo" },
            { StatusPlanoSaudeEnum.StsInativo, "Inativo" }
        };

        public static String ToString(StatusPlanoSaudeEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Cargo inválido";
        }

        public static StatusPlanoSaudeEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusPlanoSaudeEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusPlanoSaudeEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Plano Saúde inválido: {value}");
        }
    }
}
