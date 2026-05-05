using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Persistence
{
    public class MongoSettings
    {
        public String ConnectionString { get; set; }
        public String Database { get; set; }
    }
}
