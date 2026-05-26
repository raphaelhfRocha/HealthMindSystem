using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class PlanoSaudeRepository : IPlanoSaudeRepository
    {
        private const String SequenceName = "PLANO_SAUDE";
        private readonly IMongoCollection<PlanoSaude> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public PlanoSaudeRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<PlanoSaude>("PLANO_SAUDE");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<PlanoSaude> AtualizarPlanoSaude(String planoSaudeId, PlanoSaude planoSaude)
        {
            await _collection.ReplaceOneAsync(p => p.Id == planoSaudeId, planoSaude);
            return planoSaude;
        }

        public async Task<IEnumerable<PlanoSaude>> GetAllPlanosSaude()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<PlanoSaude> GetPlanoSaudeById(String planoSaudeId)
        {
            return await _collection.Find(p => p.Id == planoSaudeId).FirstOrDefaultAsync();
        }

        public async Task<PlanoSaude> RegistrarPlanoSaude(PlanoSaude planoSaude)
        {
            planoSaude.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.PlanoSaude));
            await _collection.InsertOneAsync(planoSaude);
            return planoSaude;
        }
    }
}
