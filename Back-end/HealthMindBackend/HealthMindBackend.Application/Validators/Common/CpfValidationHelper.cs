using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Common
{
    public static class CpfValidationHelper
    {
        public static Boolean IsValid(String? cpf)
        {
            if (String.IsNullOrWhiteSpace(cpf))
                return false;

            var numeroNormalizado = CpfCnpj.RemoverMascara(cpf);

            return numeroNormalizado.Length switch
            {
                11 => CPFValidator.IsValid(numeroNormalizado),
                _ => false
            };
        }
    }
}
