using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
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
        Task<Recepcionista> GetRecepcionistaByUsuarioId(String usuarioId);
        Task<Recepcionista> GetRecepcionistaByEmail(Email email);
        Task<Recepcionista> GetRecepcionistaByCpf(CpfCnpj cpf);
        Task<Recepcionista> CadastrarRecepcionista(Recepcionista recepcionista);
        Task<Recepcionista> EditarRecepcionista(String id, Recepcionista recepcionista);
        Task ExcluirRecepcionista(String id);
    }
}
