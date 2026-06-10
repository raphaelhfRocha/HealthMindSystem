using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
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
        Task<List<Sessao>> GetSessoesByPacienteId(String pacienteId);
        Task<List<Sessao>> GetSessoesByPsicologoId(String psicologoId);
        Task<RegistroSessao> GetRegistrosSessoesBySessaoIdAndRegistroSessaoId(String sessaoId, String registroSessaoId);
        Task<List<RegistroSessao>> GetRegistrosSessoesBySessaoId(String sessaoId);
        Task<EscalaSessao> GetEscalaSessaoBySessaoIdAndEscalaSessaoId(String sessaoId, String escalaSessaoId);
        Task<EscalaSessao> GetEscalaSessaoBySessaoId(String sessaoId);
        Task<List<EscalaSessao>> GetEscalasSessoesBySessaoId(String sessaoId);
        Task<Sessao> GetPagamentoBySessaoId(String sessaoId);
        Task<Sessao> AgendarSessao(Sessao sessao);
        Task<Sessao> AlterarSessao(String sessaoId, Sessao sessao);
        Task ExcluirSessao(String sessaoId);
        Task<Pagamento> DefinirPagamento(String sessaoId, Pagamento pagamento);
        Task RemoverPagamento(String sessaoId);
        Task<RegistroSessao> AdicionarRegistroSessao(String sessaoId, RegistroSessao registroSessao);
        Task<RegistroSessao> AlterarRegistroSessao(String sessaoId, String registroSessaoId, RegistroSessao registroSessao);
        Task ExcluirRegistroSessao(String sessaoId, String registroSessaoId);
        Task<EscalaSessao> AdicionarEscalaSessao(String sessaoId, EscalaSessao escalaSessao);
        Task<EscalaSessao> AlterarEscalaSessao(String sessaoId, String escalaSessaoId, EscalaSessao escalaSessao);
        Task ExcluirEscalaSessao(String sessaoId, String escalaSessaoId);
    }
}
