using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade
{
    [BsonIgnoreExtraElements]
    public class Disponibilidade : ValueObject
    {
        public String? Id { get; private set; }
        public String PsicologoId { get; set; }
        public DateTime DataDisponibilidade { get; private set; }
        public TimeSpan HoraInicio { get; private set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; private set; }
        public StatusDisponibilidadeEnum StatusDisponibilidade { get; private set; }

        public Disponibilidade()
        {
        }
        public Disponibilidade(String psicologoId, DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade, StatusTipoAtendimentoEnum statusTipoAtendimento)
        {
            Id = $"DIS-{Guid.NewGuid():N}";
            DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio);
            PsicologoId = psicologoId;
            StatusDisponibilidade = statusDisponibilidade;
            StatusTipoAtendimento = statusTipoAtendimento;
        }
        public Disponibilidade(String psicologoId, DateTime dataDisponibilidade, TimeSpan horaInicio, StatusTipoAtendimentoEnum statusTipoAtendimento)
        {
            Id = $"DIS-{Guid.NewGuid():N}";
            DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio);
            PsicologoId = psicologoId;
            StatusDisponibilidade = StatusDisponibilidadeEnum.StsDisponivel;
            StatusTipoAtendimento = statusTipoAtendimento;
        }
        public Disponibilidade(DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade)
        {
            Id = $"DIS-{Guid.NewGuid():N}";
            DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio);
            StatusDisponibilidade = statusDisponibilidade;
        }

        public void DomainDisponibilidadeValidate(DateTime dataDisponibilidade, TimeSpan horaInicio)
        {
            DataDisponibilidade = dataDisponibilidade;
            HoraInicio = horaInicio;
        }

        public void UpdateStatusDisponibilidadeToReservada()
        {
            StatusDisponibilidade = StatusDisponibilidadeEnum.StsReservada;
        }
        public void UpdateStatusDisponibilidadeToDisponivel()
        {
            StatusDisponibilidade = StatusDisponibilidadeEnum.StsDisponivel;
        }

        //public void Update(DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade)
        //{
        //    DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio);
        //    StatusDisponibilidade = statusDisponibilidade;
        //}

        public void DefinirId(String id)
        {
            DomainExceptionValidation.Validate(String.IsNullOrWhiteSpace(id), "Id inválido.");
            Id = id;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                Id,
                PsicologoId,
                DataDisponibilidade,
                HoraInicio,
                StatusDisponibilidade
            };
        }
    }
}
