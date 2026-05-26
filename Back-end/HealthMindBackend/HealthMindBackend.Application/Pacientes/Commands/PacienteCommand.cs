using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Convenios.PlanoSaudePaciente;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pacientes.Commands
{
    public abstract class PacienteCommand : IRequest<Paciente>
    {
        public String Nome { get; set; }
        public Email Email { get; set; }
        public CpfCnpj CpfCnpj { get; set; }
        public Telefone Telefone { get; set; }
        public DateTime DataNascimento { get; set; }
        public PlanoSaudePaciente? PlanoSaudePaciente { get; set; }
        public String PsicologoId { get; set; }
    }
}
