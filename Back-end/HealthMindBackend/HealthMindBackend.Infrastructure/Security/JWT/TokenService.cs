using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.Security.JWT
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public String GenerateToken(Usuario usuario)
        {
            usuario = usuario ?? throw new ArgumentNullException(nameof(usuario));

            var handler = new JwtSecurityTokenHandler();

            var secret = _configuration["JWT:Secret"];

            if (String.IsNullOrEmpty(secret))
                throw new InvalidOperationException("Secret não configurada.");

            var key = Encoding.UTF8.GetBytes(secret);

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.StatusCargo.ToString()),
                new Claim("usuarioId", usuario.Id.ToString()),
                new Claim("usuarioNome", usuario.Nome)
            };

            if(usuario is Psicologo psicologo)
            {
                claims.Add(new Claim("PsicologoId", psicologo.Id));
            }
            if(usuario is Recepcionista recepcionista)
            {
                claims.Add(new Claim("RecepcionistaId", recepcionista.Id));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = credentials,
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"]
            };

            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }
    }
}
