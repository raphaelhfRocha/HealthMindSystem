using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusDiagnosticoEnumMapping
    {
        public static readonly Dictionary<StatusDiagnosticoEnum, String> Description =
        new()
        {
            { StatusDiagnosticoEnum.StsSuspeito, "Suspeito" },
            { StatusDiagnosticoEnum.StsAtivo, "Ativo" },
            { StatusDiagnosticoEnum.StsEmAcompanhamento, "Em acompanhamento" },
            { StatusDiagnosticoEnum.StsResolvido, "Resolvido" },
            { StatusDiagnosticoEnum.StsDescartado, "Descartado" },
            { StatusDiagnosticoEnum.StsRecorrente, "Recorrente" },
            { StatusDiagnosticoEnum.StsCronico, "Cronico" },
            { StatusDiagnosticoEnum.StsInativo, "Inativo" },

        };

        public static String ToString(StatusDiagnosticoEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Diagn�stico inv�lido";
        }

        public static StatusDiagnosticoEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusDiagnosticoEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusDiagnosticoEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Diagnóstico inválido: {value}");
        }
    }
}


