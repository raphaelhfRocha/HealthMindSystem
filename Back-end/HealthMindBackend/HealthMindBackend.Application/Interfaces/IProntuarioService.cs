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
        Task<List<MedicamentoDTO>> GetMedicamentosByProntuarioId(String prontuarioId);
        Task<MedicamentoDTO> GetMedicamentoByProntuarioIdAndMedicamentoId(String prontuarioId, String medicamentoId);
        Task RegistrarProntuario(ProntuarioDTO prontuarioDto);
        Task EditarProntuario(ProntuarioDTO prontuarioDto);
        Task RegistrarMedicamento(MedicamentoDTO medicamentoDto);
        Task EditarMedicamento(String medicamentoId, MedicamentoDTO medicamentoDto);
        Task ExcluirMedicamento(String prontuarioId, String medicamentoId);
    }
}
