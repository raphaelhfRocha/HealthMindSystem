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
    [BsonDiscriminator("SESSAO")]
    public class Sessao : Identity
    {
        public String PacienteId { get; private set; }
        public String PsicologoId { get; private set; }
        public DateTime DataSessao { get; private set; }
        public TimeSpan HoraInicio { get; private set; }
        public String Observacoes { get; private set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; private set; }
        public Pagamento Pagamento { get; private set; }
        public StatusSessaoEnum StatusSessao { get; private set; }

        public Sessao()
        {
        }

        public Sessao(String id, String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio,
            String observacoes,
            StatusTipoAtendimentoEnum statusTipoAtendimento, StatusSessaoEnum statusSessao) : base(Prefix.Sessao)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id inválido.");
            Id = id;
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, observacoes, statusTipoAtendimento, statusSessao);
        }

        public Sessao(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio,
            String observacoes,
            StatusTipoAtendimentoEnum statusTipoAtendimento, StatusSessaoEnum statusSessao) : base(Prefix.Sessao)
        {
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, observacoes, statusTipoAtendimento, statusSessao);
        }

        public Sessao(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio,
            String observacoes, StatusTipoAtendimentoEnum statusTipoAtendimento,
            Pagamento pagamento, StatusSessaoEnum statusSessao
            ) : base(Prefix.Sessao)
        {
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, observacoes, statusTipoAtendimento, statusSessao);
            pagamento = new Pagamento(pagamento.Valor, pagamento.DataPagamento,
                pagamento.FormaPagamento, pagamento.StatusPagamento,
                pagamento.StatusParcelado, pagamento.TotalParcelas);
        }


        private void ValidateSessaoDomain(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio, String observacoes, StatusTipoAtendimentoEnum statusTipoAtendimento, StatusSessaoEnum statusSessao)
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
            Observacoes = observacoes;
            StatusTipoAtendimento = statusTipoAtendimento;
            StatusSessao = statusSessao;
        }

        public void Update(String pacienteId, String psicologoId, DateTime dataSessao, TimeSpan horaInicio, String observacoes, StatusTipoAtendimentoEnum statusTipoAtendimento, StatusSessaoEnum statusSessao)
        {
            ValidateSessaoDomain(pacienteId, psicologoId, dataSessao, horaInicio, observacoes, statusTipoAtendimento, statusSessao);
        }
    }
}
