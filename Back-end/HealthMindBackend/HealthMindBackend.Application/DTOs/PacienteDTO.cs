using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class PacienteDTO
    {
        public String Id { get; set; }
        public String Nome { get; set; }
        public String Email { get; set; }
        public CpfCnpj CpfCnpj { get; set; }
        public DateTime DataNascimento { get; set; }
        public ProntuarioDTO Prontuario { get; set; }
    }
}
