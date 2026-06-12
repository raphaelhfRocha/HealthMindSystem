using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Psicologos.Commands
{
    public abstract class PsicologoCommand : IRequest<Psicologo>
    {
        public String Nome { get; set; }
        public StatusCargoEnum StatusCargo { get; set; }
        public StatusRoleEnum StatusRole { get; set; }
        public CpfCnpj CpfCnpj { get; set; }
        public Crp Crp { get; set; }
        public String Especialidade { get; set; }
        public Decimal ValorConsulta { get; set; }
        public List<Disponibilidade>? Disponibilidades { get; set; }
    }
}
