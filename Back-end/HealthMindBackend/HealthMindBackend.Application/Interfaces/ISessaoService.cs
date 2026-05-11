using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface ISessaoService
    {
        Task<IEnumerable<SessaoDTO>> GetAllSessoes();
        Task<List<SessaoDTO>> GetSessoesByPsicologoId(String psicologoId);
        Task<SessaoDTO> GetSessaoById(String sessaoId);
        Task<SessaoDTO> AgendarSessao(SessaoDTO sessaoDto);
        Task AlterarSessao(SessaoDTO sessaoDto);
        Task DefinirPagamento(PagamentoDTO pagamentoDto);
        Task ExcluirPagamento(String sessaoId);
    }
}
