using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Persistence
{
    public class MongoDbContext
    {
        public IMongoDatabase Database { get; }

        public MongoDbContext(IMongoClient client, String databaseName)
        {
            Database = client.GetDatabase(databaseName); ;
        }
    }
}
