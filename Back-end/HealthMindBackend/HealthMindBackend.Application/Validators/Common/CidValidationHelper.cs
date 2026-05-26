using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Common
{
    public static class CidValidationHelper
    {
        public static Boolean IsValid(String? cid)
        {
            if (String.IsNullOrWhiteSpace(cid))
                return false;

            var cidRegex = new Regex(@"^[A-TV-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$", RegexOptions.IgnoreCase | RegexOptions.Compiled);

            return cidRegex.IsMatch(cid);
        }
    }
}
