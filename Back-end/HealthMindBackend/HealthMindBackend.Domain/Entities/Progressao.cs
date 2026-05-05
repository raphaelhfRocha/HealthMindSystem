using HealthMindBackend.Domain.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class Progressao : Identity
    {
        public String PacienteId { get; private set; }
        public String ProntuarioId { get; private set; }
        public String Descricao { get; private set; }
        public DateTime DataRegistro { get; private set; }

        public Progressao()
        {
        }

        public Progressao(String pacienteId, String prontuarioId, String descricao, DateTime dataRegistro) : base(Prefix.Progressao)
        {
            ValidateProgressoesDomain(pacienteId, prontuarioId, descricao, dataRegistro);
        }

        private void ValidateProgressoesDomain(String pacienteId, String prontuarioId, String descricao, DateTime dataRegistro)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Id do paciente inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(prontuarioId), "Id do prontuário inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(descricao), "Descrição da progressão inválida.");

            PacienteId = pacienteId;
            ProntuarioId = prontuarioId;
            Descricao = descricao;
            DataRegistro = dataRegistro;
        }
    }
}
