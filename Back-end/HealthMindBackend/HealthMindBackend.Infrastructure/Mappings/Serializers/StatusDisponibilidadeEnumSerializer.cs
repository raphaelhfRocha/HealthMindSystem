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
    public class StatusDisponibilidadeEnumSerializer : SerializerBase<StatusDisponibilidadeEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusDisponibilidadeEnum value)
            => context.Writer.WriteString(StatusDisponibilidadeEnumMapping.ToString(value));

        public override StatusDisponibilidadeEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusDisponibilidadeEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
