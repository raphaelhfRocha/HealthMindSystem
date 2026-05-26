using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
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
        Task<Psicologo> GetPsicologoByEmail(String email);
        Task<Psicologo> GetPsicologoByCpfCnpj(String cpfCnpj);
        Task<Psicologo> GetPsicologoByCrp(String crp);
        Task<List<Psicologo>> GetPsicologosByNome(String nome);
        Task<List<Psicologo>> GetPsicologosByEspecialidade(String especialidade);
        Task<List<Disponibilidade>> GetDisponibilidadesByPsicologoId(String psicologoId);
        Task<Disponibilidade> GetDisponibilidadeByPsicologoIdAndDisponibilidadeId(String psicologoId, String disponibilidadeId);
        Task<Psicologo> CadastrarPsicologo(Psicologo psicologo);
        Task<Psicologo> EditarPsicologo(String psicologoId, Psicologo psicologo);
        Task ExcluirPsicologo(String psicologoId);
        Task<Disponibilidade> AdicionarDisponibilidade(String psicologoId, Disponibilidade disponibilidade);
        Task ExcluirDisponibilidade(String psicologoId, String disponibilidadeId);
    }
}
