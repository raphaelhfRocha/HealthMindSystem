using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Common
{
    public static class CrpValidationHelper
    {
        public static Boolean IsValid(String? crp)
        {
            if (String.IsNullOrWhiteSpace(crp))
                return false;

            var crpRegex = new Regex(@"^\d{2}/\d{4,6}$", RegexOptions.Compiled);

            return crpRegex.IsMatch(crp);
        }   
    }
}
