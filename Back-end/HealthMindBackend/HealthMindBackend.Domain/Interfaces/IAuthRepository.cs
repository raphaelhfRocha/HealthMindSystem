using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IAuthRepository
    {
        Task<Usuario> GetUsuarioById(String id);
        Task<Usuario> GetUsuarioByCpfCnpj(CpfCnpj cpfCnpj);
        Task<Usuario?> GetUsuarioByEmail(Email email);
        Task<String?> Login(Email email, String senha);
        Task<Usuario> CadastrarUsuario(Usuario usuario);
        Task<Usuario> EditarUsuario(String id, Usuario usuario);
        Task ExcluirUsuario(String id);
    }
}
