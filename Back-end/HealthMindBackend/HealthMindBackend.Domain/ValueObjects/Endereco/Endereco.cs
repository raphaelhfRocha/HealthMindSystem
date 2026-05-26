using HealthMindBackend.Domain.ValueObjects.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Endereco
{
    public class Endereco : ValueObject
    {
        public Cep Cep { get; private set; }
        public String Logradouro { get; private set; }
        public String Complemento { get; private set; }
        public String Bairro { get; private set; }
        public String UF { get; private set; }
        public String Localidade { get; private set; }
        public String Regiao { get; private set; }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                Cep,
                Logradouro,
                Complemento,
                Complemento,
                Bairro,
                UF,
                Localidade,
                Regiao
            };
        }
    }
}
