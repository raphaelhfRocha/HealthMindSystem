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
        public Prontuario Prontuario { get; private set; }
        
        public Paciente()
        {
        }

        public Paciente(String id, String nome, String email, CpfCnpj cpfCnpj, DateTime dataNascimento) : base(Prefix.Paciente, nome, email, cpfCnpj)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id do paciente inválido.");
            Id = id;
            ValidatePacienteDomain(nome, email, cpfCnpj, dataNascimento);
        }

        public Paciente(String nome, String email, CpfCnpj cpfCnpj, DateTime dataNascimento) : base(Prefix.Paciente, nome, email, cpfCnpj)
        {
            ValidatePacienteDomain(nome, email, cpfCnpj, dataNascimento);
        }

        private void ValidatePacienteDomain(String nome, String email, CpfCnpj cpfCnpj, DateTime dataNascimento)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(nome), "Nome do paciente inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(email), "E-mail do paciente inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(cpfCnpj), "CPF/CNPJ está vazio.");
            //DomainExceptionValidation.Validate(cpfCnpj.Length < 11, "CPF/CNPJ deverá ter no mínimo 8 caracteres.");
            //DomainExceptionValidation.Validate(cpfCnpj.Length > 14, "CPF/CNPJ deverá ter no máximo 14 caracteres.");

            Nome = nome;
            Email = email;
            CpfCnpj = cpfCnpj;
            DataNascimento = dataNascimento;
        }

        public void Update(String nome, String email, CpfCnpj cpfCnpj, DateTime dataNascimento)
        {
            ValidatePacienteDomain(nome, email, cpfCnpj, dataNascimento);
        }
    }
}
