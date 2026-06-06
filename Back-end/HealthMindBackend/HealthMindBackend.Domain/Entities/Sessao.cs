using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    [BsonDiscriminator("SESSAO")]
    public class Sessao : Identity
    {
        public String PacienteId { get; private set; }
        public String PsicologoId { get; private set; }
        public DateTime DataSessao { get; private set; }
        public TimeSpan HoraInicio { get; private set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; set; }
        public Pagamento? Pagamento { get; set; }
        //public StatusSessaoEnum StatusSessao { get; private set; }
        public List<RegistroSessao>? RegistrosSessoes { get; private set; }
        public List<EscalaSessao>? EscalasSessoes { get; private set; }


        public Sessao()
        {
        }

        public Sessao(String id, String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio,
            StatusTipoAtendimentoEnum statusTipoAtendimento)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            DefinirId(id);
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, statusTipoAtendimento);
        }

        public Sessao(String pacienteId, String psicologoId,
            DateTime dataSessao,
            TimeSpan horaInicio,
            StatusTipoAtendimentoEnum statusTipoAtendimento)
        {
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, statusTipoAtendimento);
            RegistrosSessoes = new List<RegistroSessao>();
            EscalasSessoes = new List<EscalaSessao>();
        }

        public Sessao(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio,
            StatusTipoAtendimentoEnum statusTipoAtendimento,
            Pagamento? pagamento
            )
        {
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, statusTipoAtendimento);
            Pagamento = pagamento;
        }


        private void ValidateSessaoDomain(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio, StatusTipoAtendimentoEnum statusTipoAtendimento)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(pacienteId), "Id do paciente inválido.");
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(psicologoId), "Id do psicologo inválido.");
            DomainExceptionValidation.Validate(dataSessao == DateTime.MinValue, "Data sessão inválida.");
            DomainExceptionValidation.Validate(horaInicio == TimeSpan.Zero || horaInicio == TimeSpan.MinValue, "Hora sessão inválida.");
            DomainExceptionValidation.Validate(statusTipoAtendimento == StatusTipoAtendimentoEnum.StsNone, "Tipo de atendimento inválido.");


            PacienteId = pacienteId;
            PsicologoId = psicologoId;
            DataSessao = dataSessao;
            HoraInicio = horaInicio;
            StatusTipoAtendimento = statusTipoAtendimento;
        }

        public void Update(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio, StatusTipoAtendimentoEnum statusTipoAtendimento)
        {
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, statusTipoAtendimento);
        }
    }
}

