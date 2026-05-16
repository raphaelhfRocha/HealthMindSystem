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
    [BsonDiscriminator("PACIENTE")]
    public class Paciente : EntityPessoa
    {
        public DateTime DataNascimento { get; private set; }
        public String PsicologoId { get; private set; }

        public Paciente()
        {
        }

        public Paciente(String id, String nome, String email, String cpfCnpj, String psicologoId, DateTime dataNascimento) : base(id, nome, email, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id do paciente inválido.");
            ValidatePacienteDomain(nome, email, cpfCnpj, psicologoId, dataNascimento);
        }

        public Paciente(String nome, String email, String cpfCnpj, String psicologoId, DateTime dataNascimento)
        {
            ValidatePacienteDomain(nome, email, cpfCnpj, psicologoId, dataNascimento);
        }

        private void ValidatePacienteDomain(String nome, String email, String cpfCnpj, String psicologoId, DateTime dataNascimento)
        {
            Nome = nome;
            Email = email;
            CpfCnpj = cpfCnpj;
            PsicologoId = psicologoId;
            DataNascimento = dataNascimento;
        }

        public void Update(String nome, String email, String cpfCnpj, String psicologoId, DateTime dataNascimento)
        {
            ValidatePacienteDomain(nome, email, cpfCnpj, psicologoId, dataNascimento);
        }
    }
}
