using HealthMindBackend.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace HealthMindBackend.API.DTOs
{
    public class RecepcionistaCadastroDTO
    {
        public String Nome { get; set; }
        public String CpfCnpj { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
    }
}
