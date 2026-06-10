using HealthMindBackend.Domain.Enums;

namespace HealthMindBackend.API.DTOs
{
    public class RecepcionistaEdicaoDTO
    {
        public String Id { get; set; }
        public String Nome { get; set; }
        public String Email { get; set; }
        public String? Senha { get; set; }
        public String CpfCnpj { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
        public Boolean RegenerarCredenciais { get; set; }
    }
}
