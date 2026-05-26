using HealthMindBackend.Domain.ValueObjects.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Convenios.PlanoSaudePaciente
{
    public class PlanoSaudePaciente : ValueObject
    {
        public String PlanoSaudeId { get; private set; }
        public String NumeroCarteirinha { get; private set; }
        public DateTime DataValidade { get; private set; }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                PlanoSaudeId,
                NumeroCarteirinha,
                DataValidade
            };
        }
    }
}
