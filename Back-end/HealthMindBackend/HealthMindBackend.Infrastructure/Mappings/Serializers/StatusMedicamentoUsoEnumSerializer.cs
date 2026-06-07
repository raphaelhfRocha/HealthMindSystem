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
    public class StatusMedicamentoUsoEnumSerializer : SerializerBase<StatusMedicamentoUsoEnum>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, StatusMedicamentoUsoEnum value)
            => context.Writer.WriteString(StatusMedicamentoUsoEnumMapping.ToString(value));

        public override StatusMedicamentoUsoEnum Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
            => StatusMedicamentoUsoEnumMapping.ToEnum(context.Reader.ReadString());
    }
}
