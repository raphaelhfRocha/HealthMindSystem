using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IProgressaoRepository
    {
        Task<IEnumerable<Progressao>> GetAllProgressoes();
        Task<Progressao> GetProgressaoById(String progressaoId);
        Task<Progressao> AdicionarProgressao(Progressao progressao);
        Task ExcluirProgressao(String progressaoId);
    }
}
