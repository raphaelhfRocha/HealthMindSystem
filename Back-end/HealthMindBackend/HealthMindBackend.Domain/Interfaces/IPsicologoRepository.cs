using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IPsicologoRepository
    {
        Task<IEnumerable<Psicologo>> GetAllPsicologos();
        Task<Psicologo> GetPsicologoById(String psicologoId);
        Task<List<Disponibilidade>> GetDisponibilidadesByPsicologoId(String psicologoId);
        Task<Disponibilidade> GetDisponibilidadeByPsicologoIdAndDisponibilidadeId(String psicologoId, String disponibilidadeId);
        Task<Psicologo> GetPsicologoByEmail(String email);
        Task<Psicologo> EditarPsicologo(String psicologoId, Psicologo psicologo);
        Task<Disponibilidade> AdicionarDisponibilidade(String psicologoId, Disponibilidade disponibilidade);
        Task ExcluirDisponibilidade(String psicologoId, String disponibilidadeId);
    }
}
