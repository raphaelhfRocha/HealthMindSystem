using HealthMindBackend.Domain.Validations;
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
        public String? Id { get; protected set; }

        protected Identity()
        {
        }
        
        public void DefinirId(String id)
        {
            DomainExceptionValidation.Validate(String.IsNullOrWhiteSpace(id), "Id inválido.");

            Id = id;
        }
    }
}
