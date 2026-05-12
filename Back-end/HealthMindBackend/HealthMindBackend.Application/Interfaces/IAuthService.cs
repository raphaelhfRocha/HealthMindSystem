using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IAuthService
    {
        Task<UsuarioDTO> Login(String email, String senha);
        Task CadastrarPsicologo(PsicologoCadastroDTO psicologoCadastroDto);
        Task CadastrarRecepcionista(RecepcionistaCadastroDTO recepcionistaCadastroDto);
    }
}
