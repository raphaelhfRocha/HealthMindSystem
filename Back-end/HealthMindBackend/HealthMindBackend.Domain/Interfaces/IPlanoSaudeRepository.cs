using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IPlanoSaudeRepository
    {
        Task<IEnumerable<PlanoSaude>> GetAllPlanosSaude();
        Task<PlanoSaude> GetPlanoSaudeById(String planoSaudeId);
        Task<PlanoSaude> RegistrarPlanoSaude(PlanoSaude planoSaude);
        Task<PlanoSaude> AtualizarPlanoSaude(String planoSaudeId, PlanoSaude planoSaude);
    }
}
