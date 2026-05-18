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
    public class StatusSessaoEnumSerializer : SerializerBase<StatusSessaoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusSessaoEnum value)
            => context.Writer.WriteString(StatusSessaoEnumMapping.ToString(value));

        public override StatusSessaoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusSessaoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
