using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class Recepcionista : Usuario
    {
        public Recepcionista(String id, String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(Prefix.Usuario, nome, email, senha, statusCargo, statusRole, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            Id = id;
            ValidateUserDomain(nome, email, senha, statusCargo, statusRole, cpfCnpj);
        }

        public Recepcionista(String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj) : base(Prefix.Usuario, nome, email, senha, statusCargo, statusRole, cpfCnpj)
        {
            ValidateUserDomain(nome, email, senha, statusCargo, statusRole, cpfCnpj);
        }

        public void Update(String nome, String email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            ValidateUserDomain(nome, email, senha, statusCargo, statusRole, cpfCnpj);
        }
    }
}
