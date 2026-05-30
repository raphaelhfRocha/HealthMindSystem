using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
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

            if (historico.MetasTerapeuticas != null)
            {
                foreach (var registro in historico.MetasTerapeuticas)
                {
                    registro.DefinirId(await _sequentialIdGenerator
                        .GenerateNextIdAsync(SequenceName, Prefix.MetaTerapeutica));
                    registro.HistoricoMedicoId = registro.Id;
                }
            }

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

        public async Task<MetaTerapeutica> AdicionarMetaTerapeutica(String historicoId, MetaTerapeutica metaTerapeutica)
        {
            metaTerapeutica.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.MetaTerapeutica));
            metaTerapeutica.HistoricoMedicoId = historicoId;

            var adicionar = Builders<HistoricoMedico>.Update
                .Push(p => p.MetasTerapeuticas, metaTerapeutica);

            await _collection.UpdateOneAsync(p => p.Id == historicoId, adicionar);
            return metaTerapeutica;
        }

        public async Task<MetaTerapeutica> EditarMetaTerapeutica(String historicoId, String metaTerapeuticaId, MetaTerapeutica metaTerapeutica)
        {
            var filter = Builders<HistoricoMedico>.Filter.And(
                Builders<HistoricoMedico>.Filter.Eq(p => p.Id, historicoId),
                Builders<HistoricoMedico>.Filter.ElemMatch(
                p => p.MetasTerapeuticas,
                m => m.Id == metaTerapeuticaId));

            var update = Builders<HistoricoMedico>.Update
                .Set("MetasTerapeuticas.$.Titulo", metaTerapeutica.Titulo)
                .Set("MetasTerapeuticas.$.Status", metaTerapeutica.StatusMetaTerapeutica)
                .Set("MetasTerapeuticas.$.Observacoes", metaTerapeutica.Observacoes);

            var result = await _collection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Meta Terapeutica não encontrada para atualização");

            return metaTerapeutica;
        }

        public async Task<SaudeMental> DefinirSaudeMental(String historicoId, SaudeMental saudeMental)
        {
            var update = Builders<HistoricoMedico>.Update
                .Set(s => s.SaudeMental, saudeMental);

            await _collection.UpdateOneAsync(
                s => s.Id == historicoId,
                update
            );

            return saudeMental;
        }

        public async Task ExcluirSaudeMental(String historicoId)
        {
            var delete = Builders<HistoricoMedico>.Update
                .Unset(s => s.SaudeMental);

            await _collection.UpdateOneAsync(
                s => s.Id == historicoId,
                delete
            );
        }

        public async Task<MetaTerapeutica> GetMetaTerapeuticaByHistoricoMedicoIdAndMetaTerapeuticaId(String historicoId, String metaTerapeuticaId)
        {
            var historicoMedico = await _collection.Find(m => m.Id == historicoId).FirstOrDefaultAsync();
            if (historicoMedico == null || historicoMedico.MetasTerapeuticas == null)
                return null;

            return historicoMedico.MetasTerapeuticas.FirstOrDefault(m => m.Id == metaTerapeuticaId);
        }

        public async Task<List<MetaTerapeutica>> GetMetaTerapeuticasByHistoricoMedicoId(String historicoId)
        {
            var historicoMedico = await _collection.Find(h => h.Id == historicoId).FirstOrDefaultAsync();
            
            if (historicoMedico == null || historicoMedico.MetasTerapeuticas == null)
                return null;

            return historicoMedico.MetasTerapeuticas.ToList();
        }
    }
}
