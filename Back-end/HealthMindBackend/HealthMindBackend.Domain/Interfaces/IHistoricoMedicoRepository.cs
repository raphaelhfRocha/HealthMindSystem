using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
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
        Task<List<HistoricoMedico>> GetHistoricosByProntuarioId(String prontuarioId);
        Task<HistoricoMedico> GetHistoricoById(String historicoId);
        Task<List<MetaTerapeutica>> GetMetaTerapeuticasByHistoricoMedicoId(String historicoId);
        Task<MetaTerapeutica> GetMetaTerapeuticaByHistoricoMedicoIdAndMetaTerapeuticaId(String historicoId, String metaTerapeuticaId);
        Task<HistoricoMedico> AdicionarHistoricoMedico(HistoricoMedico historico);
        Task<HistoricoMedico> EditarHistoricoMedico(String historicoId, HistoricoMedico historico);
        Task ExcluirHistoricoMedico(String historicoId);
        Task<SaudeMental> DefinirSaudeMental(String historicoId, SaudeMental saudeMental);
        Task ExcluirSaudeMental(String historicoId);
        Task<MetaTerapeutica> AdicionarMetaTerapeutica(String historicoId, MetaTerapeutica metaTerapeutica);
        Task<MetaTerapeutica> EditarMetaTerapeutica(String historicoId, String metaTerapeuticaId, MetaTerapeutica metaTerapeutica);
    }
}
