using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IRecepcionistaRepository
    {
        Task<IEnumerable<Recepcionista>> GetAllRecepcionistas();
        Task<Recepcionista> GetRecepcionistaById(String id);
        Task<Recepcionista> GetRecepcionistaByEmail(String email);
        //Task<IEnumerable<Usuario>> GetUsuarioByStatusCargo(StatusCargoEnum statusCargo);
        Task CadastrarRecepcionista(Recepcionista recepcionista);
        Task<Recepcionista> EditarRecepcionista(String id, Recepcionista recepcionista);
        Task ExcluirRecepcionista(String id);
    }
}
