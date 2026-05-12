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
        Task CadastrarPsicologo(Psicologo psicologo);
        Task<Psicologo> EditarPsicologo(String psicologoId, Psicologo psicologo);
        Task ExcluirPsicologo(String psicologoId);
    }
}
