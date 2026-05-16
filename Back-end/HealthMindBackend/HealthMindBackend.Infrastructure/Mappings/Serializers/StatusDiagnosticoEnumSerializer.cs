using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Infrastructure.Mappings.EnumMappings;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Mappings.Serializers
{
    public class StatusDiagnosticoEnumSerializer : SerializerBase<StatusDiagnosticoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusDiagnosticoEnum value)
            => context.Writer.WriteString(StatusDiagnosticoEnumMapping.ToString(value));

        public override StatusDiagnosticoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusDiagnosticoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
