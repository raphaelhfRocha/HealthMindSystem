using MongoDB.Bson.Serialization.Attributes;

namespace HealthMindBackend.Infrastructure.Persistence.Sequences
{
    public class CounterSequence
    {
        [BsonId]
        public string Id { get; set; } = string.Empty;

        [BsonElement("seq")]
        public long Sequence { get; set; }
    }
}
