using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IPasswordHasherService
    {
        String HashPassword(String senha);
        Boolean VerifyPassword(String senha, String hashComSaltBase64);
    }
}
