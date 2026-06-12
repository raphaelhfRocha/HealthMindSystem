using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
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
        public Crp Crp { get; private set; }
        public String Especialidade { get; private set; }
        public Decimal ValorConsulta { get; private set; }
        public List<Disponibilidade>? Disponibilidades { get; private set; } = new List<Disponibilidade>();

        public Psicologo()
        {
        }

        public Psicologo(String id, String nome, Email? email, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String usuarioId, Crp crp, String especialidade, Decimal valorConsulta) : base(id, nome, email, cargo, role, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "O Id não pode ser menor ou igual a zero");
            ValidateUserDomain(nome, cargo, role);
            Email = email;
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
            Crp = crp;
            UsuarioId = usuarioId;
            CpfCnpj = cpfCnpj;

        }

        public Psicologo(String id, String nome, Email? email, String? senha, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, Crp crp, String especialidade, Decimal valorConsulta) : base(id, nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, cargo, role);
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
            Crp = crp;
        }

        public Psicologo(String nome, Email? email, String? senha, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, Crp crp, String especialidade, Decimal valorConsulta) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, cargo, role);
            Senha = senha;
            Email = email;
            CpfCnpj = cpfCnpj;
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
            Crp = crp;
        }
        public Psicologo(String nome, Email? email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            Nome = nome;
            Email = email;
            Senha = senha;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
        }
        public Psicologo(String nome, Email? email, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, Crp crp, String especialidade, Decimal valorConsulta) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, cargo, role);
            Email = email;
            Crp = crp;
            CpfCnpj = cpfCnpj;
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
        }
        public Psicologo(String nome, Email? email, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String usuarioId, Crp crp, String especialidade, Decimal valorConsulta, List<Disponibilidade>? disponibilidades) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, cargo, role);
            Email = email;
            UsuarioId = usuarioId;
            Crp = crp;
            CpfCnpj = cpfCnpj;
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
            Disponibilidades = disponibilidades;
        }
        public Psicologo(String nome, Email? email, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, String usuarioId, Crp crp, String especialidade, Decimal valorConsulta) : base(nome, email, cargo, role, cpfCnpj)
        {
            ValidateUserDomain(nome, cargo, role);
            //Email = email;
            UsuarioId = usuarioId;
            Crp = crp;
            CpfCnpj = cpfCnpj;
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
            Disponibilidades = new List<Disponibilidade>();
        }

        public Psicologo(String id, String nome, Email email, String senha, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj)
        {
            Id = id;
            Nome = nome;
            Email = email;
            Senha = senha;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
        }

        private void ValidatePsicologoDomain(StatusCargoEnum cargo, String especialidade, Decimal valorConsulta)
        {
            DomainExceptionValidation.Validate(cargo != StatusCargoEnum.StsPsicologo, "Cargo inválido para psicólogo");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(especialidade), "Especialidade está vazia.");
            Especialidade = especialidade;
            ValorConsulta = valorConsulta;
        }

        public void Update(String nome, Email? email, StatusCargoEnum cargo, StatusRoleEnum role, CpfCnpj cpfCnpj, Crp crp, String especialidade, Decimal valorConsulta)
        {
            ValidateUserDomain(nome, cargo, role);
            ValidatePsicologoDomain(cargo, especialidade, valorConsulta);
            Email = email;
            Crp = crp;
            CpfCnpj = cpfCnpj;
        }

        public void UpdatePsicologo(String id, String nome, Email? email, StatusCargoEnum statusCargo, StatusRoleEnum statusRole, CpfCnpj cpfCnpj, String usuarioId, Crp crp, String especialidade, Decimal valorConsulta)
        {
            Id = id;
            Nome = nome;
            Email = email;
            StatusCargo = statusCargo;
            StatusRole = statusRole;
            CpfCnpj = cpfCnpj;
            UsuarioId = usuarioId;
            Crp = crp;
            Especialidade = especialidade;
            ValorConsulta = valorConsulta;
        }
    }
}