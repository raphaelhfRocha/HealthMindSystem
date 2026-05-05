using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IHistoricoMedicoService
    {
        Task<IEnumerable<HistoricoMedicoDTO>> GetAllHistoricoMedicos();
        Task<IEnumerable<HistoricoMedicoDTO>> GetHistoricosByProntuarioId(String prontuarioId);
        Task AdicionarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto);
        Task AtualizarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto);
    }
}
