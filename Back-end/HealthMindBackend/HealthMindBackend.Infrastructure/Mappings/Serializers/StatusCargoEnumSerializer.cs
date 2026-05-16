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
    public class StatusCargoEnumSerializer : SerializerBase<StatusCargoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusCargoEnum value)
            => context.Writer.WriteString(StatusCargoEnumMapping.ToString(value));

        public override StatusCargoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusCargoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
