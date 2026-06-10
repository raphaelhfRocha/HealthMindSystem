using HealthMindBackend.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace HealthMindBackend.API.DTOs
{
    public class PsicologoCadastroDTO
    {
        public String Nome { get; set; }
        public String CpfCnpj { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
        public String Crp { get; set; }
        public String Especialidade { get; set; }
        public Decimal ValorConsulta { get; set; }
    }
}
