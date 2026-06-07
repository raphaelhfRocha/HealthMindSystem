using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class PlanoSaudeDTO
    {
        public String? Id { get; set; }
        public String Nome { get; set; }
        public String Codigo { get; set; }
        public StatusPlanoSaudeEnum StatusPlanoSaude { get; set; }
        public String Telefone { get; set; }
        public String Email { get; set; }
        public ICollection<CoberturaPlanoDTO>? CoberturasPlanoDTO { get; set; }
    }
}
