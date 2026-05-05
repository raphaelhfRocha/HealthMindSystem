using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface ISessaoRepository
    {
        //Task<List<Sessao>> GetAllSessoes(Int32 page, Int32 pageSize);
        Task<IEnumerable<Sessao>> GetAllSessoes();
        Task<Sessao> GetSessaoById(String sessaoId);
        Task<List<Sessao>> GetSessoesByPsicologoId(String psicologoId);
        Task<Sessao> AgendarSessao(Sessao sessao);
        Task<Sessao> AlterarSessao(String id, Sessao sessao);
        Task ExcluirSessao(String id);
        Task<Pagamento> DefinirPagamento(String sessaoId, Pagamento pagamento);
        Task RemoverPagamento(String sessaoId);
    }
}
