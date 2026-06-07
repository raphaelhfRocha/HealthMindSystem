using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusParceladoEnumMapping
    {
        public static readonly Dictionary<StatusParceladoEnum, String> Description =
        new()
        {
            { StatusParceladoEnum.StsNone, "Nenhum" },
            { StatusParceladoEnum.StsSim, "Sim" },
            { StatusParceladoEnum.StsNao, "Não" }
        };

        public static String ToString(StatusParceladoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Parcelado inválido";
        }

        public static StatusParceladoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusParceladoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusParceladoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Parcelado inválido: {value}");
        }
    }
}


