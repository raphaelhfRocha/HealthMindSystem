using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public class StatusMetaTerapeuticaEnumMapping
    {
        public static readonly Dictionary<StatusMetaTerapeuticaEnum, String> Description =
       new()
       {
            { StatusMetaTerapeuticaEnum.StsNaoIniciada, "Não iniciada" },
            { StatusMetaTerapeuticaEnum.StsEmAndamento, "Em andamento" },
            { StatusMetaTerapeuticaEnum.StsAlcancada, "Alcançada" }
       };

        public static String ToString(StatusMetaTerapeuticaEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Meta Terapêutica inválido";
        }

        public static StatusMetaTerapeuticaEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusMetaTerapeuticaEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusMetaTerapeuticaEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Meta Terapêutica inválido: {value}");
        }
    }
}
