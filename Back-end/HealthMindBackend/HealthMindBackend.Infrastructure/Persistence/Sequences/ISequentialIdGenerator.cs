using System.Threading;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Persistence.Sequences
{
    public interface ISequentialIdGenerator
    {
        Task<string> GenerateNextIdAsync(
            string sequenceName,
            string prefix,
            CancellationToken cancellationToken = default
        );
    }
}
