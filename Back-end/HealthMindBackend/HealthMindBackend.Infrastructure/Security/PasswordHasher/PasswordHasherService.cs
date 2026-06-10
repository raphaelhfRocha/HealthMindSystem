using HealthMindBackend.Domain.Interfaces;
using System;
using System.Security.Cryptography;
using System.Text;

namespace HealthMindBackend.Infrastructure.Security.PasswordHasher
{
    public class PasswordHasherService : IPasswordHasherService
    {
        private const Int32 SaltLength = 32;
        private const Int32 HashLength = 32;

        public String HashPassword(String senha)
        {
            ArgumentNullException.ThrowIfNull(senha);

            byte[] salt = RandomNumberGenerator.GetBytes(SaltLength);
            byte[] hash = ComputeHash(senha, salt);

            byte[] hashComSalt = new byte[SaltLength + hash.Length];
            Buffer.BlockCopy(salt, 0, hashComSalt, 0, SaltLength);
            Buffer.BlockCopy(hash, 0, hashComSalt, SaltLength, hash.Length);

            return Convert.ToBase64String(hashComSalt);
        }

        public Boolean VerifyPassword(String senha, String hashComSaltBase64)
        {
            if (senha is null || String.IsNullOrWhiteSpace(hashComSaltBase64))
                return false;

            byte[] hashComSalt;

            try
            {
                hashComSalt = Convert.FromBase64String(hashComSaltBase64);
            }
            catch (FormatException)
            {
                return false;
            }

            if (hashComSalt.Length != SaltLength + HashLength)
                return false;

            byte[] salt = new byte[SaltLength];
            Buffer.BlockCopy(hashComSalt, 0, salt, 0, SaltLength);

            byte[] hashArmazenado = new byte[HashLength];
            Buffer.BlockCopy(hashComSalt, SaltLength, hashArmazenado, 0, HashLength);

            byte[] hashInformado = ComputeHash(senha, salt);
            if (CryptographicOperations.FixedTimeEquals(hashArmazenado, hashInformado))
                return true;

            // Compatibilidade com hashes gerados na implementacao anterior para senhas nao-ASCII.
            byte[] hashLegado = ComputeHashLegacy(senha, salt);
            return CryptographicOperations.FixedTimeEquals(hashArmazenado, hashLegado);
        }

        private static byte[] ComputeHash(String senha, byte[] salt)
        {
            byte[] senhaBytes = Encoding.UTF8.GetBytes(senha);
            byte[] senhaComSalt = new byte[senhaBytes.Length + salt.Length];
            Buffer.BlockCopy(senhaBytes, 0, senhaComSalt, 0, senhaBytes.Length);
            Buffer.BlockCopy(salt, 0, senhaComSalt, senhaBytes.Length, salt.Length);

            using var sha256 = SHA256.Create();
            return sha256.ComputeHash(senhaComSalt);
        }

        private static byte[] ComputeHashLegacy(String senha, byte[] salt)
        {
            byte[] senhaBytes = Encoding.UTF8.GetBytes(senha);
            byte[] senhaComSalt = new byte[senhaBytes.Length + salt.Length];
            Buffer.BlockCopy(senhaBytes, 0, senhaComSalt, 0, senhaBytes.Length);
            Buffer.BlockCopy(salt, 0, senhaComSalt, senha.Length, salt.Length);

            using var sha256 = SHA256.Create();
            return sha256.ComputeHash(senhaComSalt);
        }
    }
}
