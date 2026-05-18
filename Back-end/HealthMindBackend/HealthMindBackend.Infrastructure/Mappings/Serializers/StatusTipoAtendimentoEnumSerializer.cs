using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Infrastructure.Mappings.EnumMappings;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.Serializers
{
    public class StatusTipoAtendimentoEnumSerializer : SerializerBase<StatusTipoAtendimentoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusTipoAtendimentoEnum value)
            => context.Writer.WriteString(StatusTipoAtendimentoEnumMapping.ToString(value));

        public override StatusTipoAtendimentoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusTipoAtendimentoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
