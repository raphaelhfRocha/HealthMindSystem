using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
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
    public class RecepcionistaRepository : IRecepcionistaRepository
    {
        private const string SequenceName = "RECEPCIONISTA";
        private readonly IMongoCollection<Recepcionista> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public RecepcionistaRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Recepcionista>("RECEPCIONISTA");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Recepcionista> CadastrarRecepcionista(Recepcionista recepcionista)
        {
            recepcionista.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Recepcionista));
            await _collection.InsertOneAsync(recepcionista);
            return recepcionista;
        }

        public async Task<Recepcionista> EditarRecepcionista(String id, Recepcionista usuario)
        {
            await _collection.ReplaceOneAsync(r => r.Id == id, usuario);
            return usuario;
        }

        public async Task ExcluirRecepcionista(String id)
        {
            await _collection.DeleteOneAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Recepcionista>> GetAllRecepcionistas()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Recepcionista> GetRecepcionistaByCpf(String cpf)
        {
            return await _collection.Find(r => r.CpfCnpj.Numero == cpf).FirstOrDefaultAsync();
        }

        public async Task<Recepcionista> GetRecepcionistaByEmail(String email)
        {
            return await _collection.Find(r => r.Email.Endereco == email).FirstOrDefaultAsync();
        }

        public async Task<Recepcionista> GetRecepcionistaById(String id)
        {
            return await _collection.Find(r => r.Id == id).FirstOrDefaultAsync();
        }
    }
}
