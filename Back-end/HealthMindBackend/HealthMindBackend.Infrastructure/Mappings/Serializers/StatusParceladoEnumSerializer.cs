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
    public class StatusParceladoEnumSerializer : SerializerBase<StatusParceladoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusParceladoEnum value)
            => context.Writer.WriteString(StatusParceladoEnumMapping.ToString(value));

        public override StatusParceladoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusParceladoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
