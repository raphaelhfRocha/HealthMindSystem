using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.CoberturasPlanos.Commands
{
    public class CoberturaPlanoCommand : IRequest<CoberturaPlano>
    {
        public String Especialidade { get; set; }
        public Decimal PercentualCobertura { get; set; }
        public Decimal ValorMaximoCobertura { get; set; }
    }
}
