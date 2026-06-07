using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.PlanosSaude.Commands
{
    public class PlanoSaudeCommand : IRequest<PlanoSaude>
    {
        public String Nome { get; set; }
        public String Codigo { get; set; }
        public StatusPlanoSaudeEnum StatusPlanoSaude { get; set; } 
        public Telefone Telefone { get; set; }
        public Email Email { get; set; }
        public ICollection<CoberturaPlano>? CoberturasPlano { get; set; }
    }
}
