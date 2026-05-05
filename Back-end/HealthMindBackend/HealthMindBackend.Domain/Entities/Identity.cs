using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public abstract class Identity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; protected set; }

        public Identity()
        {
        }
        public Identity(String prefix)
        {
            Id = $"{prefix}-000{Guid.NewGuid().ToString("N")}";
        }
    }
}
