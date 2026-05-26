using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;

namespace HealthMindBackend.Application.Validators.Common
{
    public static class CpfCnpjValidationHelper
    {
        public static Boolean IsValid(String? cpfCnpj)
        {
            if (String.IsNullOrWhiteSpace(cpfCnpj))
                return false;

            var numeroNormalizado = CpfCnpj.RemoverMascara(cpfCnpj);

            return numeroNormalizado.Length switch
            {
                11 => CPFValidator.IsValid(numeroNormalizado),
                14 => CNPJValidator.IsValid(numeroNormalizado),
                _ => false
            };
        }
    }
}
