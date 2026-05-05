using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Validations
{
    public class DomainExceptionValidation : Exception
    {
        public DomainExceptionValidation(String error) : base(error)
        {
        }

        public static void Validate(Boolean hasError, String error)
        {
            if(hasError)
                throw new DomainExceptionValidation(error);
        }
    }
}
