using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.EnumMappings
{
    public static class StatusProntuarioEnumMapping
    {
        public static readonly Dictionary<StatusProntuarioEnum, String> Description =
        new()
        {
            { StatusProntuarioEnum.StsAguardandoInicio, "Aguardando inicio" },
            { StatusProntuarioEnum.StsAtivo, "Ativo" },
            { StatusProntuarioEnum.StsEmAcompanhamento, "Em acompanhamento" },
            { StatusProntuarioEnum.StsEncerrado, "Encerrado" },
            { StatusProntuarioEnum.StsCancelado, "Cancelado" },
            { StatusProntuarioEnum.StsReaberto, "Reaberto" },
            { StatusProntuarioEnum.StsInativo, "Inativo" },
        };

        public static String ToString(StatusProntuarioEnum status)
        {
            return Description.TryGetValue(status, out var value)
                ? value : "Status Prontu�rio inv�lido";
        }

        public static StatusProntuarioEnum ToEnum(String value)
        {
            var item = Description.FirstOrDefault(x => x.Value.Equals(value,
                StringComparison.OrdinalIgnoreCase));

            if (!item.Equals(default(KeyValuePair<StatusProntuarioEnum, String>)))
                return item.Key;

            if (Enum.TryParse<StatusProntuarioEnum>(value, true, out var enumValue) &&
                Enum.IsDefined(enumValue))
                return enumValue;

            throw new ArgumentException($"Status Prontuário inválido: {value}");
        }
    }
}


