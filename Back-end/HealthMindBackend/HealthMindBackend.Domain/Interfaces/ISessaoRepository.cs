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
        Task<IEnumerable<Sessao>> GetAllSessoes();
        Task<Sessao> GetSessaoById(String sessaoId);
        Task<List<Sessao>> GetSessoesByPsicologoId(String psicologoId);
        Task<Sessao> GetPagamentoBySessaoId(String sessaoId);
        Task<Sessao> AgendarSessao(Sessao sessao);
        Task<Sessao> AlterarSessao(String id, Sessao sessao);
        Task<Pagamento> DefinirPagamento(String sessaoId, Pagamento pagamento);
        Task RemoverPagamento(String sessaoId);
    }
}
