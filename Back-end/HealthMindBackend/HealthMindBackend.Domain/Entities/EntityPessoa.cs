using HealthMindBackend.Domain.ValueObjects;
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
        public String Email { get; protected set; }
        public CpfCnpj CpfCnpj { get; protected set; }

        public EntityPessoa()
        {
        }

        public EntityPessoa(String id, String nome, String email, CpfCnpj cpfCnpj)
        {
            Id = id;
            Nome = nome;
            Email = email;
            CpfCnpj = cpfCnpj;
        }
    }
}
