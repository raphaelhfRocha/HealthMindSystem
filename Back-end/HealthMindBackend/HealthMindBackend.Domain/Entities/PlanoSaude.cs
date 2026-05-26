using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class PlanoSaude : Identity
    {
        public String Nome { get; private set; }
        public String Codigo { get; private set; }
        public StatusPlanoSaudeEnum StatusPlanoSaude { get; private set; }
        public Telefone Telefone { get; private set; }
        public Email Email { get; private set; }
        public CoberturaPlano CoberturaPlano { get; private set; }

        public PlanoSaude()
        {
        }

        public PlanoSaude(String id, String nome, String codigo, StatusPlanoSaudeEnum statusPlanoSaude, Telefone telefone, Email email)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(Id), "Id Plano de Saúde Inválido");
            Id = id;
            ValidateDomainPlanoSaude(nome, codigo, statusPlanoSaude);
            Telefone = telefone;
            Email = email;
        }

        public PlanoSaude(String nome, String codigo, StatusPlanoSaudeEnum statusPlanoSaude, Telefone telefone, Email email)
        {
            ValidateDomainPlanoSaude(nome, codigo, statusPlanoSaude);
            Telefone = telefone;
            Email = email;
        }

        private void ValidateDomainPlanoSaude(String nome, String codigo, StatusPlanoSaudeEnum statusPlanoSaude)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(nome), "Plano de Saúde Inválido");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(codigo), "Código Plano de Saúde Inválido");

            Nome = nome;
            Codigo = codigo;
            StatusPlanoSaude = statusPlanoSaude;
        }

        public void Update(String nome, String codigo, StatusPlanoSaudeEnum statusPlanoSaude, Telefone telefone, Email email)
        {
            ValidateDomainPlanoSaude(nome, codigo, statusPlanoSaude);
            Telefone = telefone;
            Email = email;
        }
    }
}
