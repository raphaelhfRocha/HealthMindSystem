using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using System.Text.RegularExpressions;

namespace HealthMindBackend.Domain.ValueObjects.Documento
{
    public class Crp : ValueObject
    {
        public String Numero { get; set; }

        protected Crp() { }

        public Crp(String numero)
        {
            DomainExceptionValidation.Validate(
                String.IsNullOrWhiteSpace(numero),
                "CRP inválido."
            );

            numero = numero.Trim();

            var regex = @"^\d{2}/\d{4,6}$";

            DomainExceptionValidation.Validate(
                !Regex.IsMatch(numero, regex),
                "Formato do CRP inválido."
            );

            Numero = numero;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return Numero;
        }

        public override String ToString()
        {
            return Numero;
        }
    }
}