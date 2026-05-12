using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Security.PasswordHasher
{
    public class PasswordHasherService : IPasswordHasherService
    {
        public String HashPassword(String senha)
        {
            byte[] salt = new byte[32];
            using(var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            byte[] senhaBytes = Encoding.UTF8.GetBytes(senha);
            byte[] senhaComSalt = new byte[senhaBytes.Length + salt.Length];

            Array.Copy(senhaBytes, 0, senhaComSalt, 0, senhaBytes.Length);
            Array.Copy(salt, 0, senhaComSalt, senha.Length, salt.Length);

            using(var sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(senhaComSalt);

                byte[] hashComSalt = new byte[salt.Length + hash.Length];
                Array.Copy(salt, 0, hashComSalt, 0, salt.Length);
                Array.Copy(hash, 0, hashComSalt, salt.Length, hash.Length);

                return Convert.ToBase64String(hashComSalt);
            }
        }

        public Boolean VerifyPassword(String senha, String hashComSaltBase64)
        {
            byte[] hashComSalt = Convert.FromBase64String(hashComSaltBase64);

            Int32 saltLength = 32;

            if (hashComSalt.Length < saltLength)
                return false;

            byte[] salt = new byte[saltLength];
            Array.Copy(hashComSalt, 0, salt, 0, saltLength);

            Int32 hashLength = hashComSalt.Length - saltLength;
            byte[] hashArmazenado = new byte[hashLength];
            Array.Copy(hashComSalt, saltLength, hashArmazenado, 0, hashLength);

            byte[] senhaBytes = Encoding.UTF8.GetBytes(senha);
            byte[] senhaComSalt = new byte[senhaBytes.Length + salt.Length];
            Array.Copy(senhaBytes, 0, senhaComSalt, senhaBytes.Length, salt.Length);

            using(var sha256 = SHA256.Create())
            {
                byte[] hashInformado = sha256.ComputeHash(senhaComSalt);
                return hashArmazenado.SequenceEqual(hashArmazenado);
            }
        }
    }
}
