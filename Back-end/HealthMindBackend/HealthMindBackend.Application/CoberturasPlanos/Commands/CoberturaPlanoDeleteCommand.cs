using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.CoberturasPlanos.Commands
{
    public class CoberturaPlanoDeleteCommand : IRequest<CoberturaPlano>
    {
        public String PlanoSaudeId { get; set; }
        public String Especialidade { get; set; }

        public CoberturaPlanoDeleteCommand(String planoSaudeId, String especialidade)
        {
            PlanoSaudeId = planoSaudeId;
            Especialidade = especialidade;
        }
    }
}
