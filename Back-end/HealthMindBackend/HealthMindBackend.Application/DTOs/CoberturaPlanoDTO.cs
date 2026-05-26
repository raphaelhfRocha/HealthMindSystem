using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class CoberturaPlanoDTO
    {
        public String Especialidade { get; set; }
        public Decimal PercentualCobertura { get; set; }
        public Decimal ValorMaximoCobertura { get; set; }
    }
}
