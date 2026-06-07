using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusMedicamentoUsoEnumMapping
    {
        public static readonly Dictionary<StatusMedicamentoUsoEnum, String> Description =
        new()
        {
            { StatusMedicamentoUsoEnum.StsEmUso , "Em uso" },
            { StatusMedicamentoUsoEnum.StsUsado , "Usado" }
        };

        public static String ToString(StatusMedicamentoUsoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Medicamento Uso inválido";
        }

        public static StatusMedicamentoUsoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusMedicamentoUsoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusMedicamentoUsoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Medicamento Uso inválido: {value}");
        }
    }
}
