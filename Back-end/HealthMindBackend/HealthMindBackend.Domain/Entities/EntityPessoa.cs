using HealthMindBackend.Domain.ValueObjects;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public abstract class EntityPessoa : Identity
    {
        public String Nome { get; protected set; }
        public Email Email { get; protected set; }
        public CpfCnpj CpfCnpj { get; protected set; }

        public EntityPessoa()
        {
        }

        public EntityPessoa(String id, String nome, Email email, CpfCnpj cpfCnpj)
        {
            DefinirId(id);
            Nome = nome;
            Email = email;
            CpfCnpj = cpfCnpj;
        }
    }
}
