using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using System.Text.RegularExpressions;

namespace HealthMindBackend.Domain.ValueObjects.Contato
{
    public class Email : ValueObject
    {
        public String Endereco { get; private set; }

        protected Email() { }

        public Email(String endereco)
        {
            DomainExceptionValidation.Validate(
                String.IsNullOrWhiteSpace(endereco),
                "E-mail inválido."
            );

            endereco = endereco.Trim().ToLower();

            DomainExceptionValidation.Validate(
                !IsValid(endereco),
                "Formato do e-mail inválido."
            );

            Endereco = endereco;
        }

        private Boolean IsValid(String email)
        {
            var regex = new Regex(
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                RegexOptions.IgnoreCase
            );

            return regex.IsMatch(email);
        }

        public String ObterDominio()
        {
            return Endereco.Split('@')[1];
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return Endereco;
        }

        public override String ToString()
        {
            return Endereco;
        }

        public static implicit operator String(Email email)
        {
            return email.Endereco;
        }
    }
}