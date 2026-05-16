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
    public class StatusPagamentoEnumSerializer : SerializerBase<StatusPagamentoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusPagamentoEnum value)
            => context.Writer.WriteString(StatusPagamentoEnumMapping.ToString(value));

        public override StatusPagamentoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusPagamentoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
