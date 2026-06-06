using HealthMindBackend.Domain.ValueObjects.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental
{
    public class SaudeMental : ValueObject
    {
        public String? HistoricoMedicoId { get; private set; }
        public String? DiagnosticoPrevio { get; private set; }
        public String? Acompanhamento { get; private set; }
        public String? StatusInternacao { get; private set; }
        public String? Antecedentes { get; private set; }

        public SaudeMental()
        {
        }

        public SaudeMental(String? historicoMedicoId, String? diagnosticoPrevio, String? acompanhamento, String? statusInternacao, String? antecedentes)
        {
            HistoricoMedicoId = historicoMedicoId;
            DiagnosticoPrevio = diagnosticoPrevio;
            Acompanhamento = acompanhamento;
            StatusInternacao = statusInternacao;
            Antecedentes = antecedentes;
        }
        public SaudeMental(String? diagnosticoPrevio, String? acompanhamento, String? statusInternacao, String? antecedentes)
        {
            DiagnosticoPrevio = diagnosticoPrevio;
            Acompanhamento = acompanhamento;
            StatusInternacao = statusInternacao;
            Antecedentes = antecedentes;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                DiagnosticoPrevio,
                Acompanhamento,
                StatusInternacao,
                Antecedentes
            };
        }
    }
}
