using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    [BsonDiscriminator("PSICOLOGO")]
    public class Psicologo : Usuario
    {
        public String UsuarioId { get; private set; }
        public String Crp { get; private set; }
        public String Especialidade { get; private set; }
        [BsonElement("disponibilidades")]
        public List<Disponibilidade>? Disponibilidades { get; private set; } = new List<Disponibilidade>();

        public Psicologo()
        {
        }
        public Psicologo(String id, String nome, String email, String senha, StatusCargoEnum cargo, StatusRoleEnum role, String cpfCnpj, String usuarioId, String crp, String especialidade) : base(id, nome, email, cargo, role, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "O Id não pode ser menor ou igual a zero");
            ValidateUserDomain(nome, email, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
            UsuarioId = usuarioId;
        }
        public Psicologo(String nome, String email, String senha, StatusCargoEnum cargo, StatusRoleEnum role, String cpfCnpj, String crp, String especialidade) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, email, cargo, role, cpfCnpj);
            Senha = senha;
            ValidatePsicologoDomain(cargo, crp, especialidade);
        }

        public Psicologo(String nome, String email, StatusCargoEnum cargo, StatusRoleEnum role, String cpfCnpj, String crp, String especialidade) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, email, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
        }

        public Psicologo(String nome, String email, StatusCargoEnum cargo, StatusRoleEnum role, String cpfCnpj, String crp, String especialidade, List<Disponibilidade>? disponibilidades) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, email, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
            Disponibilidades = disponibilidades;
        }

        private void ValidatePsicologoDomain(StatusCargoEnum cargo, String crp, String especialidade)
        {
            DomainExceptionValidation.Validate(cargo != StatusCargoEnum.StsPsicologo, "Cargo inválido para psicólogo");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(especialidade), "Especialidade está vazia.");

            Crp = crp;
            Especialidade = especialidade;
        }

        public void Update(String nome, String email, StatusCargoEnum cargo, StatusRoleEnum role, String cpfCnpj, String crp, String especialidade)
        {
            ValidateUserDomain(nome, email, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
        }
    }
}
