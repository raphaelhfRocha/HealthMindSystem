using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IDiagnosticoRepository
    {
        Task<IEnumerable<Diagnostico>> GetAllDiagnosticos();
        Task<Diagnostico> GetDiagnosticoById(String diagnosticoId);
        Task<List<Diagnostico>> GetDiagnosticosByProntuarioId(String prontuarioId);
        Task<Diagnostico> AdicionarDiagnostico(Diagnostico diagnostico);
        Task<Diagnostico> EditarDiagnostico(String diagnosticoId, Diagnostico diagnostico);
    }
}
