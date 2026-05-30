using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
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

        public async Task<RegistroSessao> AdicionarRegistroSessao(String sessaoId, RegistroSessao registroSessao)
        {
            registroSessao.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.RegistroSessao));
            registroSessao.SessaoId = sessaoId;

            var adicionar = Builders<Sessao>.Update
                .Push(p => p.RegistrosSessoes, registroSessao);

            await _collection.UpdateOneAsync(p => p.Id == sessaoId, adicionar);
            return registroSessao;
        }

        public async Task<RegistroSessao> AlterarRegistroSessao(String sessaoId, String registroSessaoId, RegistroSessao registroSessao)
        {
            var filter = Builders<Sessao>.Filter.And(
                Builders<Sessao>.Filter.Eq(p => p.Id, sessaoId),
                Builders<Sessao>.Filter.ElemMatch(
                p => p.RegistrosSessoes,
                m => m.Id == registroSessaoId));

            var update = Builders<Sessao>.Update
                .Set("RegistrosSessoes.$.Titulo", registroSessao.Registro);

            var result = await _collection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Registro Sessão não encontrado para atualização");

            return registroSessao;
        }

        public async Task<EscalaSessao> AdicionarEscalaSessao(String sessaoId, EscalaSessao escalaSessao)
        {
            escalaSessao.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.EscalaSessao));
            escalaSessao.SessaoId = sessaoId;

            var adicionar = Builders<Sessao>.Update
                .Push(p => p.EscalasSessoes, escalaSessao);

            await _collection.UpdateOneAsync(p => p.Id == sessaoId, adicionar);
            return escalaSessao;
        }

        public async Task<EscalaSessao> AlterarEscalaSessao(String sessaoId, String escalaSessaoId, EscalaSessao escalaSessao)
        {
            var filter = Builders<Sessao>.Filter.And(
                Builders<Sessao>.Filter.Eq(p => p.Id, sessaoId),
                Builders<Sessao>.Filter.ElemMatch(
                p => p.EscalasSessoes,
                m => m.Id == escalaSessaoId));

            var update = Builders<Sessao>.Update
                .Set("EscalasSessoes.$.Humor", escalaSessao.Humor)
                .Set("EscalasSessoes.$.Ansiedade", escalaSessao.Ansiedade)
                .Set("EscalasSessoes.$.Sono", escalaSessao.Sono)
                .Set("EscalasSessoes.$.FuncSocial", escalaSessao.FuncSocial);

            var result = await _collection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Escala Sessão não encontrada para atualização");

            return escalaSessao;
        }

        public async Task<List<RegistroSessao>> GetRegistrosSessoesBySessaoId(String sessaoId)
        {
            var sessao = await _collection.Find(s => s.Id == sessaoId).FirstOrDefaultAsync();

            if (sessao == null || sessao.RegistrosSessoes == null)
                return null;

            return sessao.RegistrosSessoes.ToList();
        }

        public async Task<List<EscalaSessao>> GetEscalasSessoesBySessaoId(String sessaoId)
        {
            var sessao = await _collection.Find(s => s.Id == sessaoId).FirstOrDefaultAsync();

            if (sessao == null || sessao.EscalasSessoes == null)
                return null;

            return sessao.EscalasSessoes.ToList();
        }

        public async Task<RegistroSessao> GetRegistrosSessoesBySessaoIdAndRegistroSessaoId(String sessaoId, String registroSessaoId)
        {
            var sessao = await _collection.Find(s => s.Id == sessaoId).FirstOrDefaultAsync();

            if (sessao == null || sessao.RegistrosSessoes == null)
                return null;

            return sessao.RegistrosSessoes.FirstOrDefault(r => r.Id == registroSessaoId);
        }

        public async Task<EscalaSessao> GetEscalaSessaoBySessaoIdAndEscalaSessaoId(String sessaoId, String escalaSessaoId)
        {
            var sessao = await _collection.Find(s => s.Id == sessaoId).FirstOrDefaultAsync();

            if (sessao == null || sessao.RegistrosSessoes == null)
                return null;

            return sessao.EscalasSessoes.FirstOrDefault(r => r.Id == escalaSessaoId);
        }
    }
}
