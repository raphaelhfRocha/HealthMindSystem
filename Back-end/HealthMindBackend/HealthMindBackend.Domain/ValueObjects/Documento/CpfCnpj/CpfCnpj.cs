using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj
{
    public sealed class CpfCnpj : ValueObject
    {
        public String Numero { get; private set; }

        private CpfCnpj() { }

        public CpfCnpj(String numero)
        {

            DomainExceptionValidation.Validate(
                String.IsNullOrWhiteSpace(numero),
                "CPF/CNPJ inválido."
            );

            numero = RemoverMascara(numero);

            if (numero.Length == 11)
            {
                DomainExceptionValidation.Validate(
                    !CPFValidator.IsValid(numero),
                    "CPF inválido."
                );
            }
            else if (numero.Length == 14)
            {
                DomainExceptionValidation.Validate(
                    !CNPJValidator.IsValid(numero),
                    "CNPJ inválido."
                );
            }
            else
            {
                throw new DomainExceptionValidation(
                    "CPF/CNPJ deve possuir 11 ou 14 dígitos."
                );
            }

            Numero = numero;
        }

        public Boolean IsCpf()
        {
            return Numero.Length == 11;
        }

        public Boolean IsCnpj()
        {
            return Numero.Length == 14;
        }

        public String Formatado()
        {
            if (IsCpf())
            {
                return Convert.ToUInt64(Numero)
                    .ToString(@"000\.000\.000\-00");
            }

            return Convert.ToUInt64(Numero)
                .ToString(@"00\.000\.000\/0000\-00");
        }

        public static String RemoverMascara(String valor)
        {
            if (String.IsNullOrWhiteSpace(valor))
                return String.Empty;

            return Regex.Replace(valor, @"\D", "");
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return Numero;
        }

        public override String ToString()
        {
            return Formatado();
        }
    }
}
