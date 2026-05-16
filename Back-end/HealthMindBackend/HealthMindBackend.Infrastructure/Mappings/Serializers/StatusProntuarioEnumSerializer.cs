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
    public class StatusProntuarioEnumSerializer : SerializerBase<StatusProntuarioEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusProntuarioEnum value)
            => context.Writer.WriteString(StatusProntuarioEnumMapping.ToString(value));

        public override StatusProntuarioEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusProntuarioEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
