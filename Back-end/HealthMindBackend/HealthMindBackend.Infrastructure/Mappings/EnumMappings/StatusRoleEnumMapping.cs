using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusRoleEnumMapping
    {
        public static readonly Dictionary<StatusRoleEnum, String> Description =
        new()
        {
            { StatusRoleEnum.StsAdmin, "Administrador" },
            { StatusRoleEnum.StsColaborador, "Colaborador" }
        };

        public static String ToString(StatusRoleEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Role inválido";
        }

        public static StatusRoleEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusRoleEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusRoleEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Role inválido: {value}");
        }
    }
}


