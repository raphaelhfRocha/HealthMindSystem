using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IPsicologoService
    {
        Task<IEnumerable<PsicologoDTO>> GetAllPsicologos();
        Task<PsicologoDTO> GetPsicologoById(String psicologoId);
        Task<List<DisponibilidadeDTO>> GetDisponibilidadesByPsicologoId(String psicologoId);
        Task<List<PsicologoDTO>> GetPsicologosByNome(String nome);
        Task<List<PsicologoDTO>> GetPsicologosByEspecialidade(String especialidade);
        Task CadastrarPsicologo(PsicologoDTO psicologoDto);
        Task AtualizarPsicologo(PsicologoDTO psicologoDto);
        Task AdicionarDisponibilidade(DisponibilidadeDTO disponibilidadeDto);
        Task ExcluirDisponibilidade(String psicologoId, String disponibilidadeId);
    }
}
