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
    public class ProntuarioRepository : IProntuarioRepository
    {
        private const string SequenceName = "PRONTUARIO";
        private readonly IMongoCollection<Prontuario> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public ProntuarioRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Prontuario>("PRONTUARIO");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Prontuario> AdicionarProntuario(Prontuario prontuario)
        {
            prontuario.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Prontuario));

            if (prontuario.Medicamentos != null)
            {
                foreach (var medicamento in prontuario.Medicamentos)
                {
                    medicamento.DefinirId(await _sequentialIdGenerator
                        .GenerateNextIdAsync(SequenceName, Prefix.Medicamento));
                    medicamento.ProntuarioId = prontuario.Id;

                }
            }

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

            medicamento.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Medicamento));
            medicamento.ProntuarioId = prontuarioId;

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
                .Set("Medicamentos.$.Nome", medicamento.Nome)
                .Set("Medicamentos.$.Dosagem", medicamento.Dosagem)
                .Set("Medicamentos.$.Frequencia", medicamento.Frequencia);

            var result = await _collection.UpdateOneAsync(filter, update);
            if (result.ModifiedCount == 0)
                throw new KeyNotFoundException("Medicamento não encontrado para atualização");

            return medicamento;
        }

        public async Task ExcluirMedicamento(String prontuarioId, String medicamentoId)
        {
            var delete = Builders<Prontuario>.Update.PullFilter(p => p.Medicamentos,
                m => m.Id == medicamentoId);

            await _collection.UpdateOneAsync(p => p.Id == prontuarioId, delete);
        }

        public async Task<Medicamento> GetMedicamentoByProntuarioIdAndMedicamentoId(String prontuarioId, String medicamentoId)
        {
            var prontuario = await _collection.Find(p => p.Id == prontuarioId).FirstOrDefaultAsync();
            if (prontuario == null || prontuario.Medicamentos == null)
                return null;

            return prontuario.Medicamentos.FirstOrDefault(m => m.Id == medicamentoId);
        }

        public async Task<List<Medicamento>> GetMedicamentosByProntuarioId(String prontuarioId)
        {
            var prontuario = await _collection.Find(p => p.Id == prontuarioId).FirstOrDefaultAsync();
            if (prontuario == null || prontuario.Medicamentos == null)
                return null;

            return prontuario.Medicamentos.ToList();
        }
    }
}
