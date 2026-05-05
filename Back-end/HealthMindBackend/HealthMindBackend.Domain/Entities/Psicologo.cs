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

        public Psicologo()
        {
        }

        public Psicologo(String id, String nome, String email, String senha, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String usuarioId, String crp, String especialidade) : base(Prefix.Psicologo, nome, email, senha, cargo, role, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "O Id não pode ser menor ou igual a zero");
            Id = id;
            ValidateUserDomain(nome, email, senha, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
            UsuarioId = usuarioId;
        }

        public Psicologo(String id, String nome, String email, String senha, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String crp, String especialidade) : base(Prefix.Psicologo, nome, email, senha, cargo, role, cpfCnpj)
        {
            Id = id;
            ValidateUserDomain(nome, email, senha, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
        }

        public Psicologo(String nome, String email, String senha, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String crp, String especialidade) : base(nome, email, senha, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, email, senha, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
        }

        private void ValidatePsicologoDomain(StatusCargoEnum cargo, String crp, String especialidade)
        {
            DomainExceptionValidation.Validate(cargo != StatusCargoEnum.StsPsicologo, "Cargo inválido para psicólogo");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(crp), "CRP inválido.");
            DomainExceptionValidation.Validate(crp.Length < 6, "CRP deverá ter no mínimo 6 caracteres.");
            DomainExceptionValidation.Validate(crp.Length < 9, "CRP deverá ter no máximo 9 caracteres.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(especialidade), "Especialidade está vazia.");

            Crp = crp;
            Especialidade = especialidade;
        }

        public void Update(String nome, String email, String senha, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String crp, String especialidade)
        {
            ValidateUserDomain(nome, email, senha, cargo, role, cpfCnpj);
            ValidatePsicologoDomain(cargo, crp, especialidade);
        }
    }
}
