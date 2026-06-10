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
        public String UsuarioId { get; private set; }

        public Recepcionista()
        {
        }
        public Recepcionista(String id, String nome, Email? email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(id, nome, email, statusCargo, statusRole, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            ValidateUserDomain(nome, statusCargo, statusRole);
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }

        public Recepcionista(String id, String nome, Email? email, String? senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            Id = id;
            Nome = nome;
            Email = email;
            Senha = senha;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
        }

        public Recepcionista(String nome, Email? email, String? senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(nome, email, statusCargo, statusRole, cpfCnpj)
        {
            ValidateUserDomain(nome, statusCargo, statusRole);
            Senha = senha;
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidateRecepcionistaDomain(statusCargo, statusRole);
        }
        
        public Recepcionista(String nome, Email? email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj, String usuarioId) : base(nome, email, statusCargo, statusRole, cpfCnpj)
        {
            ValidateUserDomain(nome, statusCargo, statusRole);
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidateRecepcionistaDomain(statusCargo, statusRole);
            UsuarioId = usuarioId;
        }
        private void ValidateRecepcionistaDomain(StatusCargoEnum statusCargo, StatusRoleEnum statusRole)
        {
            DomainExceptionValidation.Validate(statusCargo != StatusCargoEnum.StsRecepcionista, "Cargo inválido para recepcionista");
            DomainExceptionValidation.Validate(statusRole != StatusRoleEnum.StsColaborador, "Role inválida para recepcionista");

            StatusCargo = statusCargo;
            StatusRole = statusRole;
        }

        public void Update(String nome, Email? email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            ValidateUserDomain(nome, statusCargo, statusRole);
            ValidateRecepcionistaDomain(statusCargo, statusRole);
            Email = email;
            CpfCnpj = cpfCnpj;
        }

        public void UpdateRecepcionista(String id, String nome, Email? email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj, String usuarioId)
        {
            Id = id;
            Nome = nome;
            Email = email;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
            UsuarioId = usuarioId;
        }
    }
}