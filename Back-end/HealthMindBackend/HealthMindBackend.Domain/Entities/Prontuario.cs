using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using MongoDB.Bson;
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
        [BsonRepresentation(BsonType.String)]
        public StatusProntuarioEnum StatusProntuario { get; private set; }

        /// <summary>
        /// Lista de medicamentos associados ao prontuário.
        /// Inicializada como vazia para permitir adicionar medicamentos depois.
        /// </summary>
        public List<Medicamento> Medicamentos { get; private set; } = new List<Medicamento>();

        public Prontuario()
        {
            Medicamentos = new List<Medicamento>();
        }
        public Prontuario(String pacienteId, String descricao, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, statusProntuario);
        }

        private void ValidateProntuarioDomain(String pacienteId, String descricao, StatusProntuarioEnum statusProntuario)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Referência ao paciente invalida.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(descricao), "Descrição do prontuário inválida");
            DomainExceptionValidation.Validate(statusProntuario == StatusProntuarioEnum.StsNone, "Status do prontuário inválido");

            PacienteId = pacienteId;
            Descricao = descricao;
            StatusProntuario = statusProntuario;
        }

        public void Update(String pacienteId, String descricao, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, statusProntuario);
        }
    }
}
