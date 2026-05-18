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
    public class StatusFormaPagamentoEnumSerializer : SerializerBase<StatusFormaPagamentoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusFormaPagamentoEnum value)
            => context.Writer.WriteString(StatusFormaPagamentoEnumMapping.ToString(value));

        public override StatusFormaPagamentoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusFormaPagamentoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
