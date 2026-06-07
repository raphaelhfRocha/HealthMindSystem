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

        public String PacienteId { get; private set; }
        public String PlanoSaudeId { get; private set; }
        public String NumeroCarteirinha { get; private set; }
        public DateTime DataValidade { get; private set; }

        

        public PlanoSaudePaciente(String pacienteId, String planoSaudeId, String numeroCarteirinha, DateTime dataValidade)
        {
            PacienteId = pacienteId;
            PlanoSaudeId = planoSaudeId;
            NumeroCarteirinha = numeroCarteirinha;
            DataValidade = dataValidade;
        }

        public PlanoSaudePaciente(String planoSaudeId, String numeroCarteirinha, DateTime dataValidade)
        {
            PlanoSaudeId = planoSaudeId;
            NumeroCarteirinha = numeroCarteirinha;
            DataValidade = dataValidade;
        }

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
