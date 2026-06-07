namespace HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj
{
    public static class CNPJValidator
    {
        public static bool IsValid(string cnpj)
        {
            cnpj = cnpj.Trim().Replace(".", "")
                .Replace("-", "")
                .Replace("/", "");

            if (cnpj.Length != 14)
                return false;

            if (cnpj.All(c => c == cnpj[0]))
                return false;

            int[] multiplicador1 =
            {
                5,4,3,2,9,8,7,6,5,4,3,2
            };

            int[] multiplicador2 =
            {
                6,5,4,3,2,9,8,7,6,5,4,3,2
            };

            string tempCnpj = cnpj[..12];

            int soma = 0;

            for (int i = 0; i < 12; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador1[i];

            int resto = soma % 11;

            resto = resto < 2 ? 0 : 11 - resto;

            string digito = resto.ToString();

            tempCnpj += digito;

            soma = 0;

            for (int i = 0; i < 13; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador2[i];

            resto = soma % 11;

            resto = resto < 2 ? 0 : 11 - resto;

            digito += resto.ToString();

            return cnpj.EndsWith(digito);
        }
    }
}