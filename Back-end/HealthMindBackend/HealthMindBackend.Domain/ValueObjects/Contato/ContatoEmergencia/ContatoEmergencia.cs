using HealthMindBackend.Domain.ValueObjects.Base;
using HealthMindBackend.Domain.ValueObjects.Endereco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Contato.ContatoEmergencia
{
    public class ContatoEmergencia : ValueObject
    {
        public String ProntuarioId { get; private set; }
        public String Nome { get; private set; }
        public Telefone Telefone { get; private set; }
        public String RelacaoParentesco { get; private set; }
        public String Endereco { get; private set; }
        public Cep Cep { get; private set; }

        public ContatoEmergencia()
        {
        }
        public ContatoEmergencia(String nome, Telefone telefone, String relacaoParentesco, String endereco, Cep cep)
        {
            Nome = nome;
            Telefone = telefone;
            RelacaoParentesco = relacaoParentesco;
            Endereco = endereco;
            Cep = cep;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                ProntuarioId,
                Nome,
                Telefone,
                RelacaoParentesco,
                Endereco,
                Cep
            };
        }
    }
}
