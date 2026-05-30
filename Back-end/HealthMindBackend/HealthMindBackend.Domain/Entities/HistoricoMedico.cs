using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
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
        public String RazaoAtendimento { get; private set; }
        public String ImpactoRazao { get; private set; }
        public String ExpectativaAtendimento { get; private set; }
        public DateTime DataRegistro { get; private set; }
        public SaudeMental SaudeMental { get; set; }
        public List<MetaTerapeutica>? MetasTerapeuticas { get; private set; }

        public HistoricoMedico()
        {
        }

        public HistoricoMedico(String pacienteId, String prontuarioId, String razaoAtendimento, String impactoRazao, String expectativaAtendimento, DateTime dataRegistro)
        {
            ValidateHistoricoMedicoDomain(pacienteId, prontuarioId, razaoAtendimento, impactoRazao, expectativaAtendimento, dataRegistro);
        }

        public HistoricoMedico(String pacienteId, String prontuarioId, String razaoAtendimento, String impactoRazao, String expectativaAtendimento, DateTime dataRegistro, List<MetaTerapeutica>? metasTerapeuticas)
        {
            ValidateHistoricoMedicoDomain(pacienteId, prontuarioId, razaoAtendimento, impactoRazao, expectativaAtendimento, dataRegistro);
            MetasTerapeuticas = metasTerapeuticas;
        }

        private void ValidateHistoricoMedicoDomain(String pacienteId, String prontuarioId, String razaoAtendimento, String impactoRazao, String expectativaAtendimento, DateTime dataRegistro)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Id do paciente inválido");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(prontuarioId), "Id do prontuario inválido");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(razaoAtendimento), "Razão Atendimento inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(impactoRazao), "Impacto da razão inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(expectativaAtendimento), "Expectativa Atendimento inválido.");

            PacienteId = pacienteId;
            ProntuarioId = prontuarioId;
            RazaoAtendimento = razaoAtendimento;
            ImpactoRazao = impactoRazao;
            DataRegistro = dataRegistro;
        }

        public void Update(String id, String pacienteId, String prontuarioId, String razaoAtendimento, String impactoRazao, String expectativaAtendimento, DateTime dataRegistro)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id histórico médico inválido.");
            Id = id;
            ValidateHistoricoMedicoDomain(pacienteId, prontuarioId, razaoAtendimento, impactoRazao, expectativaAtendimento, dataRegistro);
        }
    }
}
