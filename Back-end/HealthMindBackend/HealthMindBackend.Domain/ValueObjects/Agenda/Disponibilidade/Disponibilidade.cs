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
        public StatusDisponibilidadeEnum StatusDisponibilidade { get; private set; }

        public Disponibilidade()
        {
        }
        public Disponibilidade(String psicologoId, DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade)
        {
            Id = $"DIS-{Guid.NewGuid():N}";
            DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio, statusDisponibilidade);
            PsicologoId = psicologoId;
        }
        public Disponibilidade(DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade)
        {
            Id = $"DIS-{Guid.NewGuid():N}";
            DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio, statusDisponibilidade);
        }

        public void DomainDisponibilidadeValidate(DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade)
        {
            DataDisponibilidade = dataDisponibilidade;
            HoraInicio = horaInicio;
            StatusDisponibilidade = statusDisponibilidade;
        }

        public void Update(DateTime dataDisponibilidade, TimeSpan horaInicio, StatusDisponibilidadeEnum statusDisponibilidade)
        {
            DomainDisponibilidadeValidate(dataDisponibilidade, horaInicio, statusDisponibilidade);
        }

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
