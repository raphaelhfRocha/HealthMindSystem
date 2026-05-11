using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects;
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
        public String Email { get; set; }
        public String CpfCnpj { get; set; }
        public DateTime DataNascimento { get; set; }
        public String PsicologoId { get; set; }
    }
}
