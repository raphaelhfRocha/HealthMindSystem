using HealthMindBackend.Domain.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class HistoricoMedico : Identity
    {
        public String PacienteId { get; private set; }
        public String ProntuarioId { get; private set; }
        public String Descricao { get; private set; }
        public DateTime DataRegistro { get; private set; }

        public HistoricoMedico()
        {
        }

        public HistoricoMedico(String pacienteId, String prontuarioId, String descricao, DateTime dataRegistro) : base(Prefix.HistoricoMedico)
        {
            ValidateHistoricoMedicoDomain(pacienteId, prontuarioId, descricao, dataRegistro);
        }

        private void ValidateHistoricoMedicoDomain(String pacienteId, String prontuarioId, String descricao, DateTime dataRegistro)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Id do paciente inválido");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(prontuarioId), "Id do prontuario inválido");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(descricao), "Descrição do histórico médico inválido.");

            PacienteId = pacienteId;
            ProntuarioId = prontuarioId;
            Descricao = descricao;
            DataRegistro = dataRegistro;
        }

        public void Update(String pacienteId, String prontuarioId, String descricao, DateTime dataRegistro)
        {
            ValidateHistoricoMedicoDomain(pacienteId, prontuarioId, descricao, dataRegistro);
        }
    }
}
