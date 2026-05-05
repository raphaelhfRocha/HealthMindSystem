using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects
{
    public sealed class CpfCnpj : IEquatable<CpfCnpj>
    {
        public String Value { get; }

        public CpfCnpj(String value)
        {
            if (String.IsNullOrEmpty(value))
                throw new ArgumentNullException("CPF/CNPJ não pode ser vazio");

            value = value.Trim().Replace(".", "").Replace("-", "").Replace("/", "");

            if(value.Length == 11)
            {
                if (!CpfValido(value))
                    throw new ArgumentException("CPF inválido.");
            }
            else if(value.Length == 14)
            {
                if (!CnpjValido(value))
                    throw new ArgumentException("CNPJ inválido.");
            }
            else
            {
                throw new ArgumentException("CPF/CNPJ deve ter 11 ou 14 dígitos.");
            }

            Value = value;
        }

        private Boolean CpfValido(String value)
        {
            return Regex.IsMatch(value, @"^\d{11}$");
        }

        private Boolean CnpjValido(String value)
        {
            return Regex.IsMatch(value, @"^\d{14}$");
        }

        public override bool Equals(object obj) => Equals(obj as CpfCnpj);

        public bool Equals(CpfCnpj other) => other != null && Value == other.Value;

        public override int GetHashCode() => Value.GetHashCode();

        public override string ToString() => Value;

        public static implicit operator string(CpfCnpj cpfCnpj) => cpfCnpj?.Value;
    }
}
