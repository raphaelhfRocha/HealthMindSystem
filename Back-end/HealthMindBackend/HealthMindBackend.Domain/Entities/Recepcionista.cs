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
    [BsonDiscriminator("RECEPCIONISTA")]
    public class Recepcionista : Usuario
    {
        public Recepcionista(String id, String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(id, nome, email, statusCargo, statusRole, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            ValidateUserDomain(nome, email, statusCargo, statusRole, cpfCnpj);
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }

        public Recepcionista(String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, String cpfCnpj) : base(nome, email, senha, statusCargo, statusRole, cpfCnpj)
        {
            ValidateUserDomain(nome, email, statusCargo, statusRole, cpfCnpj);
            Senha = senha;
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }

        public Recepcionista(String nome, String email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, String cpfCnpj) : base(nome, email, statusCargo, statusRole, cpfCnpj)
        {
            ValidateUserDomain(nome, email, statusCargo, statusRole, cpfCnpj);
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }

        private void ValidateRecepcionistaDomain(StatusCargoEnum statusCargo, StatusRoleEnum statusRole)
        {
            DomainExceptionValidation.Validate(statusCargo != StatusCargoEnum.StsRecepcionista, "Cargo inválido para recepcionista");
            DomainExceptionValidation.Validate(statusRole != StatusRoleEnum.StsColaborador, "Role inválida para recepcionista");

            StatusCargo = statusCargo;
            StatusRole = statusRole;
        }

        public void Update(String nome, String email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, String cpfCnpj)
        {
            ValidateUserDomain(nome, email, statusCargo, statusRole, cpfCnpj);
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }
    }
}
