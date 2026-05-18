using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects;
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
        [Required(ErrorMessage = "Nome paciente obrigatório")]

        public String Nome { get; set; }
        [Required(ErrorMessage = "E-mail paciente obrigatório")]
        public String Email { get; set; }
        [Required(ErrorMessage = "CPF/CNPJ paciente obrigatório")]
        public String CpfCnpj { get; set; }
        [Required(ErrorMessage = "Data de nascimento obrigatória")]
        public DateTime DataNascimento { get; set; }
        public String PsicologoId { get; set; }
    }
}
