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
    public class StatusPlanoSaudeEnumSerializer : SerializerBase<StatusPlanoSaudeEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusPlanoSaudeEnum value)
            => context.Writer.WriteString(StatusPlanoSaudeEnumMapping.ToString(value));

        public override StatusPlanoSaudeEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusPlanoSaudeEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
