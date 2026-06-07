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
    public class StatusMetaTerapeuticaEnumSerializer : SerializerBase<StatusMetaTerapeuticaEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusMetaTerapeuticaEnum value)
            => context.Writer.WriteString(StatusMetaTerapeuticaEnumMapping.ToString(value));

        public override StatusMetaTerapeuticaEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusMetaTerapeuticaEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
