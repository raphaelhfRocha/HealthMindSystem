using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
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
    public class Recepcionista : Usuario
    {
        public Recepcionista()
        {
        }
        public Recepcionista(String id, String nome, Email email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(id, nome, email, senha, statusCargo, statusRole, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            ValidateUserDomain(nome, senha, statusCargo, statusRole);
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }

        public Recepcionista(String nome, Email email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(nome, email, senha, statusCargo, statusRole, cpfCnpj)
        {
            ValidateUserDomain(nome, senha, statusCargo, statusRole);
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }
        private void ValidateRecepcionistaDomain(StatusCargoEnum statusCargo, StatusRoleEnum statusRole)
        {
            DomainExceptionValidation.Validate(statusCargo != StatusCargoEnum.StsRecepcionista, "Cargo inválido para recepcionista");
            DomainExceptionValidation.Validate(statusRole != StatusRoleEnum.StsColaborador, "Role inválida para recepcionista");

            StatusCargo = statusCargo;
            StatusRole = statusRole;
        }

        public void Update(String nome, Email email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            ValidateUserDomain(nome, senha, statusCargo, statusRole);
            ValidateRecepcionistaDomain(statusCargo, statusRole);
            Email = email;
            CpfCnpj = cpfCnpj;
        }
    }
}
