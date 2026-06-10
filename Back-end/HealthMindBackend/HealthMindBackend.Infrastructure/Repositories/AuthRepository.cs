using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Prefixes;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using HealthMindBackend.Infrastructure.Security.JWT;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private const String SequenceName = "USUARIO";
        private readonly IMongoCollection<Usuario> _collection;
        private readonly ISequentialIdGenerator _sequentialIdGenerator;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly ITokenService _tokenService;

        public AuthRepository(IMongoDbContext context, ISequentialIdGenerator sequentialIdGenerator,
            IPasswordHasherService passwordHasher, ITokenService tokenService)
        {
            _collection = context.Database.GetCollection<Usuario>("USUARIO");
            _sequentialIdGenerator = sequentialIdGenerator;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<Usuario> CadastrarUsuario(Usuario usuario)
        {
            var senha = _passwordHasher.HashPassword(usuario.Senha);
            usuario.Senha = senha;
            usuario.DefinirId(await _sequentialIdGenerator.GenerateNextIdAsync(SequenceName, Prefix.Usuario));
            await _collection.InsertOneAsync(usuario);
            return usuario;
        }

        public async Task<Usuario> EditarUsuario(String id, Usuario usuario)
        {
            var senha = _passwordHasher.HashPassword(usuario.Senha);
            usuario.Senha = senha;
            await _collection.ReplaceOneAsync(u => u.Id == id, usuario);
            return usuario;
        }

        public async Task ExcluirUsuario(String id)
        {
            await _collection.DeleteOneAsync(u => u.Id == id);
        }

        public async Task<Usuario> GetUsuarioByCpfCnpj(CpfCnpj cpfCnpj)
        {
            return await _collection.Find(u => u.CpfCnpj == cpfCnpj).FirstOrDefaultAsync();
        }

        public async Task<Usuario> GetUsuarioByEmail(Email email)
        {
            return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<Usuario> GetUsuarioById(String id)
        {
            return await _collection.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<String?> Login(Email email, String senha)
        {
            var usuarioEncontrado = await GetUsuarioByEmail(email);

            if (usuarioEncontrado == null)
                throw new KeyNotFoundException("E-mail/senha inválido");

            Boolean senhaAutenticada = _passwordHasher.VerifyPassword(senha, usuarioEncontrado.Senha);

            if (!senhaAutenticada)
                throw new KeyNotFoundException("E-mail/senha inválida");

            return _tokenService.GenerateToken(usuarioEncontrado);
        }
    }
}
