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
    public class PacienteRepository : IPacienteRepository
    {
        private const string SequenceName = "PACIENTE";
        private readonly IMongoCollection<Paciente> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public PacienteRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Paciente>("PACIENTE");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Paciente> CadastrarPaciente(Paciente paciente)
        {
            paciente.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Paciente));
            await _collection.InsertOneAsync(paciente);
            return paciente;
        }

        public async Task<Paciente> EditarPaciente(String id, Paciente paciente)
        {
            await _collection.ReplaceOneAsync(p => p.Id == id, paciente);
            return paciente;
        }

        public async Task<IEnumerable<Paciente>> GetAllPacientes()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Paciente> GetPacienteById(String pacienteId)
        {
            return await _collection.Find(p => p.Id == pacienteId).FirstOrDefaultAsync();
        }

        public async Task<List<Paciente>> GetPacientesByPsicologoId(String? psicologoId)
        {
            return await _collection.Find(p => p.PsicologoId == psicologoId).ToListAsync();
        }
    }
}
