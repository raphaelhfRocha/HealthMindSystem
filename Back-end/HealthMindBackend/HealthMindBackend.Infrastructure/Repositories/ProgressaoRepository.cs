using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Persistence;
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
        private readonly IMongoCollection<Progressao> _collection;

        public ProgressaoRepository(MongoDbContext context)
        {
            _collection = context.Database.GetCollection<Progressao>("PROGRESSOES");
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
            await _collection.InsertOneAsync(progressao);
            return progressao;
        }

        public async Task ExcluirProgressao(String progressaoId)
        {
            await _collection.DeleteOneAsync(p => p.Id == progressaoId);
        }
    }
}
