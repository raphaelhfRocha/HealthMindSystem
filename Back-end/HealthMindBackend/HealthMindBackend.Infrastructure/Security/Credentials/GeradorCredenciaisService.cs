using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace HealthMindBackend.Infrastructure.Security.Credenciais
{
    public class GeradorCredenciaisService : IGeradorCredenciaisService
    {
        private const String Dominio = "healthmind.com";
        private const String Simbolos = "!@#$%&*";
        private const Int32 QuantidadeDigitos = 5;

        public String GerarEmail(String nome, StatusCargoEnum cargo)
        {
            var slug = GerarSlugNome(nome);
            var sufixoCargo = cargo == StatusCargoEnum.StsPsicologo ? "psi" : "rec";
            var numeros = GerarDigitos(QuantidadeDigitos);

            return $"{slug}{numeros}.{sufixoCargo}@{Dominio}";
        }

        public String GerarSenha(String nome)
        {
            var primeiroNome = CapitalizarPrimeiraLetra(ObterPrimeiroNome(nome));
            var simbolo = Simbolos[RandomNumberGenerator.GetInt32(Simbolos.Length)];
            var numeros = GerarDigitos(QuantidadeDigitos);

            return $"{primeiroNome}{simbolo}{numeros}";
        }

        private static String GerarSlugNome(String nome)
        {
            var partes = NormalizarNome(nome).Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (partes.Length == 0)
                return "usuario";

            var primeiro = partes[0];
            var ultimo = partes.Length > 1 ? partes[^1] : String.Empty;

            return $"{primeiro}{ultimo}";
        }

        private static String ObterPrimeiroNome(String nome)
        {
            var partes = NormalizarNome(nome).Split(' ', StringSplitOptions.RemoveEmptyEntries);

            return partes.Length > 0 ? partes[0] : "usuario";
        }

        private static String NormalizarNome(String nome)
        {
            if (String.IsNullOrWhiteSpace(nome))
                return String.Empty;

            var normalizado = nome.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();

            foreach (var caractere in normalizado)
            {
                var categoria = CharUnicodeInfo.GetUnicodeCategory(caractere);

                if (categoria == UnicodeCategory.NonSpacingMark)
                    continue;

                if (Char.IsLetter(caractere))
                    builder.Append(Char.ToLowerInvariant(caractere));
                else if (Char.IsWhiteSpace(caractere))
                    builder.Append(' ');
            }

            return builder.ToString().Trim();
        }

        private static String CapitalizarPrimeiraLetra(String texto)
        {
            if (String.IsNullOrEmpty(texto))
                return texto;

            return Char.ToUpperInvariant(texto[0]) + texto[1..];
        }

        private static String GerarDigitos(Int32 quantidade)
        {
            var builder = new StringBuilder(quantidade);

            for (var i = 0; i < quantidade; i++)
                builder.Append(RandomNumberGenerator.GetInt32(10));

            return builder.ToString();
        }
    }
}
