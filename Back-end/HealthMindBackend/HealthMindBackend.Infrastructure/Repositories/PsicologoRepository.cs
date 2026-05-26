using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class PsicologoRepository : IPsicologoRepository
    {
        private const string SequenceName = "PSICOLOGO";
        private readonly IMongoCollection<Psicologo> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;

        public PsicologoRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator)
        {
            _collection = context.Database.GetCollection<Psicologo>("PSICOLOGO");
            _sequentialIdGenerator = sequentialIdGenerator;
        }

        public async Task<Disponibilidade> AdicionarDisponibilidade(String psicologoId, Disponibilidade disponibilidade)
        {
            disponibilidade.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Disponibilidade));
            disponibilidade.PsicologoId = psicologoId;

            var psicologo = await _collection.Find(p => p.Id == psicologoId).FirstOrDefaultAsync();
            if (psicologo == null)
                throw new KeyNotFoundException("Psicólogo não encontrado");

            if (psicologo.Disponibilidades == null)
            {
                var inicializarDisponibilidades = Builders<Psicologo>.Update
                    .Set(p => p.Disponibilidades, new List<Disponibilidade>());

                await _collection.UpdateOneAsync(p => p.Id == psicologoId, inicializarDisponibilidades);
            }

            var adicionarDisponibilidade = Builders<Psicologo>.Update
                .Push(p => p.Disponibilidades, disponibilidade);

            await _collection.UpdateOneAsync(p => p.Id == psicologoId, adicionarDisponibilidade);
            return disponibilidade;
        }

        public async Task<Psicologo> CadastrarPsicologo(Psicologo psicologo)
        {
            psicologo.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Psicologo));
            await _collection.InsertOneAsync(psicologo);
            return psicologo;
        }

        public async Task<Psicologo> EditarPsicologo(String psicologoId, Psicologo psicologo)
        {
            await _collection.ReplaceOneAsync(p => p.Id == psicologoId, psicologo);
            return psicologo;
        }

        public async Task ExcluirDisponibilidade(String psicologoId, String disponibilidadeId)
        {
            var deleteDisponibilidade = Builders<Psicologo>.Update
                .PullFilter(p => p.Disponibilidades, d => d.Id == disponibilidadeId);

            await _collection.UpdateOneAsync(p => p.Id == psicologoId, deleteDisponibilidade);
        }

        public async Task ExcluirPsicologo(String id)
        {
            await _collection.DeleteOneAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Psicologo>> GetAllPsicologos()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Disponibilidade> GetDisponibilidadeByPsicologoIdAndDisponibilidadeId(String psicologoId, String disponibilidadeId)
        {
            var psicologo = await _collection.Find(p => p.Id == psicologoId).FirstOrDefaultAsync();

            if (psicologo == null || psicologo.Disponibilidades == null)
                return null;

            return psicologo.Disponibilidades.FirstOrDefault(d => d.Id == disponibilidadeId);
        }

        public async Task<List<Disponibilidade>> GetDisponibilidadesByPsicologoId(String psicologoId)
        {
            var psicologo = await _collection.Find(p => p.Id == psicologoId).FirstOrDefaultAsync();
           
            if (psicologo == null || psicologo.Disponibilidades == null)
                return null;

            return psicologo.Disponibilidades.ToList();
        }

        public async Task<Psicologo> GetPsicologoByCpfCnpj(String cpfCnpj)
        {
            return await _collection.Find(p => p.CpfCnpj == cpfCnpj).FirstOrDefaultAsync();
        }

        public async Task<Psicologo> GetPsicologoByCrp(String crp)
        {
            return await _collection.Find(p => p.Crp.Numero == crp).FirstOrDefaultAsync();
        }

        public async Task<Psicologo> GetPsicologoByEmail(String email)
        {
            return await _collection.Find(p => p.Email.Endereco == email).FirstOrDefaultAsync();
        }

        public async Task<Psicologo> GetPsicologoById(String psicologoId)
        {
            return await _collection.Find(p => p.Id == psicologoId).FirstOrDefaultAsync();
        }

        public async Task<List<Psicologo>> GetPsicologosByEspecialidade(String especialidade)
        {
            return await _collection.Find(p => p.Especialidade == especialidade).ToListAsync();
        }

        public async Task<List<Psicologo>> GetPsicologosByNome(String nome)
        {
            return await _collection.Find(p => p.Nome == nome).ToListAsync();
        }
    }
}
