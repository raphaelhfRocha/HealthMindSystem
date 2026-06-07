using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Configurations
{
    public class MongoDbSettings
    {
        public String ConnectionString { get; set; }
        public String Database { get; set; }
    }
}
