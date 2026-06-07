using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using System.Text.RegularExpressions;

namespace HealthMindBackend.Domain.ValueObjects.Saude
{
    public class Cid : ValueObject
    {
        public String Codigo { get; private set; }

        protected Cid() { }

        public Cid(String codigo)
        {
            DomainExceptionValidation.Validate(
                String.IsNullOrWhiteSpace(codigo),
                "CID inválido."
            );

            codigo = codigo.Trim().ToUpper();

            DomainExceptionValidation.Validate(
                !IsValid(codigo),
                "Formato do CID inválido."
            );

            Codigo = codigo;
        }

        private Boolean IsValid(String codigo)
        {
            /*
             Exemplos válidos:
             F41.1
             F32
             A00
             Z73.0
            */

            var regex = new Regex(
                @"^[A-Z][0-9]{2}(\.[0-9])?$"
            );

            return regex.IsMatch(codigo);
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return Codigo;
        }

        public override String ToString()
        {
            return Codigo;
        }

        public static implicit operator String(Cid cid)
        {
            return cid.Codigo;
        }
    }
}