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
    public class DiagnosticoRepository : IDiagnosticoRepository
    {
        private const string SequenceName = "DIAGNOSTICO";
        private readonly IMongoCollection<Diagnostico> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public DiagnosticoRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Diagnostico>("DIAGNOSTICOS");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Diagnostico> AdicionarDiagnostico(Diagnostico diagnostico)
        {
            diagnostico.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Diagnostico));
            await _collection.InsertOneAsync(diagnostico);
            return diagnostico;
        }

        public async Task<Diagnostico> EditarDiagnostico(String diagnosticoId, Diagnostico diagnostico)
        {
            await _collection.ReplaceOneAsync(d => d.Id == diagnosticoId, diagnostico);
            return diagnostico;
        }

        public async Task<IEnumerable<Diagnostico>> GetAllDiagnosticos()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Diagnostico> GetDiagnosticoById(String diagnosticoId)
        {
            return await _collection.Find(d => d.Id == diagnosticoId).FirstOrDefaultAsync();
        }

        public async Task<List<Diagnostico>> GetDiagnosticosByProntuarioId(String prontuarioId)
        {
            return await _collection.Find(d => d.ProntuarioId == prontuarioId).ToListAsync();
        }
    }
}
