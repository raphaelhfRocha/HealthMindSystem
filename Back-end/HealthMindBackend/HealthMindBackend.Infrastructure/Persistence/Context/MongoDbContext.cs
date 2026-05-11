using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Persistence.Context
{
    public class MongoDbContext : IMongoDbContext
    {
        public IMongoDatabase Database { get; }

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var connectionString = settings.Value.ConnectionString;

            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException("MongoDB connection string is not configured.");

            // For MongoDB Atlas SRV URIs, ensure authSource is specified
            if (connectionString.StartsWith("mongodb+srv://", StringComparison.OrdinalIgnoreCase)
                && !connectionString.Contains("authSource=", StringComparison.OrdinalIgnoreCase))
            {
                connectionString = connectionString.Contains("?")
                    ? $"{connectionString}&authSource=admin"
                    : $"{connectionString}?authSource=admin";
            }

            // Use MongoClient with connection string directly to avoid DNS resolution issues
            // with MongoDB.Driver 3.x that causes "name servers must not be empty" errors
            var client = new MongoClient(connectionString);
            
            // Extract database name from connection string or use configured default
            var mongoUrl = new MongoUrl(connectionString);
            var databaseName = string.IsNullOrEmpty(mongoUrl.DatabaseName) ? settings.Value.Database : mongoUrl.DatabaseName;
            
            Database = client.GetDatabase(databaseName);
        }
    }
}
