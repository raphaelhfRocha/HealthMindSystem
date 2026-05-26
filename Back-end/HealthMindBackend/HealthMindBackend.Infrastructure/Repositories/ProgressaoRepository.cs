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
    public class ProgressaoRepository : IProgressaoRepository
    {
        private const string SequenceName = "PROGRESSAO";
        private readonly IMongoCollection<Progressao> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public ProgressaoRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Progressao>("PROGRESSOES");
            _sequentialIdGenerator = sequentialIdGenerator;
        }
        
        public async Task<IEnumerable<Progressao>> GetAllProgressoes()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Progressao> GetProgressaoById(String progressaoId)
        {
            return await _collection.Find(p => p.Id == progressaoId).FirstOrDefaultAsync();
        }

        public async Task<Progressao> AdicionarProgressao(Progressao progressao)
        {
            progressao.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Progressao));
            await _collection.InsertOneAsync(progressao);
            return progressao;
        }

        public async Task ExcluirProgressao(String progressaoId)
        {
            await _collection.DeleteOneAsync(p => p.Id == progressaoId);
        }

        public async Task<List<Progressao>> GetProgressoesByProntuarioId(String prontuarioId)
        {
            return await _collection.Find(p => p.ProntuarioId == prontuarioId).ToListAsync();
        }
    }
}
