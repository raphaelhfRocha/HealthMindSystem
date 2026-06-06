using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IPlanoSaudeService
    {
        Task<IEnumerable<PlanoSaudeDTO>> GetAllPlanosSaude();
        Task RegistrarPlanoSaude(PlanoSaudeDTO planoSaudeDto);
        Task AtualizarPlanoSaude(PlanoSaudeDTO planoSaudeDto);
        Task RegistrarCoberturaPlano(String planoSaudeId, CoberturaPlanoDTO coberturaPlanoDto);
        Task AtualizarCoberturaPlano(String planoSaudeId, CoberturaPlanoDTO coberturaPlanoDto);
        Task RemoverCoberturaPlano(String planoSaudeId, String especialidade);

    }
}
