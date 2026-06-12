using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class PsicologoDTO
    {
        public String? Id { get; set; }
        public String Nome { get; set; }
        public String? Email { get; set; }
        public String? Senha { get; set; }
        public String CpfCnpj { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
        public String UsuarioId { get; set; }
        public String Crp { get; set; }
        public String Especialidade { get; set; }
        public Decimal ValorConsulta { get; set; }
        public Boolean RegenerarCredenciais { get; set; }
        public List<DisponibilidadeDTO>? DisponibilidadesDTO { get; set; }
    }
}
