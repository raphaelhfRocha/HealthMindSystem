using System;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IRefreshTokenService
    {
        /// <summary>
        /// Gera um novo refresh token
        /// </summary>
        Task<string> GenerateRefreshTokenAsync(string userId);
        
        /// <summary>
        /// Valida um refresh token
        /// </summary>
        Task<bool> ValidateRefreshTokenAsync(string userId, string refreshToken);
        
        /// <summary>
        /// Revoga um refresh token
        /// </summary>
        Task RevokeRefreshTokenAsync(string userId, string refreshToken);
        
        /// <summary>
        /// Revoga todos os refresh tokens de um usuário
        /// </summary>
        Task RevokeAllRefreshTokensAsync(string userId);
        
        /// <summary>
        /// Obtém o usuário associado ao token
        /// </summary>
        Task<string?> GetUserIdFromTokenAsync(string token);
    }
}