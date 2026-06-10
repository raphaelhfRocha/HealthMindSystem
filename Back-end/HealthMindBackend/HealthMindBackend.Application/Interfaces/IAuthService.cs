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
        Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDto);
        Task<UsuarioDTO> GetUsuarioById(String id);
        Task CadastrarPsicologo(PsicologoDTO psicologoCadastroDto);
        Task EditarPsicologo(PsicologoDTO psicologoCadastroDto);
        Task CadastrarRecepcionista(RecepcionistaDTO recepcionistaCadastroDto);
        Task EditarRecepcionista(RecepcionistaDTO recepcionistaCadastroDto);
        Task ExcluirRecepcionista(String recepcionistaId);
    }
}
