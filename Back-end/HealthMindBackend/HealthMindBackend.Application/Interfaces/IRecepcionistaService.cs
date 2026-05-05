using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IRecepcionistaService
    {
        Task<IEnumerable<RecepcionistaDTO>> GetAllRecepcionistas();
        Task CadastrarRecepcionista(RecepcionistaDTO recepcionistaDto);
        Task AtualizarRecepcionista(RecepcionistaDTO recepcionistaDto);
        Task ExcluirRecepcionista(String recepcionistaId);
    }
}
