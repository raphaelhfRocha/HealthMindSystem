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
    [BsonDiscriminator("USUARIO")]
    public abstract class Usuario : EntityPessoa
    {
        public String Senha { get; private set; }
        public StatusCargoEnum StatusCargo { get; private set; }
        public StatusRoleEnum StatusRole { get; private set; }

        public Usuario()
        {
        }

        public Usuario(String id, String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(Prefix.Usuario, nome, email, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            Id = id;
            ValidateUserDomain(nome, email, senha, statusCargo, statusRole, cpfCnpj);
        }

        public Usuario(String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(Prefix.Usuario, nome, email, cpfCnpj)
        {
            ValidateUserDomain(nome, email, senha, statusCargo, statusRole, cpfCnpj);
        }

        protected void ValidateUserDomain(String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(nome), "Nome está vazio.");
            DomainExceptionValidation.Validate(nome.Length < 8, "Nome do usuário deverá ter no mínimo 8 caracteres.");
            DomainExceptionValidation.Validate(nome.Length > 120, "Nome do usuário deverá ter no máximo 150 caracteres.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(email), "O e-mail está vazio.");
            DomainExceptionValidation.Validate(statusRole == StatusRoleEnum.StsNone, "Role inválida");
            DomainExceptionValidation.Validate(statusCargo == StatusCargoEnum.StsNone, "Cargo inválido");
            //DomainExceptionValidation.Validate(String.IsNullOrEmpty(cpfCnpj), "CPF/CNPJ está vazio.");
            //DomainExceptionValidation.Validate(cpfCnpj.Length < 11, "CPF/CNPJ deverá ter no mínimo 8 caracteres.");
            //DomainExceptionValidation.Validate(cpfCnpj.Length > 14, "CPF/CNPJ deverá ter no máximo 14 caracteres.");

            Nome = nome;
            Email = email;
            Senha = senha;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
        }
    }
}
