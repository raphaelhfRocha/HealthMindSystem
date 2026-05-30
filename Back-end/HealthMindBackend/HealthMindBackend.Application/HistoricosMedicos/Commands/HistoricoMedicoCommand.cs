using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Application.MetasTerapeuticas.Commands;
using HealthMindBackend.Application.RegistrosSessoes.Commands;
using HealthMindBackend.Application.SaudesMentais.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Commands
{
    public abstract class HistoricoMedicoCommand : IRequest<HistoricoMedico>
    {
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        public String RazaoAtendimento { get; set; }
        public String ImpactoRazao { get; set; }
        public String ExpectativaAtendimento { get; set; }
        public DateTime DataRegistro { get; set; }
        public SaudeMentalCommand? SaudeMentalCommand { get; set; }
        public List<MetaTerapeutica>? MetasTerapeuticas { get; set; }
    }
}
