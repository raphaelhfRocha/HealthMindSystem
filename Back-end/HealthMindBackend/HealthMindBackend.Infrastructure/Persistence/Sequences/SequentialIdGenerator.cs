using HealthMindBackend.Domain.Interfaces;
using MongoDB.Driver;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Persistence.Sequences
{
    public class SequentialIdGenerator : ISequentialIdGenerator
    {
        private const string CounterCollection = "COUNTERS";
        private readonly IMongoCollection<CounterSequence> _counterCollection;

        public SequentialIdGenerator(IMongoDbContext context)
        {
            _counterCollection = context.Database.GetCollection<CounterSequence>(CounterCollection);
        }

        public async Task<string> GenerateNextIdAsync(
            string sequenceName,
            string prefix,
            CancellationToken cancellationToken = default
        )
        {
            if (string.IsNullOrWhiteSpace(sequenceName))
                throw new ArgumentException("Nome da sequência inválido.", nameof(sequenceName));

            if (string.IsNullOrWhiteSpace(prefix))
                throw new ArgumentException("Prefixo inválido.", nameof(prefix));

            var normalizedSequence = sequenceName.Trim().ToUpperInvariant();
            var normalizedPrefix = prefix.Trim().ToUpperInvariant();

            var filter = Builders<CounterSequence>.Filter.Eq(c => c.Id, normalizedSequence);
            var update = Builders<CounterSequence>.Update.Inc(c => c.Sequence, 1);

            var options = new FindOneAndUpdateOptions<CounterSequence>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var counter = await _counterCollection.FindOneAndUpdateAsync(
                filter,
                update,
                options,
                cancellationToken
            );

            return $"{normalizedPrefix}-{counter.Sequence:D3}";
        }
    }
}
