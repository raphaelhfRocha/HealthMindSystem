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
        Task<List<HistoricoMedicoDTO>> GetHistoricosByProntuarioId(String prontuarioId);
        Task<List<MetaTerapeuticaDTO>> GetMetaTerapeuticasByHistoricoMedicoId(String historicoId);
        Task AdicionarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto);
        Task AtualizarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto);
        Task ExcluirHistoricoMedico(String historicoId);
        Task AdicionarMetaTerapeutica(MetaTerapeuticaDTO metaTerapeuticaDto);
        Task AlterarMetaTerapeutica(String historicoId, String metaTerapeuticaId, MetaTerapeuticaDTO metaTerapeuticaDto);
    }
}
