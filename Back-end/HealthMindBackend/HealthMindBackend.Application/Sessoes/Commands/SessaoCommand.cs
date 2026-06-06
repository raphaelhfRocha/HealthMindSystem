using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.RegistrosSessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Commands
{
    public abstract class SessaoCommand : IRequest<Sessao>
    {
        public String PacienteId { get; set; }
        public String PsicologoId { get; set; }
        public DateTime DataSessao { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; set; }
        public PagamentoCommand? PagamentoCommand { get; set; }
        public List<RegistroSessaoCommand>? RegistroSessoesCommand { get; set; }
        public List<EscalaSessaoCommand>? EscalasSessoesCommand { get; set; }

    }
}
