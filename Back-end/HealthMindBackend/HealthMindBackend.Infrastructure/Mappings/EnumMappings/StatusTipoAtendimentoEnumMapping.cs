using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusTipoAtendimentoEnumMapping
    {
        public static readonly Dictionary<StatusTipoAtendimentoEnum, String> Description =
        new()
        {
            { StatusTipoAtendimentoEnum.StsPresencial, "Presencial" },
            { StatusTipoAtendimentoEnum.StsOnline, "Online" }
        };

        public static String ToString(StatusTipoAtendimentoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Tipo Atendimento inválido";
        }

        public static StatusTipoAtendimentoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusTipoAtendimentoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusTipoAtendimentoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Tipo Atendimento inválido: {value}");
        }
    }
}


