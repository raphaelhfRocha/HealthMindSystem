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
    [BsonKnownTypes(typeof(Psicologo), typeof(Recepcionista))]
    [BsonDiscriminator("USUARIO")]
    public abstract class Usuario : EntityPessoa
    {
        public String Senha { get; set; }
        public StatusCargoEnum StatusCargo { get; protected set; }
        public StatusRoleEnum StatusRole { get; protected set; }


        public Usuario(String id, String nome, String email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, String cpfCnpj) : base(id, nome, email, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            ValidateUserDomain(nome, email, statusCargo, statusRole, cpfCnpj);
        }

        public Usuario(String nome, String email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, String cpfCnpj)
        {
            ValidateUserDomain(nome, email, statusCargo, statusRole, cpfCnpj);
        }

        protected void ValidateUserDomain(String nome, String email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, String cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(nome), "Nome está vazio.");
            DomainExceptionValidation.Validate(nome.Length < 8, "Nome do usuário deverá ter no mínimo 8 caracteres.");
            DomainExceptionValidation.Validate(nome.Length > 120, "Nome do usuário deverá ter no máximo 150 caracteres.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(email), "O e-mail está vazio.");
            DomainExceptionValidation.Validate(statusRole == StatusRoleEnum.StsNone, "Role inválida");
            DomainExceptionValidation.Validate(statusCargo == StatusCargoEnum.StsNone, "Cargo inválido");

            Nome = nome;
            Email = email;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
        }
    }
}

