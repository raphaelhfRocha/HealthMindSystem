using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
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
        Task<Psicologo> GetPsicologoByUsuarioId(String usuarioId);
        Task<Psicologo> GetPsicologoByEmail(Email email);
        Task<Psicologo> GetPsicologoByCpfCnpj(CpfCnpj cpfCnpj);
        Task<Psicologo> GetPsicologoByCrp(Crp crp);
        Task<List<Psicologo>> GetPsicologosByNome(String nome);
        Task<List<Psicologo>> GetPsicologosByEspecialidade(String especialidade);
        Task<List<Disponibilidade>> GetDisponibilidadesByPsicologoId(String psicologoId);
        Task<Disponibilidade> GetDisponibilidadeByPsicologoIdAndDisponibilidadeId(String psicologoId, String disponibilidadeId);
        Task<Psicologo> CadastrarPsicologo(Psicologo psicologo);
        Task<Disponibilidade> AdicionarDisponibilidade(String psicologoId, Disponibilidade disponibilidade);
        Task<Psicologo> EditarPsicologo(String psicologoId, Psicologo psicologo);
        Task<Disponibilidade> AlterarStatusDisponibilidade(String psicologoId, String disponibilidadeId, Disponibilidade disponibilidade);
        Task ExcluirPsicologo(String psicologoId);
        Task ExcluirDisponibilidade(String psicologoId, String disponibilidadeId);
    }
}