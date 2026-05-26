using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using MongoDB.Driver;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class HistoricoMedicoRepository : IHistoricoMedicoRepository
    {
        private const string SequenceName = "HISTORICO_MEDICO";
        private readonly IMongoCollection<HistoricoMedico> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public HistoricoMedicoRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database
                .GetCollection<HistoricoMedico>("HISTORICO_MEDICO");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<HistoricoMedico> AdicionarHistoricoMedico(HistoricoMedico historico)
        {
            historico.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.HistoricoMedico));
            await _collection.InsertOneAsync(historico);
            return historico;
        }

        public async Task<HistoricoMedico> EditarHistoricoMedico(String historicoId, HistoricoMedico historico)
        {
            await _collection.ReplaceOneAsync(
                h => h.Id == historicoId,
                historico
            );
            return historico;
        }

        public async Task ExcluirHistoricoMedico(String historicoId)
        {
            await _collection.DeleteOneAsync(h => h.Id == historicoId);
        }

        public async Task<IEnumerable<HistoricoMedico>> GetAllHistoricos()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<List<HistoricoMedico>> GetHistoricosByProntuarioId(String prontuarioId)
        {
            return await _collection.Find(h => h.ProntuarioId == prontuarioId).ToListAsync();
        }

        public async Task<HistoricoMedico> GetHistoricoById(String historicoId)
        {
            return await _collection.Find(h => h.Id == historicoId).FirstOrDefaultAsync();
        }
    }
}
