using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Common
{
    public class TelefoneValidationHelper
    {
        public static Boolean IsValid(String? telefone)
        {
            if (String.IsNullOrWhiteSpace(telefone))
                return false;

            var normalizado = Regex.Replace(telefone, @"\D", "");
            return normalizado.Length is 10 or 11;
        }
    }
}
