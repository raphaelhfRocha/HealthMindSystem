using HealthMindBackend.Domain.ValueObjects.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano
{
    public class CoberturaPlano : ValueObject
    {
        public String Especialidade { get; private set; }
        public Decimal PercentualCobertura { get; private set; }
        public Decimal ValorMaximoCobertura { get; private set; }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                Especialidade,
                PercentualCobertura,
                ValorMaximoCobertura
            };
        }
    }
}
