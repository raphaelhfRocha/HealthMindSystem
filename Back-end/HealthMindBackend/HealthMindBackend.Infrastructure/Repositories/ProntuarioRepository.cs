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
    public class ProntuarioRepository : IProntuarioRepository
    {
        private readonly IMongoCollection<Prontuario> _collection;

        public ProntuarioRepository(MongoDbContext context)
        {
            _collection = context.Database.GetCollection<Prontuario>("PRONTUARIO");
        }

        public async Task<Prontuario> AdicionarProntuario(Prontuario prontuario)
        {
            await _collection.InsertOneAsync(prontuario);
            return prontuario;
        }

        public async Task<IEnumerable<Prontuario>> GetAllProntuarios()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Prontuario> GetProntuarioById(String prontuarioId)
        {
            return await _collection.Find(p => p.Id == prontuarioId).FirstOrDefaultAsync();
        }

        public async Task<Prontuario> EditarProntuario(Prontuario prontuario)
        {
            await _collection.ReplaceOneAsync(p => p.Id == prontuario.Id, prontuario);
            return prontuario;
        }

        public async Task<Medicamento> AdicionarMedicamento(String prontuarioId, Medicamento medicamento)
        {
            var adicionar = Builders<Prontuario>.Update
                .Push(p => p.Medicamentos, medicamento);

            await _collection.UpdateOneAsync(p => p.Id == prontuarioId, adicionar);
            return medicamento;
        }

        public async Task<Medicamento> EditarMedicamento(String prontuarioId, String medicamentoId, Medicamento medicamento)
        {
            var filter = Builders<Prontuario>.Filter.And(
                Builders<Prontuario>.Filter.Eq(p => p.Id, prontuarioId),
                Builders<Prontuario>.Filter.ElemMatch(
                p => p.Medicamentos,
                m => m.Id == medicamentoId));

            var update = Builders<Prontuario>.Update
                .Set("medicamentos.$.nome", medicamento.Nome)
                .Set("medicamentos.$.dosagem", medicamento.Dosagem)
                .Set("medicamentos.$.frequencia", medicamento.Frequencia);

            await _collection.UpdateOneAsync(filter, update);
            return medicamento;
        }

        public async Task ExcluirMedicamento(String prontuarioId, String medicamentoId)
        {
            var delete = Builders<Prontuario>.Update.PullFilter(p => p.Medicamentos,
                m => m.Id == medicamentoId);

            await _collection.UpdateOneAsync(p => p.Id == prontuarioId, delete);
        }

        public async Task<Medicamento> GetMedicamentoById(String prontuarioId, String medicamentoId)
        {
            var projection = Builders<Prontuario>.Projection
                .ElemMatch(p => p.Medicamentos, m => m.Id == medicamentoId);

            var result = await _collection.Find(p => p.Id == prontuarioId).Project<Medicamento>(projection).FirstOrDefaultAsync();

            return result;
        }
    }
}
