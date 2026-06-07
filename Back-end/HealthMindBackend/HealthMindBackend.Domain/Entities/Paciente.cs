using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Convenios.PlanoSaudePaciente;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    [BsonDiscriminator("PACIENTE")]
    public class Paciente : EntityPessoa
    {
        public Telefone Telefone { get; private set; }
        public DateTime DataNascimento { get; private set; }
        public PlanoSaudePaciente? PlanoSaudePaciente { get; set; }
        public String PsicologoId { get; private set; }

        public Paciente()
        {
        }

        public Paciente(String id, String nome, Email email, CpfCnpj cpfCnpj, Telefone telefone, String psicologoId, DateTime dataNascimento) : base(id, nome, email, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id do paciente inválido.");
            ValidatePacienteDomain(nome, psicologoId, dataNascimento);
            Telefone = telefone;
            CpfCnpj = cpfCnpj;
        }

        public Paciente(String nome, Email email, CpfCnpj cpfCnpj, Telefone telefone, String psicologoId, DateTime dataNascimento, PlanoSaudePaciente? planoSaudePaciente)
        {
            ValidatePacienteDomain(nome, psicologoId, dataNascimento);
            Email = email;
            Telefone = telefone;
            CpfCnpj = cpfCnpj;
            PlanoSaudePaciente = planoSaudePaciente;
        }

        private void ValidatePacienteDomain(String nome, String psicologoId, DateTime dataNascimento)
        {
            Nome = nome;
            PsicologoId = psicologoId;
            DataNascimento = dataNascimento;
        }

        public void Update(String nome, Email email, CpfCnpj cpfCnpj, Telefone telefone, String psicologoId, DateTime dataNascimento, PlanoSaudePaciente? planoSaudePaciente)
        {
            ValidatePacienteDomain(nome, psicologoId, dataNascimento);
            Email = email;
            CpfCnpj = cpfCnpj;
            Telefone = telefone;
            PlanoSaudePaciente = planoSaudePaciente;
        }
    }
}
