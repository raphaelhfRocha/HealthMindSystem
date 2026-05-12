using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Security.JWT
{
    public class JwtConfig
    {
        private String _validAudience;
        private String _validIssuer;
        private String _secret;
        public String ValidAudience { get => _validAudience; set => _validAudience = value; }
        public String ValidIssuer { get => _validIssuer; set => _validIssuer = value; }
        public String Secret { get => _secret; set => _secret = value; }
    }
}
