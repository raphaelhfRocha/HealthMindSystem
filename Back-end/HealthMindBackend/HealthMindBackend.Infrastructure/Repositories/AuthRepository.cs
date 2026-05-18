using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
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
        private const string SequenceName = "USUARIO";
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

        public async Task<Usuario> GetUsuarioByEmail(String email)
        {
            return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<Usuario> GetUsuarioById(Usuario usuario)
        {
            return await _collection.Find(u => u.Id == usuario.Id).FirstOrDefaultAsync();
        }

        public async Task<String?> Login(String email, String senha)
        {
            var usuarioEncontrado = await GetUsuarioByEmail(email);

            if (usuarioEncontrado == null)
                throw new KeyNotFoundException("E-mail inválido");

            Boolean senhaAutenticada = _passwordHasher.VerifyPassword(senha, usuarioEncontrado.Senha);

            if (!senhaAutenticada)
                throw new KeyNotFoundException("Senha inválida");

            return _tokenService.GenerateToken(usuarioEncontrado);
        }

        public async Task<Boolean> ValidateEmailIsAlreadyExist(String email)
        {
            return await _collection.Find(u => u.Email == email).AnyAsync();
        }
    }
}
