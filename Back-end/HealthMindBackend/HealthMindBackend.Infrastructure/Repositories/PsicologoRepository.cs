using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
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
        private const string SequenceName = "PSICOLOGO";
        private readonly IMongoCollection<Psicologo> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public PsicologoRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Psicologo>("PSICOLOGO");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Psicologo> CadastrarPsicologo(Psicologo psicologo)
        {
            psicologo.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Psicologo));
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
