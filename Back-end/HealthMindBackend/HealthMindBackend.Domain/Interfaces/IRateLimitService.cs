using System;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IRateLimitService
    {
        /// <summary>
        /// Verifica se o IP está bloqueado temporariamente
        /// </summary>
        Task<bool> IsBlockedAsync(string key);
        
        /// <summary>
        /// Registra uma tentativa falha de login
        /// </summary>
        Task RegisterFailedAttemptAsync(string key);
        
        /// <summary>
        /// Limpa as tentativas de login para um IP/usuário
        /// </summary>
        Task ClearAttemptsAsync(string key);
        
        /// <summary>
        /// Obtém o número de tentativas restantes
        /// </summary>
        Task<int> GetRemainingAttemptsAsync(string key);
        
        /// <summary>
        /// Obtém o tempo de bloqueio restante em segundos
        /// </summary>
        Task<int?> GetBlockTimeRemainingAsync(string key);
    }
}