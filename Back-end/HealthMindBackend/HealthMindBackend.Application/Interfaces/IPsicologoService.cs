using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IPsicologoService
    {
        Task<IEnumerable<PsicologoDTO>> GetAllPsicologos();
        Task CadastrarPsicologo(PsicologoDTO psicologoDto);
        Task AtualizarPsicologo(PsicologoDTO psicologoDto);
        Task ExcluirPsicologo(String psicologoId);
    }
}
