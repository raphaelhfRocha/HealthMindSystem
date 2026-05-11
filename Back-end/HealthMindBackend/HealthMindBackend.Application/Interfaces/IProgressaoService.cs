using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IProgressaoService
    {
        Task<IEnumerable<ProgressaoDTO>> GetAllProgressoes();
        Task<List<ProgressaoDTO>> GetProgressoesByProntuarioId(String prontuarioId);
        Task AdicionarProgressao(ProgressaoDTO progressaoDto);
        Task ExcluirProgressao(String progressaoId);
    }
}
