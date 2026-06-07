using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using System.Text.RegularExpressions;

namespace HealthMindBackend.Domain.ValueObjects.Contato
{
    public class Telefone : ValueObject
    {
        public String Numero { get; private set; }

        protected Telefone() { }

        public Telefone(String numero)
        {
            DomainExceptionValidation.Validate(
                String.IsNullOrWhiteSpace(numero),
                "Telefone inválido."
            );

            numero = Normalizar(numero);

            DomainExceptionValidation.Validate(
                !IsValid(numero),
                "Formato do telefone inválido."
            );

            Numero = numero;
        }

        private String Normalizar(String numero)
        {
            return Regex.Replace(numero, @"\D", "");
        }

        private Boolean IsValid(String numero)
        {
            /*
             Formatos aceitos após normalização:
             
             11999999999
             1133334444
             */

            return numero.Length == 10 || (numero.Length >= 11 && numero.Length <= 14);
        }

        public String ObterDDD()
        {
            return Numero.Substring(0, 2);
        }

        public String ObterNumero()
        {
            return Numero.Substring(2);
        }

        public String Formatar()
        {
            if (Numero.Length == 11)
            {
                return $"({Numero[..2]}) {Numero.Substring(2, 5)}-{Numero.Substring(7, 4)}";
            }

            return $"({Numero[..2]}) {Numero.Substring(2, 4)}-{Numero.Substring(6, 4)}";
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return Numero;
        }

        public override String ToString()
        {
            return Formatar();
        }

        public static implicit operator String(Telefone telefone)
        {
            return telefone.Numero;
        }
    }
}