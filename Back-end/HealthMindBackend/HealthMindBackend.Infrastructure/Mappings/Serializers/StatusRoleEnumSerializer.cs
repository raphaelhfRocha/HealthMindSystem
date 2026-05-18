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
    public class StatusRoleEnumSerializer : SerializerBase<StatusRoleEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusRoleEnum value)
            => context.Writer.WriteString(StatusRoleEnumMapping.ToString(value));

        public override StatusRoleEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusRoleEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
