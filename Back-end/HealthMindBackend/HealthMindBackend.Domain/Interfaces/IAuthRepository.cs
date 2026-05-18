using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IAuthRepository
    {
        Task<Usuario?> GetUsuarioByEmail(String email);
        Task<Usuario> GetUsuarioById(Usuario usuario);
        Task<String?> Login(String email, String senha);
        Task<Usuario> CadastrarUsuario(Usuario usuario);
        Task<Boolean> ValidateEmailIsAlreadyExist(String email);
    }
}
