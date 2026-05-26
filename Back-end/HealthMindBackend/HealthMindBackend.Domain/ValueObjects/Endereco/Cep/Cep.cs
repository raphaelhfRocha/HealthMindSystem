using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using System.Text.RegularExpressions;

namespace HealthMindBackend.Domain.ValueObjects.Endereco
{
    public class Cep : ValueObject
    {
        public string Codigo { get; private set; }

        protected Cep() { }

        public Cep(String codigo)
        {
            DomainExceptionValidation.Validate(
                String.IsNullOrWhiteSpace(codigo),
                "CEP inválido."
            );

            codigo = Normalizar(codigo);

            DomainExceptionValidation.Validate(
                !IsValid(codigo),
                "Formato do CEP inválido."
            );

            Codigo = codigo;
        }

        private String Normalizar(String codigo)
        {
            return Regex.Replace(codigo, @"\D", "");
        }

        private Boolean IsValid(String codigo)
        {
            /*
             CEP brasileiro:
             00000000
            */

            return codigo.Length == 8;
        }

        public String Formatar()
        {
            return $"{Codigo[..5]}-{Codigo.Substring(5, 3)}";
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return Codigo;
        }

        public override String ToString()
        {
            return Formatar();
        }

        public static implicit operator String(Cep cep)
        {
            return cep.Codigo;
        }
    }
}