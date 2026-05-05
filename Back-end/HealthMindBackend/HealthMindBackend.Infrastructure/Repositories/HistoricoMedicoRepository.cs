using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Persistence;
using MongoDB.Driver;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class HistoricoMedicoRepository : IHistoricoMedicoRepository
    {
        private readonly IMongoCollection<HistoricoMedico> _collection;

        public HistoricoMedicoRepository(MongoDbContext context)
        {
            _collection = context.Database
                .GetCollection<HistoricoMedico>("HISTORICO_MEDICO");
        }

        public async Task<HistoricoMedico> AdicionarHistoricoMedico(HistoricoMedico historico)
        {
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

        public async Task<IEnumerable<HistoricoMedico>> GetHistoricosByProntuarioId(String prontuarioId)
        {
            return await _collection.Find(h => h.Id == prontuarioId).ToListAsync();
        }

        public async Task<HistoricoMedico> GetHistoricoById(String historicoId)
        {
            return await _collection.Find(h => h.Id == historicoId).FirstOrDefaultAsync();
        }
    }
}