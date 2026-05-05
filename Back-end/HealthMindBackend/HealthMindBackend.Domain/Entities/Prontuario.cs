using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class Prontuario : Identity
    {
        public String PacienteId { get; private set; }
        public String Descricao { get; private set; }
        public DateTime DataAbertura { get; private set; }
        public StatusProntuarioEnum StatusProntuario { get; private set; }
        public List<Medicamento> Medicamentos { get; private set; }

        public Prontuario(String pacienteId, String descricao, DateTime dataAbertura, StatusProntuarioEnum statusProntuario) : base(Prefix.Prontuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, dataAbertura, statusProntuario);
        }

        private void ValidateProntuarioDomain(String pacienteId, String descricao, DateTime dataAbertura, StatusProntuarioEnum statusProntuario)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Referência ao paciente invalida.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(descricao), "Descrição do prontuário inválida");
            DomainExceptionValidation.Validate(statusProntuario == StatusProntuarioEnum.StsNone, "Status do prontuário inválido");

            PacienteId = pacienteId;
            Descricao = descricao;
            DataAbertura = dataAbertura;
            StatusProntuario = statusProntuario;
        }

        public void Update(String pacienteId, String descricao, DateTime dataAbertura, StatusProntuarioEnum statusProntuario)
        {
            ValidateProntuarioDomain(pacienteId, descricao, dataAbertura, statusProntuario);
        }
    }
}
