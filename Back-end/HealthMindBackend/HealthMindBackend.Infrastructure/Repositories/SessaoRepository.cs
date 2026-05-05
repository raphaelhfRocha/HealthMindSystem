using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Persistence;
using MongoDB.Driver;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class SessaoRepository : ISessaoRepository
    {
        private readonly IMongoCollection<Sessao> _collection;

        public SessaoRepository(MongoDbContext context)
        {
            _collection = context.Database.GetCollection<Sessao>("SESSAO");
        }

        // ✔️ Criar sessão
        public async Task<Sessao> AgendarSessao(Sessao sessao)
        {
            await _collection.InsertOneAsync(sessao);
            return sessao;
        }

        // ✔️ Atualizar sessão inteira
        public async Task<Sessao> AlterarSessao(String id, Sessao sessao)
        {
            await _collection.ReplaceOneAsync(s => s.Id == id, sessao);
            return sessao;
        }

        // ✔️ Definir ou atualizar pagamento (1:1)
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

        // ✔️ Remover pagamento (opcional)
        public async Task RemoverPagamento(String sessaoId)
        {
            var update = Builders<Sessao>.Update
                .Unset(s => s.Pagamento);

            await _collection.UpdateOneAsync(
                s => s.Id == sessaoId,
                update
            );
        }

        // ✔️ Excluir sessão
        public async Task ExcluirSessao(String id)
        {
            await _collection.DeleteOneAsync(s => s.Id == id);
        }

        // ✔️ Buscar por ID
        public async Task<Sessao> GetSessaoById(String sessaoId)
        {
            return await _collection
                .Find(s => s.Id == sessaoId)
                .FirstOrDefaultAsync();
        }

        // ✔️ Listar por psicólogo
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

        //// ✔️ Listar com paginação (IMPORTANTE)
        //public async Task<List<Sessao>> GetAllSessoes(Int32 page, Int32 pageSize)
        //{
        //    return await _collection
        //        .Find(_ => true)
        //        .Skip((page - 1) * pageSize)
        //        .Limit(pageSize)
        //        .ToListAsync();
        //}
    }
}