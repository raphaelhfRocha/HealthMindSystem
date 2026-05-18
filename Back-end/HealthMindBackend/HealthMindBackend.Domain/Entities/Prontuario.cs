using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
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
        public String Descricao { get; private set; }
        public DateTime DataAbertura { get; private set; }
        public StatusProntuarioEnum StatusProntuario { get; private set; }

        /// <summary>
        /// Lista de medicamentos associados ao prontuÃ¡rio.
        /// Inicializada como vazia para permitir adicionar medicamentos depois.
        /// </summary>
        public List<Medicamento> Medicamentos { get; private set; } = new List<Medicamento>();

        public Prontuario()
        {
            Medicamentos = new List<Medicamento>();
        }
        public Prontuario(String pacienteId, String descricao, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, DateTime.UtcNow, statusProntuario);
        }
        public Prontuario(String pacienteId, String descricao, DateTime dataAbertura, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, dataAbertura, statusProntuario);
        }
        public Prontuario(String pacienteId, String descricao, StatusProntuarioEnum statusProntuario, List<Medicamento>? medicamentos)
        {
            ValidateProntuarioDomain(pacienteId, descricao, DateTime.UtcNow, statusProntuario);
            Medicamentos = medicamentos;
        }
        public Prontuario(String pacienteId, String descricao, DateTime dataAbertura, StatusProntuarioEnum statusProntuario, List<Medicamento>? medicamentos)
        {
            ValidateProntuarioDomain(pacienteId, descricao, dataAbertura, statusProntuario);
            Medicamentos = medicamentos;
        }

        private void ValidateProntuarioDomain(String pacienteId, String descricao, DateTime dataAbertura, StatusProntuarioEnum statusProntuario)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Referência ao paciente invalida.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(descricao), "Descrição do prontuário inválida");
            DomainExceptionValidation.Validate(dataAbertura == DateTime.MinValue, "Data de abertura inválida");
            DomainExceptionValidation.Validate(statusProntuario == StatusProntuarioEnum.StsNone, "Status do prontuário inválido");

            PacienteId = pacienteId;
            Descricao = descricao;
            DataAbertura = dataAbertura;
            StatusProntuario = statusProntuario;
        }

        public void Update(String pacienteId, String descricao, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, DataAbertura, statusProntuario);
        }
    }
}

