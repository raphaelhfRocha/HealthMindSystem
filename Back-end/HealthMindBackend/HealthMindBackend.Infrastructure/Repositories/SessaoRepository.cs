using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Infrastructure.Mappings.EnumMappings;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using MongoDB.Driver;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class SessaoRepository : ISessaoRepository
    {
        private const string SequenceName = "SESSAO";
        private readonly IMongoCollection<Sessao> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public SessaoRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Sessao>("SESSAO");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Sessao> AgendarSessao(Sessao sessao)
        {
            sessao.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Sessao));
            //await DefinirPagamento(sessao.Id, sessao.Pagamento);
            await _collection.InsertOneAsync(sessao);
            return sessao;
        }

        public async Task<Sessao> AlterarSessao(String id, Sessao sessao)
        {
            await DefinirPagamento(id, sessao.Pagamento);
            await _collection.ReplaceOneAsync(s => s.Id == id, sessao);
            return sessao;
        }

        public async Task<Pagamento> DefinirPagamento(String sessaoId, Pagamento pagamento)
        {
            var update = Builders<Sessao>.Update
                .Set(s => s.Pagamento, pagamento);

            await _collection.UpdateOneAsync(
                s => s.Id == sessaoId,
                update
            );

            return pagamento;
        }

        public async Task RemoverPagamento(String sessaoId)
        {
            var update = Builders<Sessao>.Update
                .Unset(s => s.Pagamento);

            await _collection.UpdateOneAsync(
                s => s.Id == sessaoId,
                update
            );
        }

        public async Task<Sessao> GetSessaoById(String sessaoId)
        {
            return await _collection
                .Find(s => s.Id == sessaoId)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Sessao>> GetSessoesByPsicologoId(String psicologoId)
        {
            return await _collection
                .Find(s => s.PsicologoId == psicologoId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Sessao>> GetAllSessoes()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Sessao> GetPagamentoBySessaoId(String sessaoId)
        {
            return await _collection.Find(s => s.Pagamento.SessaoId == sessaoId).FirstOrDefaultAsync();
        }
    }
}
