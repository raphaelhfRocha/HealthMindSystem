using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class PlanoSaudeRepository : IPlanoSaudeRepository
    {
        private const String SequenceName = "PLANO_SAUDE";
        private readonly IMongoCollection<PlanoSaude> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public PlanoSaudeRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<PlanoSaude>("PLANO_SAUDE");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<CoberturaPlano> AtualizarCoberturaPlano(String planoSaudeId, String especialidade, CoberturaPlano coberturaPlano)
        {
            var filter = Builders<PlanoSaude>.Filter.And(
                Builders<PlanoSaude>.Filter.Eq(p => p.Id, planoSaudeId),
                Builders<PlanoSaude>.Filter.ElemMatch(p => p.CoberturasPlano,
                c => c.Especialidade == especialidade)
            );

            var update = Builders<PlanoSaude>.Update
                .Set("CoberturasPlano.$.Especialidade", coberturaPlano.Especialidade)
                .Set("CoberturasPlano.$.PercentualCobertura", coberturaPlano.PercentualCobertura)
                .Set("CoberturasPlano.$.ValorMaximoCobertura", coberturaPlano.ValorMaximoCobertura);

            await _collection.UpdateOneAsync(filter, update);
            return coberturaPlano;
        }

        public async Task<PlanoSaude> AtualizarPlanoSaude(String planoSaudeId, PlanoSaude planoSaude)
        {
            await _collection.ReplaceOneAsync(p => p.Id == planoSaudeId, planoSaude);
            return planoSaude;
        }

        public async Task<IEnumerable<PlanoSaude>> GetAllPlanosSaude()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<CoberturaPlano> GetCoberturaPlanoByPlanoSaudeIdAndEspecialidade(String planoSaudeId, String especialidade)
        {
            var planoSaude = await _collection.Find(p => p.Id == planoSaudeId).FirstOrDefaultAsync();

            if (planoSaude == null || planoSaude.CoberturasPlano == null)
                return null;

            return planoSaude.CoberturasPlano.Where(c => c.Especialidade == especialidade).FirstOrDefault();
        }

        public async Task<PlanoSaude> GetPlanoSaudeById(String planoSaudeId)
        {
            return await _collection.Find(p => p.Id == planoSaudeId).FirstOrDefaultAsync();
        }

        public async Task<CoberturaPlano> RegistrarCoberturaPlano(String planoSaudeId, CoberturaPlano coberturaPlano)
        {
            var adicionar = Builders<PlanoSaude>.Update
                .Push(p => p.CoberturasPlano, coberturaPlano);

            await _collection.UpdateOneAsync(p => p.Id == planoSaudeId, adicionar);
            return coberturaPlano;
        }

        public async Task<PlanoSaude> RegistrarPlanoSaude(PlanoSaude planoSaude)
        {
            planoSaude.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.PlanoSaude));
            await _collection.InsertOneAsync(planoSaude);
            return planoSaude;
        }

        public async Task RemoverCoberturaPlano(String planoSaudeId, String especialidade)
        {
            var filter = Builders<PlanoSaude>.Filter.Eq(p => p.Id, planoSaudeId);

            var update = Builders<PlanoSaude>.Update.PullFilter(
                p => p.CoberturasPlano,
                c => c.Especialidade == especialidade);

            await _collection.UpdateOneAsync(filter, update);
        }
    }
}
