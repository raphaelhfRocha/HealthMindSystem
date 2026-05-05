using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IProntuarioService
    {
        Task<IEnumerable<ProntuarioDTO>> GetAllProntuarios();
        Task RegistrarProntuario(ProntuarioDTO prontuarioDto);
        Task EditarProntuario(ProntuarioDTO prontuarioDto);
    }
}
