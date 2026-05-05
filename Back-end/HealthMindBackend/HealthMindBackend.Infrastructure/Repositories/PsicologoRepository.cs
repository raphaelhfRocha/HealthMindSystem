using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
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
    public class PsicologoRepository : IPsicologoRepository
    {
        private readonly IMongoCollection<Psicologo> _collection;

        public PsicologoRepository(MongoDbContext context)
        {
            _collection = context.Database.GetCollection<Psicologo>("PSICOLOGO");
        }

        public async Task<Psicologo> CadastrarPsicologo(Psicologo psicologo)
        {
            await _collection.InsertOneAsync(psicologo);
            return psicologo;
        }

        public async Task<Psicologo> EditarPsicologo(String psicologoId, Psicologo psicologo)
        {
            await _collection.ReplaceOneAsync(p => p.Id == psicologoId, psicologo);
            return psicologo;
        }

        public async Task ExcluirPsicologo(String id)
        {
            await _collection.DeleteOneAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Psicologo>> GetAllPsicologos()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Psicologo> GetPsicologoById(String psicologoId)
        {
            return await _collection.Find(p => p.Id == psicologoId).FirstOrDefaultAsync();
        }
    }
}
