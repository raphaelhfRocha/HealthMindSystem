using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Persistence;
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
        private readonly IMongoCollection<Paciente> _collection;

        public PacienteRepository(MongoDbContext context)
        {
            _collection = context.Database.GetCollection<Paciente>("PACIENTE");
        }

        public async Task<Paciente> CadastrarPaciente(Paciente paciente)
        {
            await _collection.InsertOneAsync(paciente);
            return paciente;
        }

        public async Task<Paciente> EditarPaciente(String id, Paciente paciente)
        {
            await _collection.ReplaceOneAsync(p => p.Id == id, paciente);
            return paciente;
        }

        public async Task ExcluirPaciente(String id)
        {
            await _collection.DeleteOneAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Paciente>> GetAllPacientes()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Paciente> GetPacienteById(String pacienteId)
        {
            return await _collection.Find(p => p.Id == pacienteId).FirstOrDefaultAsync();
        }
    }
}
