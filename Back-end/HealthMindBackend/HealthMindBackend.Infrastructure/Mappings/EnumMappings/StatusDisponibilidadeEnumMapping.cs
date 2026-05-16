using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusDisponibilidadeEnumMapping
    {
        public static readonly Dictionary<StatusDisponibilidadeEnum, String> Description =
        new()
        {
            { StatusDisponibilidadeEnum.StsDisponivel, "Disponível" },
            { StatusDisponibilidadeEnum.StsReservada, "Reservada" },
        };

        public static String ToString(StatusDisponibilidadeEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Disponibilidade inválido";
        }

        public static StatusDisponibilidadeEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusDisponibilidadeEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusDisponibilidadeEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Disponibilidade inválido: {value}");
        }
    }
}


