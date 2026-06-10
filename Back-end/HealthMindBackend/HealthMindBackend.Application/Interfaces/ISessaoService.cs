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
        Task<List<SessaoDTO>> GetSessoesByPacienteId(String pacienteId);
        Task<List<SessaoDTO>> GetSessoesByPsicologoId(String psicologoId);
        Task<List<RegistroSessaoDTO>> GetRegistrosSessoesBySessaoId(String sessaoId);
        Task<List<EscalaSessaoDTO>> GetEscalasSessoesBySessaoId(String sessaoId);
        Task<SessaoDTO> GetSessaoById(String sessaoId);
        Task<SessaoDTO> AgendarSessao(SessaoDTO sessaoDto);
        Task AdicionarEscalaSessao(EscalaSessaoDTO escalaSessaoDto);
        Task AdicionarRegistroSessao(RegistroSessaoDTO registroSessaoDto);
        Task AlterarSessao(SessaoDTO sessaoDto);
        Task AlterarEscalaSessao(EscalaSessaoDTO escalaSessaoDto);
        Task ExcluirEscalaSessao(String sessaoId, String escalaSessaoId);
        Task AlterarRegistroSessao(RegistroSessaoDTO registroSessaoDto);
        Task ExcluirRegistroSessao(String sessaoId, String registroSessaoId);
        Task DefinirPagamento(PagamentoDTO pagamentoDto);
        Task ExcluirSessao(String sessaoId);
    }
}
