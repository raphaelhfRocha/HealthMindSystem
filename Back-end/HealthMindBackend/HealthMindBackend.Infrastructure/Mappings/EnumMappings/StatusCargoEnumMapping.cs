using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusCargoEnumMapping
    {
        public static readonly Dictionary<StatusCargoEnum, String> Description =
        new()
        {
            { StatusCargoEnum.StsPsicologo, "Psicólogo" },
            { StatusCargoEnum.StsRecepcionista, "Recepcionista" }
        };

        public static String ToString(StatusCargoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Cargo inválido";
        }

        public static StatusCargoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusCargoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusCargoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Cargo inválido: {value}");
        }
    }
}


