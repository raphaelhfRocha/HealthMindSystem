using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IHistoricoMedicoRepository
    {
        Task<IEnumerable<HistoricoMedico>> GetAllHistoricos();
        Task<IEnumerable<HistoricoMedico>> GetHistoricosByProntuarioId(String prontuarioId);
        Task<HistoricoMedico> GetHistoricoById(String historicoId);
        Task<HistoricoMedico> AdicionarHistoricoMedico(HistoricoMedico historico);
        Task<HistoricoMedico> EditarHistoricoMedico(String historicoId, HistoricoMedico historico);
        Task ExcluirHistoricoMedico(String historicoId);
    }
}
