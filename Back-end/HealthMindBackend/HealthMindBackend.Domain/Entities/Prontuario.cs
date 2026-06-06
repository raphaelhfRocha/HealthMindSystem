using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Contato.ContatoEmergencia;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    [BsonIgnoreExtraElements]
    public class Prontuario : Identity
    {
        public String PacienteId { get; private set; }
        public String? Anotacoes { get; private set; }
        public DateTime DataAbertura { get; private set; }
        public StatusProntuarioEnum StatusProntuario { get; private set; }
        public ContatoEmergencia? ContatoEmergencia { get; set; }
        public List<Medicamento>? Medicamentos { get; private set; }

        public Prontuario()
        {
        }
        public Prontuario(String pacienteId, String? anotacoes, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, anotacoes, statusProntuario);
            DataAbertura = DateTime.UtcNow;
        }

        public Prontuario(String pacienteId, String? anotacoes, StatusProntuarioEnum statusProntuario, List<Medicamento>? medicamentos)
        {
            ValidateProntuarioDomain(pacienteId, anotacoes, statusProntuario);
            DataAbertura = DateTime.UtcNow;
            Medicamentos = medicamentos;
        }
        public Prontuario(String pacienteId, String? anotacoes, DateTime dataAbertura, StatusProntuarioEnum statusProntuario, List<Medicamento>? medicamentos)
        {
            ValidateProntuarioDomain(pacienteId, anotacoes, statusProntuario);
            DomainExceptionValidation.Validate(dataAbertura == DateTime.MinValue, "Data de abertura inválida");
            DataAbertura = dataAbertura;
            Medicamentos = medicamentos;
        }

        private void ValidateProntuarioDomain(String pacienteId, String? anotacoes, StatusProntuarioEnum statusProntuario)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Referência ao paciente invalida.");
            //DomainExceptionValidation.Validate(String.IsNullOrEmpty(anotacoes), "Descrição do prontuário inválida");
            DomainExceptionValidation.Validate(statusProntuario == StatusProntuarioEnum.StsNone, "Status do prontuário inválido");

            PacienteId = pacienteId;
            Anotacoes = anotacoes;
            StatusProntuario = statusProntuario;
        }

        public void Update(String pacienteId, String? anotacoes, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, anotacoes, statusProntuario);
        }
    }
}

