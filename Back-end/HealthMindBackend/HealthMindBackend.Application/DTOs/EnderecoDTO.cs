using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class EnderecoDTO
    {
        public String Cep { get; set; }
        public String Logradouro { get; set; }
        public String Complemento { get; set; }
        public String Bairro { get; set; }
        public String UF { get; set; }
        public String Localidade { get; set; }
        public String Regiao { get; set; }
    }
}
