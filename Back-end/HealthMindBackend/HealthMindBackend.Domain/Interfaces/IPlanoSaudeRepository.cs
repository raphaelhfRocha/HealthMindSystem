using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
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
        Task<CoberturaPlano> GetCoberturaPlanoByPlanoSaudeIdAndEspecialidade(String planoSaudeId, String especialidade);
        Task<CoberturaPlano> RegistrarCoberturaPlano(String planoSaudeId, CoberturaPlano coberturaPlano);
        Task<CoberturaPlano> AtualizarCoberturaPlano(String planoSaudeId, String especialidade, CoberturaPlano coberturaAtualizada);
        Task RemoverCoberturaPlano(String planoSaudeId, String especialidade);
    }
}
