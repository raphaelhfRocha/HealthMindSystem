using System;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface ISecurityLogService
    {
        /// <summary>
        /// Registra uma tentativa de login bem-sucedida
        /// </summary>
        Task LogSuccessfulLoginAsync(string email, string ipAddress, string userAgent);
        
        /// <summary>
        /// Registra uma tentativa de login falha
        /// </summary>
        Task LogFailedLoginAsync(string email, string ipAddress, string userAgent, string reason);
        
        /// <summary>
        /// Registra bloqueio de conta/IP
        /// </summary>
        Task LogBlockAsync(string key, string ipAddress, string reason);
        
        /// <summary>
        /// Registra solicitação de recuperação de senha
        /// </summary>
        Task LogPasswordResetRequestAsync(string email, string ipAddress);
        
        /// <summary>
        /// Registra alteração de senha
        /// </summary>
        Task LogPasswordChangeAsync(string userId, string ipAddress);
        
        /// <summary>
        /// Registra uso de refresh token
        /// </summary>
        Task LogRefreshTokenUsageAsync(string userId, string ipAddress);
    }
}