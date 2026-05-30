using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class PacienteDTO
    {
        public String? Id { get; set; }
        public String Nome { get; set; }
        public String Email { get; set; }
        public String CpfCnpj { get; set; }
        public String Telefone { get; set; }
        public DateTime DataNascimento { get; set; }
        public PlanoSaudePacienteDTO? PlanoSaudePacienteDTO { get; set; }
        public String PsicologoId { get; set; }
    }
}
